import { Router, Request, Response } from "express";
import { generatePdfReport, type ReportData } from "./pdf-generator.js";

export const reportRouter = Router();

/**
 * POST /api/report
 * Accepts the full scan result in the request body and returns a PDF file.
 * Stateless — no scan storage required.
 */
reportRouter.post("/", (req: Request, res: Response) => {
  const body = req.body as ReportData;

  if (!body?.scan || !body?.fileName) {
    res.status(400).json({
      error: "Data scan tidak lengkap. Pastikan mengirimkan hasil scan yang valid.",
      code: "INVALID_REPORT_DATA",
    });
    return;
  }

  if (!Array.isArray(body.scan.findings)) {
    res.status(400).json({
      error: "Data findings tidak valid. Ulangi scan dan coba unduh laporan kembali.",
      code: "INVALID_FINDINGS_DATA",
    });
    return;
  }

  if (!body.scan.scannedAt) {
    res.status(400).json({
      error: "Data scan tidak lengkap — tanggal scan tidak ditemukan.",
      code: "INVALID_REPORT_DATA",
    });
    return;
  }

  const safeFileName = body.fileName.replace(/[^a-z0-9_.-]/gi, "_").replace(/\.json$/i, "");
  const pdfFileName = `jagarepo-report-${safeFileName}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${pdfFileName}"`);

  try {
    const doc = generatePdfReport(body, res);

    // Catch stream-level errors that happen after headers are already sent
    doc.on("error", (err: Error) => {
      console.error("[JagaRepo] PDF stream error:", err.message);
      // Headers already sent — can only destroy the connection
      if (!res.destroyed) res.destroy();
    });
  } catch (err) {
    console.error("[JagaRepo] PDF generation error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Gagal membuat PDF report. Coba lagi.",
        code: "PDF_ERROR",
      });
    }
  }
});
