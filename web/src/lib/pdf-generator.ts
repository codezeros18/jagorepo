import PDFDocument from "pdfkit";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ReportVulnerability = {
  id: string;
  summary: string;
  severity?: string;
  publishedAt?: string;
  url?: string;
};

export type ReportFinding = {
  packageName: string;
  version?: string;
  ecosystem: string;
  riskScore: number;
  riskCategory: string;
  confidence: string;
  reasons: string[];
  vulnerabilities: ReportVulnerability[];
  recommendation: string;
};

export type ReportData = {
  fileName: string;
  ecosystem: string;
  hasLockfile: boolean;
  scan: {
    scanId: string;
    scannedAt: string;
    sourceFile: string;
    totalDependencies: number;
    vulnerableDependencies: number;
    overallRiskScore: number;
    overallRiskCategory: string;
    usedMock?: boolean;
    findings: ReportFinding[];
  };
};

// ── Color palette ─────────────────────────────────────────────────────────────

const COLOR = {
  primary:  "#4F46E5",
  text:     "#18181B",
  muted:    "#71717A",
  faint:    "#A1A1AA",
  bg:       "#F4F4F5",
  border:   "#E4E4E7",
  white:    "#FFFFFF",
  critical: "#DC2626",
  high:     "#EA580C",
  medium:   "#D97706",
  low:      "#16A34A",
};

function riskColor(cat: string): string {
  switch (cat.toLowerCase()) {
    case "critical": return COLOR.critical;
    case "high":     return COLOR.high;
    case "medium":   return COLOR.medium;
    case "low":      return COLOR.low;
    default:         return COLOR.muted;
  }
}

function riskLabel(cat: string): string {
  switch (cat) {
    case "Critical": return "Critical (Kritis)";
    case "High":     return "High (Tinggi)";
    case "Medium":   return "Medium (Sedang)";
    case "Low":      return "Low (Rendah)";
    default:         return cat;
  }
}

