import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { uploadMiddleware } from "./upload.middleware.js";
import { validateUploadedFile } from "../../lib/validation.js";
import { parseFile } from "../parser/parser.orchestrator.js";
import { scanDependencies } from "../scanner/osv.scanner.js";
import { computeRiskFindings } from "../risk/risk.engine.js";

export const scanRouter = Router();

/**
 * POST /api/scan
 * 1. Terima file upload (multer)
 * 2. Validasi nama, ukuran, dan konten (TASK_04)
 * 3. Parse dependency list (TASK_05)
 * 4. Scan OSV API untuk setiap dependency (TASK_06)
 * 5. Hitung risk score per package + overall (TASK_07)
 */
scanRouter.post(
  "/",
  // ── Middleware: multer upload ───────────────────────────────────────────────
  (req: Request, res: Response, next) => {
    uploadMiddleware.single("file")(req, res, (err) => {
      if (err) {
        const message =
          err instanceof Error ? err.message : "Gagal mengunggah file.";
        const isTooBig =
          err instanceof Error && err.message.includes("File too large");

        res.status(400).json({
          error: isTooBig
            ? "Ukuran file melebihi batas maksimum 5 MB."
            : message,
          code: isTooBig ? "FILE_TOO_LARGE" : "UPLOAD_ERROR",
        });
        return;
      }
      next();
    });
  },

  // ── Handler: validate → parse → scan → score ───────────────────────────────
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: "Tidak ada file yang diunggah. Pilih file terlebih dahulu.",
        code: "NO_FILE",
      });
      return;
    }

    const { originalname, buffer, size } = req.file;

    // Validasi konten (TASK_04)
    const validation = validateUploadedFile(originalname, buffer, size);
    if (!validation.valid) {
      res.status(422).json({ error: validation.error, code: validation.code });
      return;
    }

    // Parse dependency (TASK_05)
    let parseSummary;
    try {
      parseSummary = parseFile(buffer, validation.fileName);
    } catch (err) {
      console.error("[JagaRepo] Parse error:", err);
      res.status(422).json({
        error: "File tidak bisa diparse. Pastikan format dependency valid.",
        code: "PARSE_ERROR",
      });
      return;
    }

    // Scan OSV API (TASK_06)
    let osvScan;
    try {
      osvScan = await scanDependencies(parseSummary.dependencies);
    } catch (err) {
      console.error("[JagaRepo] Scan error:", err);
      res.status(500).json({
        error: "Gagal menjalankan scan vulnerability. Coba lagi.",
        code: "SCAN_ERROR",
      });
      return;
    }

    // Hitung risk score (TASK_07)
    const scanId = uuidv4();
    const scanResult = computeRiskFindings(parseSummary, osvScan, scanId);

    res.status(200).json({
      accepted: true,
      fileName: validation.fileName,
      ecosystem: validation.ecosystem,
      fileSize: validation.fileSize,
      // Parser output
      hasLockfile: parseSummary.hasLockfile,
      lockfileVersion: parseSummary.lockfileVersion,
      warnings: parseSummary.warnings,
      // Full scan result (includes findings + overall risk score)
      scan: {
        ...scanResult,
        usedMock: osvScan.usedMock,
      },
      message: buildMessage(
        validation.fileName,
        scanResult.totalDependencies,
        scanResult.vulnerableDependencies,
        scanResult.overallRiskCategory,
        osvScan.usedMock
      ),
    });
  }
);

function buildMessage(
  fileName: string,
  total: number,
  vulnerable: number,
  category: string,
  usedMock: boolean
): string {
  const mockNote = usedMock ? " (data demo)" : "";
  if (vulnerable === 0) {
    return `${fileName} berhasil di-scan${mockNote}. ${total} dependency diperiksa, tidak ada vulnerability yang diketahui.`;
  }
  return (
    `${fileName} berhasil di-scan${mockNote}. ${total} dependency diperiksa, ` +
    `${vulnerable} memiliki vulnerability yang diketahui. Risk: ${category}.`
  );
}

/**
 * GET /api/scan/:scanId
 * TASK_08 (Result Dashboard) akan menambahkan persistence dan GET result.
 */
scanRouter.get("/:scanId", (req: Request, res: Response) => {
  const { scanId } = req.params;
  res.status(404).json({
    error: `Hasil scan tidak ditemukan untuk ID: ${scanId}`,
    code: "NOT_FOUND",
  });
});
