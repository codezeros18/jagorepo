import { NextRequest, NextResponse } from "next/server";
import { generatePdfBuffer, type ReportData } from "@/lib/pdf-generator";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: ReportData;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body tidak valid.", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  if (!body?.scan || !body?.fileName) {
    return NextResponse.json(
      { error: "Data scan tidak lengkap. Pastikan mengirimkan hasil scan yang valid.", code: "INVALID_REPORT_DATA" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.scan.findings)) {
    return NextResponse.json(
      { error: "Data findings tidak valid. Ulangi scan dan coba unduh laporan kembali.", code: "INVALID_FINDINGS_DATA" },
      { status: 400 }
    );
  }

  if (!body.scan.scannedAt) {
    return NextResponse.json(
      { error: "Data scan tidak lengkap — tanggal scan tidak ditemukan.", code: "INVALID_REPORT_DATA" },
      { status: 400 }
    );
  }

  const safeFileName = body.fileName.replace(/[^a-z0-9_.-]/gi, "_").replace(/\.json$/i, "");
  const pdfFileName = `jagarepo-report-${safeFileName}.pdf`;

  try {
    const pdfBuffer = await generatePdfBuffer(body);
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfFileName}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("[JagaRepo] PDF generation error:", err);
    return NextResponse.json(
      { error: "Gagal membuat PDF report. Coba lagi.", code: "PDF_ERROR" },
      { status: 500 }
    );
  }
}