function severityLabel(sev?: string): string {
  if (!sev) return "—";
  switch (sev.toUpperCase()) {
    case "CRITICAL": return "Critical";
    case "HIGH":     return "High";
    case "MEDIUM":   return "Medium";
    case "LOW":      return "Low";
    default:         return sev;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function truncate(str: string | undefined | null, max: number): string {
  if (!str) return "—";
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

// ── Page layout ───────────────────────────────────────────────────────────────

const MARGIN = 50;
const PAGE_W = 595.28;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ── Drawing helpers ───────────────────────────────────────────────────────────

function hRule(doc: PDFKit.PDFDocument, y?: number) {
  const yPos = y ?? doc.y;
  doc.moveTo(MARGIN, yPos).lineTo(PAGE_W - MARGIN, yPos).strokeColor(COLOR.border).lineWidth(0.5).stroke();
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(0.8);
  doc.rect(MARGIN, doc.y, CONTENT_W, 22).fill(COLOR.bg);
  doc.fillColor(COLOR.primary).font("Helvetica-Bold").fontSize(9)
    .text(title.toUpperCase(), MARGIN + 8, doc.y - 18);
  doc.fillColor(COLOR.text).font("Helvetica").fontSize(10);
  doc.moveDown(0.5);
}

function kv(doc: PDFKit.PDFDocument, label: string, value: string, labelW = 130) {
  const startY = doc.y;
  doc.font("Helvetica-Bold").fontSize(9).fillColor(COLOR.muted)
    .text(label, MARGIN, startY, { width: labelW, lineBreak: false });
  doc.font("Helvetica").fontSize(9).fillColor(COLOR.text)
    .text(value, MARGIN + labelW, startY, { width: CONTENT_W - labelW });
}

type ColDef = { header: string; width: number; align?: "left" | "right" | "center" };

function drawTableHeader(doc: PDFKit.PDFDocument, cols: ColDef[], y: number): number {
  const rowH = 22;
  doc.rect(MARGIN, y, CONTENT_W, rowH).fill(COLOR.bg);
  let x = MARGIN;
  for (const col of cols) {
    doc.font("Helvetica-Bold").fontSize(8).fillColor(COLOR.muted)
      .text(col.header, x + 4, y + 7, { width: col.width - 8, align: col.align ?? "left", lineBreak: false });
    x += col.width;
  }
  return y + rowH;
}

function drawTableRow(
  doc: PDFKit.PDFDocument,
  cols: ColDef[],
  values: string[],
  y: number,
  shade: boolean,
  colors?: (string | null)[]
): number {
  const rowH = 20;
  if (shade) doc.rect(MARGIN, y, CONTENT_W, rowH).fill("#FAFAFA");
  let x = MARGIN;
  for (let i = 0; i < cols.length; i++) {
    const col = cols[i];
    const val = values[i] ?? "";
    const color = colors?.[i] ?? COLOR.text;
    doc.font(i === 0 ? "Helvetica-Bold" : "Helvetica").fontSize(8)
      .fillColor(color)
      .text(val, x + 4, y + 6, { width: col.width - 8, align: col.align ?? "left", lineBreak: false });
    x += col.width;
  }
  doc.moveTo(MARGIN, y + rowH).lineTo(PAGE_W - MARGIN, y + rowH)
    .strokeColor(COLOR.border).lineWidth(0.3).stroke();
  return y + rowH;
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > doc.page.height - MARGIN) doc.addPage();
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generatePdfBuffer(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: MARGIN, size: "A4", bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const { scan, fileName, ecosystem, hasLockfile } = data;
    const vulnFindings = scan.findings.filter((f) => f.vulnerabilities.length > 0);
    const safeFindings = scan.findings.filter((f) => f.vulnerabilities.length === 0);
    const sortedFindings = [...vulnFindings, ...safeFindings];

    // Header
    doc.rect(0, 0, PAGE_W, 6).fill(COLOR.primary);
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(18).fillColor(COLOR.primary)
      .text("JagaRepo", MARGIN, MARGIN + 10, { lineBreak: false });
    doc.font("Helvetica").fontSize(10).fillColor(COLOR.muted)
      .text(" — Laporan Keamanan Dependency", { continued: false });
    doc.moveDown(0.2);
    hRule(doc);

    doc.moveDown(0.6);
    doc.font("Helvetica-Bold").fontSize(13).fillColor(COLOR.text).text("Ringkasan Scan", MARGIN);
    doc.moveDown(0.5);

    kv(doc, "File", fileName);
    kv(doc, "Ekosistem", ecosystem === "PyPI" ? "Python (PyPI)" : "JavaScript (npm)");
    kv(doc, "Tanggal Scan", formatDate(scan.scannedAt));
    kv(doc, "Lockfile", hasLockfile ? "Ada" : "Tidak ada — versi dependency tidak terkunci");
    if (scan.usedMock) {
      kv(doc, "Data", "Contoh demonstrasi (data bukan dari OSV real)");
    }

    // Risk summary box
    doc.moveDown(0.8);
    const boxY = doc.y;
    const boxH = 80;
    doc.rect(MARGIN, boxY, CONTENT_W, boxH).fill(COLOR.bg);

    const scoreColor = riskColor(scan.overallRiskCategory);
    doc.font("Helvetica-Bold").fontSize(36).fillColor(scoreColor)
      .text(String(scan.overallRiskScore), MARGIN + 16, boxY + 14, { lineBreak: false });
    doc.font("Helvetica").fontSize(12).fillColor(COLOR.muted)
      .text("/100", { continued: false, lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(11).fillColor(scoreColor)
      .text(riskLabel(scan.overallRiskCategory), MARGIN + 16, boxY + 56);

    const statX = MARGIN + 160;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(COLOR.text)
      .text(`${scan.totalDependencies}`, statX, boxY + 14, { lineBreak: false });
    doc.font("Helvetica").fontSize(8).fillColor(COLOR.muted)
      .text("  dependency diperiksa", { lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(10).fillColor(scan.vulnerableDependencies > 0 ? COLOR.critical : COLOR.text)
      .text(`${scan.vulnerableDependencies}`, statX, boxY + 34, { lineBreak: false });
    doc.font("Helvetica").fontSize(8).fillColor(COLOR.muted)
      .text("  memiliki vulnerability", { lineBreak: false });
    const safe = scan.totalDependencies - scan.vulnerableDependencies;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(COLOR.low)
      .text(`${safe}`, statX, boxY + 54, { lineBreak: false });
    doc.font("Helvetica").fontSize(8).fillColor(COLOR.muted)
      .text("  package aman", { lineBreak: false });

    doc.y = boxY + boxH + 4;

    // Findings table
    sectionTitle(doc, "Tabel Dependency");
    const tableCols: ColDef[] = [
      { header: "PACKAGE",   width: 170 },
      { header: "VERSI",     width: 80  },
      { header: "EKOSISTEM", width: 75  },
      { header: "KATEGORI",  width: 80  },
      { header: "VULN",      width: 45, align: "right" },
      { header: "SCORE",     width: 45, align: "right" },
    ];

    let tableY = doc.y;
    tableY = drawTableHeader(doc, tableCols, tableY);

    for (let i = 0; i < sortedFindings.length; i++) {
      ensureSpace(doc, 22);
      if (doc.y !== tableY && i > 0) tableY = doc.y;
      const f = sortedFindings[i];
      const hasVuln = f.vulnerabilities.length > 0;
      tableY = drawTableRow(
        doc, tableCols,
        [
          truncate(f.packageName, 28),
          f.version ? truncate(f.version, 14) : "—",
          f.ecosystem,
          hasVuln ? f.riskCategory : "—",
          hasVuln ? String(f.vulnerabilities.length) : "0",
          String(f.riskScore),
        ],
        tableY, i % 2 === 1,
        [
          COLOR.text, COLOR.muted, COLOR.muted,
          hasVuln ? riskColor(f.riskCategory) : COLOR.muted,
          hasVuln ? riskColor(f.riskCategory) : COLOR.muted,
          hasVuln ? riskColor(f.riskCategory) : COLOR.muted,
        ]
      );
      doc.y = tableY;
    }

    // Per-finding detail
    if (vulnFindings.length > 0) {
      sectionTitle(doc, `Detail Temuan (${vulnFindings.length} Package Berisiko)`);

      for (const f of vulnFindings) {
        ensureSpace(doc, 80);
        doc.moveDown(0.3);

        const pkgBarY = doc.y;
        doc.rect(MARGIN, pkgBarY, CONTENT_W, 26).fill(riskColor(f.riskCategory) + "18");
        doc.rect(MARGIN, pkgBarY, 4, 26).fill(riskColor(f.riskCategory));
        doc.font("Helvetica-Bold").fontSize(10).fillColor(riskColor(f.riskCategory))
          .text(f.packageName, MARGIN + 12, pkgBarY + 8, { lineBreak: false });
        doc.font("Helvetica").fontSize(9).fillColor(COLOR.muted)
          .text(f.version ? `  v${f.version}` : "", { continued: false, lineBreak: false });
        doc.font("Helvetica").fontSize(8).fillColor(COLOR.muted)
          .text(
            `${riskLabel(f.riskCategory)}   Score: ${f.riskScore}/100   Confidence: ${f.confidence}`,
            PAGE_W - MARGIN - 200, pkgBarY + 9,
            { width: 196, align: "right", lineBreak: false }
          );
        doc.y = pkgBarY + 30;

        if (f.vulnerabilities.length > 0) {
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLOR.text)
            .text("Vulnerability yang Diketahui:", MARGIN + 8);
          doc.moveDown(0.1);
          for (const v of f.vulnerabilities) {
            ensureSpace(doc, 30);
            doc.font("Helvetica-Bold").fontSize(8).fillColor(riskColor(f.riskCategory))
              .text(`• ${v.id ?? "—"}`, MARGIN + 14, doc.y, { lineBreak: false, width: 120 });
            doc.font("Helvetica").fontSize(8).fillColor(COLOR.muted)
              .text(`  ${severityLabel(v.severity)}`, { lineBreak: false });
            doc.moveDown(0.15);
            doc.font("Helvetica").fontSize(8).fillColor(COLOR.text)
              .text(truncate(v.summary ?? "", 120), MARGIN + 22, doc.y, { width: CONTENT_W - 22 });
            doc.moveDown(0.3);
          }
        }

        const heuristicReasons = f.reasons.filter((r) => r.startsWith("[Signal heuristik]"));
        const vulnReasons = f.reasons.filter((r) => !r.startsWith("[Signal heuristik]"));

        if (vulnReasons.length > 0) {
          ensureSpace(doc, 20);
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLOR.text).text("Analisis:", MARGIN + 8);
          doc.moveDown(0.1);
          for (const r of vulnReasons) {
            ensureSpace(doc, 20);
            doc.font("Helvetica").fontSize(8).fillColor(COLOR.text)
              .text(`• ${r}`, MARGIN + 14, doc.y, { width: CONTENT_W - 22 });
            doc.moveDown(0.2);
          }
        }

        if (heuristicReasons.length > 0) {
          ensureSpace(doc, 20);
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#92400E").text("Signal Heuristik:", MARGIN + 8);
          doc.moveDown(0.1);
          for (const r of heuristicReasons) {
            ensureSpace(doc, 20);
            doc.font("Helvetica").fontSize(8).fillColor("#92400E")
              .text(`• ${r.replace("[Signal heuristik] ", "")}`, MARGIN + 14, doc.y, { width: CONTENT_W - 22 });
            doc.moveDown(0.2);
          }
          doc.font("Helvetica").fontSize(7.5).fillColor(COLOR.muted)
            .text("Catatan: signal heuristik adalah indikasi awal, bukan bukti malware.", MARGIN + 14, doc.y, { width: CONTENT_W - 22 });
          doc.moveDown(0.2);
        }

        ensureSpace(doc, 40);
        doc.moveDown(0.2);
        const recY = doc.y;
        doc.fontSize(8);
        const recLines = doc.heightOfString(f.recommendation ?? "", { width: CONTENT_W - 30 });
        const recBoxH = recLines + 20;
        doc.rect(MARGIN + 8, recY, CONTENT_W - 8, recBoxH).fill("#EEF2FF");
        doc.rect(MARGIN + 8, recY, 3, recBoxH).fill(COLOR.primary);
        doc.font("Helvetica-Bold").fontSize(8).fillColor(COLOR.primary).text("Rekomendasi:", MARGIN + 16, recY + 6);
        doc.font("Helvetica").fontSize(8).fillColor("#3730A3")
          .text(f.recommendation ?? "—", MARGIN + 16, recY + 17, { width: CONTENT_W - 30 });
        doc.y = recY + recBoxH + 6;
        doc.moveDown(0.4);
        hRule(doc);
      }
    }

    // Disclaimer
    ensureSpace(doc, 80);
    doc.moveDown(1);
    hRule(doc);
    doc.moveDown(0.4);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(COLOR.muted).text("DISCLAIMER", MARGIN);
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(7.5).fillColor(COLOR.muted).text(
      "Laporan ini dibuat oleh JagaRepo berdasarkan data dari OSV (Open Source Vulnerabilities — osv.dev). " +
      "Score risiko adalah indikator awal dan bukan jaminan keamanan mutlak. " +
      "JagaRepo tidak mengklaim dapat mendeteksi semua kerentanan atau malicious package. " +
      "Signal heuristik hanya merupakan indikasi awal yang perlu diverifikasi secara manual. " +
      "Selalu lakukan pemeriksaan manual dan konsultasikan dengan profesional keamanan sebelum mengambil keputusan keamanan.",
      MARGIN, doc.y, { width: CONTENT_W }
    );

    // Page numbers
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc.font("Helvetica").fontSize(7).fillColor(COLOR.faint)
        .text(
          `JagaRepo — Laporan Keamanan Dependency   |   Halaman ${i + 1} dari ${totalPages}`,
          MARGIN, doc.page.height - 30,
          { width: CONTENT_W, align: "center" }
        );
    }

    doc.end();
  });
}
