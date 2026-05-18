"use client";

import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { FindingDetailPanel } from "./FindingDetailPanel";
import {
  getRiskBarColor,
  getRiskScoreColor,
  getRiskLabel,
  getRiskBorderBg,
} from "@/lib/format-risk";
import { generateReport, ApiError } from "@/lib/api-client";
import type { UploadScanResponse, RiskFinding, RiskCategory } from "@/types/scan";

// ── Severity breakdown helper ─────────────────────────────────────────────────

function countByCategory(findings: RiskFinding[]) {
  const counts: Record<RiskCategory, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  for (const f of findings) {
    if (f.vulnerabilities.length > 0) counts[f.riskCategory]++;
  }
  return counts;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreCard({ scan }: { scan: UploadScanResponse["scan"] }) {
  const cat = scan.overallRiskCategory;
  return (
    <div
      className={`col-span-2 sm:col-span-1 rounded-2xl border p-5 ${getRiskBorderBg(cat)}`}
    >
      <p className="text-xs font-medium text-zinc-500">Risk Score</p>
      <p className={`mt-1 text-4xl font-extrabold ${getRiskScoreColor(cat)}`}>
        {scan.overallRiskScore}
        <span className="text-base font-normal text-zinc-500">/100</span>
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-700/60">
        <div
          className={`h-full rounded-full transition-all ${getRiskBarColor(cat)}`}
          style={{ width: `${scan.overallRiskScore}%` }}
        />
      </div>
      <p className={`mt-2 text-xs font-semibold ${getRiskScoreColor(cat)}`}>
        {getRiskLabel(cat)}
      </p>
    </div>
  );
}

function SeverityBreakdown({ findings }: { findings: RiskFinding[] }) {
  const counts = countByCategory(findings);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const bars: Array<{ cat: RiskCategory; color: string }> = [
    { cat: "Critical", color: "bg-red-500" },
    { cat: "High", color: "bg-orange-500" },
    { cat: "Medium", color: "bg-amber-500" },
    { cat: "Low", color: "bg-emerald-500" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="mb-3 text-sm font-semibold text-white">
        Distribusi Risiko
      </h3>
      {/* Stacked bar */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-700">
        {bars.map(({ cat, color }) =>
          counts[cat] > 0 ? (
            <div
              key={cat}
              className={`${color} transition-all`}
              style={{ width: `${(counts[cat] / total) * 100}%` }}
              title={`${cat}: ${counts[cat]}`}
            />
          ) : null
        )}
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4">
        {bars.map(({ cat, color }) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
            <span className="text-xs text-zinc-400">
              {cat}{" "}
              <span className="font-semibold text-white">{counts[cat]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FindingsTable({
  findings,
  selectedIdx,
  onSelect,
}: {
  findings: RiskFinding[];
  selectedIdx: number | null;
  onSelect: (idx: number) => void;
}) {
  const vulnerable = findings.filter((f) => f.vulnerabilities.length > 0);
  const safe = findings.filter((f) => f.vulnerabilities.length === 0);
  const sorted = [...vulnerable, ...safe];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-6 py-4">
        <h3 className="text-sm font-semibold text-white">
          Dependency Findings
        </h3>
        <p className="mt-0.5 text-xs text-zinc-400">
          {vulnerable.length} dari {findings.length} dependency perlu diperhatikan ·
          Klik baris untuk melihat detail
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50 text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Package
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Versi
              </th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:table-cell">
                Ekosistem
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Risiko
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Vuln
              </th>
              <th className="hidden px-6 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 md:table-cell">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sorted.map((f, i) => {
              const isSelected = selectedIdx === i;
              return (
                <tr
                  key={`${f.packageName}-${i}`}
                  onClick={() => onSelect(isSelected ? -1 : i)}
                  className={[
                    "cursor-pointer transition-colors",
                    isSelected
                      ? "bg-emerald-500/10"
                      : "hover:bg-zinc-800/50",
                  ].join(" ")}
                >
                  <td className="px-6 py-4">
                    <code className="font-semibold text-white">
                      {f.packageName}
                    </code>
                  </td>
                  <td className="px-4 py-4">
                    <code className="text-xs text-zinc-400">
                      {f.version ?? "—"}
                    </code>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <Badge variant="info">{f.ecosystem}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    {f.vulnerabilities.length > 0 ? (
                      <Badge variant={f.riskCategory}>{f.riskCategory}</Badge>
                    ) : (
                      <span className="text-xs text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {f.vulnerabilities.length > 0 ? (
                      <span className="font-medium text-zinc-300">
                        {f.vulnerabilities.length}
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium">
                        Aman
                      </span>
                    )}
                  </td>
                  <td className="hidden px-6 py-4 md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-zinc-700">
                        <div
                          className={`h-full rounded-full ${getRiskBarColor(f.riskCategory)}`}
                          style={{ width: `${f.riskScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-zinc-400">
                        {f.riskScore}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  data: UploadScanResponse;
  onScanAnother: () => void;
};

export function ScanResultDashboard({ data, onScanAnother }: Props) {
  const { scan, fileName, hasLockfile } = data;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [reportStatus, setReportStatus] = useState<"idle" | "loading" | "error">("idle");
  const [reportError, setReportError] = useState<string>("");

  const handleDownloadReport = useCallback(async () => {
    setReportStatus("loading");
    setReportError("");
    try {
      const blob = await generateReport(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = fileName.replace(/[^a-z0-9_.-]/gi, "_").replace(/\.json$/i, "");
      a.href = url;
      a.download = `jagarepo-report-${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setReportStatus("idle");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Gagal membuat PDF. Pastikan server berjalan.";
      setReportError(msg);
      setReportStatus("error");
    }
  }, [data, fileName]);

  if (!scan?.findings) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
        <p className="text-sm font-medium text-white">Hasil scan tidak bisa ditampilkan.</p>
        <p className="mt-1 text-sm text-zinc-400">Data dari server tidak lengkap atau koneksi terputus.</p>
        <button
          type="button"
          onClick={onScanAnother}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const sortedFindings = [
    ...scan.findings.filter((f) => f.vulnerabilities.length > 0),
    ...scan.findings.filter((f) => f.vulnerabilities.length === 0),
  ];
  const selectedFinding: RiskFinding | null =
    selectedIdx !== null ? sortedFindings[selectedIdx] ?? null : null;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx < 0 || idx === selectedIdx ? null : idx);
  };

  const scannedDate = new Date(scan.scannedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Hasil Scan</h2>
            <Badge variant={scan.overallRiskCategory}>
              {getRiskLabel(scan.overallRiskCategory)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            <code className="font-mono text-xs">{fileName}</code>
            {" · "}
            {scannedDate}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onScanAnother}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Scan file lain
          </button>
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={reportStatus === "loading"}
            className={[
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors",
              reportStatus === "loading"
                ? "bg-emerald-400/50 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500",
            ].join(" ")}
          >
            {reportStatus === "loading" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Membuat PDF…
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m0 0l-4.5-4.5M12 16.5l4.5-4.5"
                  />
                </svg>
                Unduh PDF Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Report error ───────────────────────────────────────────────────── */}
      {reportStatus === "error" && reportError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-900/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{reportError}</span>
          <button
            type="button"
            onClick={() => setReportStatus("idle")}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ScoreCard scan={scan} />

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-medium text-zinc-500">Total Dependency</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {scan.totalDependencies}
          </p>
          <p className="mt-1 text-xs text-zinc-500">packages diperiksa</p>
        </div>

        <div
          className={
            scan.vulnerableDependencies > 0
              ? "rounded-2xl border border-red-900/30 bg-red-500/10 p-5"
              : "rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          }
        >
          <p
            className={`text-xs font-medium ${
              scan.vulnerableDependencies > 0
                ? "text-red-400"
                : "text-zinc-500"
            }`}
          >
            Vulnerable
          </p>
          <p
            className={`mt-1 text-3xl font-bold ${
              scan.vulnerableDependencies > 0
                ? "text-red-400"
                : "text-white"
            }`}
          >
            {scan.vulnerableDependencies}
          </p>
          <p
            className={`mt-1 text-xs ${
              scan.vulnerableDependencies > 0
                ? "text-red-500"
                : "text-zinc-500"
            }`}
          >
            packages berisiko
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-800/40 bg-emerald-500/5 p-5">
          <p className="text-xs font-medium text-emerald-400">Aman</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">
            {scan.totalDependencies - scan.vulnerableDependencies}
          </p>
          <p className="mt-1 text-xs text-emerald-500">packages aman</p>
        </div>
      </div>

      {/* ── Severity breakdown ──────────────────────────────────────────────── */}
      {scan.vulnerableDependencies > 0 && (
        <SeverityBreakdown findings={scan.findings} />
      )}

      {/* ── Lockfile warning ───────────────────────────────────────────────── */}
      {!hasLockfile && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-800/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div>
            <p className="font-medium">Lockfile tidak ditemukan</p>
            <p className="mt-0.5 text-amber-400/80">
              Tanpa{" "}
              <code className="text-xs">package-lock.json</code> atau file
              lock, versi dependency tidak terkunci. Tambahkan lockfile untuk
              memastikan versi yang sama dipakai di semua environment.
            </p>
          </div>
        </div>
      )}

      {/* ── Findings table + detail panel ──────────────────────────────────── */}
      <FindingsTable
        findings={sortedFindings}
        selectedIdx={selectedIdx}
        onSelect={handleSelect}
      />

      {selectedFinding && (
        <FindingDetailPanel
          finding={selectedFinding}
          onClose={() => setSelectedIdx(null)}
        />
      )}

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      <p className="text-center text-xs text-zinc-500 pb-4">
        Score adalah indikator awal berdasarkan data{" "}
        <a
          href="https://osv.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-300"
        >
          OSV
        </a>
        . Bukan jaminan keamanan mutlak. Selalu verifikasi manual sebelum
        mengambil keputusan keamanan.
      </p>
    </div>
  );
}

// Keep old export name for backwards compatibility during transition
export { ScanResultDashboard as ScanResultPlaceholder };
