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

  const safeFileName = body.fileName.replace(/[^a-z0-9_.-]/gi, "_").replace(/\.json$/i, "");
  const pdfFileName = `jagarepoo-report-${safeFileName}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${pdfFileName}"`);

  try {
    generatePdfReport(body, res);
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
