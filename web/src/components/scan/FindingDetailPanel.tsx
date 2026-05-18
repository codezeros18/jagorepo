import { Badge } from "@/components/ui/Badge";
import {
  getRiskBarColor,
  getRiskScoreColor,
  getRiskLabel,
  getRiskBorderBg,
} from "@/lib/format-risk";
import type { RiskFinding, NormalizedVulnerability } from "@/types/scan";

// ── Severity badge color ──────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) {
    return <Badge variant="default">Tidak diketahui</Badge>;
  }
  const upper = severity.toUpperCase();
  if (upper === "CRITICAL") return <Badge variant="Critical">Critical</Badge>;
  if (upper === "HIGH") return <Badge variant="High">High</Badge>;
  if (upper === "MEDIUM") return <Badge variant="Medium">Medium</Badge>;
  if (upper === "LOW") return <Badge variant="Low">Low</Badge>;
  return <Badge variant="default">{severity}</Badge>;
}

// ── Vulnerability row ─────────────────────────────────────────────────────────

function VulnRow({ vuln }: { vuln: NormalizedVulnerability }) {
  const publishDate = vuln.publishedAt
    ? new Date(vuln.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-800/50 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-xs font-semibold text-zinc-300">{vuln.id}</code>
          <SeverityBadge severity={vuln.severity} />
        </div>
        <p className="mt-1 text-sm text-zinc-400">{vuln.summary}</p>
        {publishDate && (
          <p className="mt-1 text-xs text-zinc-500">Dipublikasikan: {publishDate}</p>
        )}
      </div>
      {vuln.url && (
        <a
          href={vuln.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-700 transition-colors sm:mt-0"
        >
          Advisory
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  finding: RiskFinding;
  onClose: () => void;
};

export function FindingDetailPanel({ finding, onClose }: Props) {
  const cat = finding.riskCategory;

  // Split reasons: heuristic signals vs known-vuln reasons
  const heuristicReasons = finding.reasons.filter((r) =>
    r.startsWith("[Signal heuristik]")
  );
  const vulnReasons = finding.reasons.filter(
    (r) => !r.startsWith("[Signal heuristik]")
  );

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-5 ${getRiskBorderBg(cat)}`}
    >
      {/* ── Panel header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-lg font-bold text-white">
              {finding.packageName}
            </code>
            {finding.version && (
              <code className="text-sm text-zinc-400">v{finding.version}</code>
            )}
            <Badge variant="info">{finding.ecosystem}</Badge>
            <Badge variant={cat}>{getRiskLabel(cat)}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-zinc-700">
                <div
                  className={`h-full rounded-full ${getRiskBarColor(cat)}`}
                  style={{ width: `${finding.riskScore}%` }}
                />
              </div>
              <span
                className={`text-sm font-bold ${getRiskScoreColor(cat)}`}
              >
                {finding.riskScore}/100
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <span>Confidence:</span>
              <span
                className={
                  finding.confidence === "High"
                    ? "font-medium text-emerald-400"
                    : finding.confidence === "Medium"
                    ? "font-medium text-amber-400"
                    : "font-medium text-zinc-500"
                }
              >
                {finding.confidence}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
          aria-label="Tutup panel"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* ── Known vulnerabilities ─────────────────────────────────────────── */}
      {finding.vulnerabilities.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold text-zinc-200">
            Vulnerability yang Diketahui ({finding.vulnerabilities.length})
          </h4>
          <div className="space-y-2">
            {finding.vulnerabilities.map((v) => (
              <VulnRow key={v.id} vuln={v} />
            ))}
          </div>
        </div>
      )}

      {/* ── Heuristic signals (separated from known vulns) ────────────────── */}
      {heuristicReasons.length > 0 && (
        <div className="rounded-xl border border-amber-800/40 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-4 w-4 text-amber-400"
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
            <p className="text-sm font-semibold text-amber-400">
              Signal Heuristik
            </p>
          </div>
          <p className="text-xs text-amber-400/80 mb-2">
            Signal berikut bukan bukti malware — perlu verifikasi manual.
          </p>
          <ul className="space-y-1">
            {heuristicReasons.map((r, i) => (
              <li key={i} className="text-sm text-amber-400">
                · {r.replace("[Signal heuristik] ", "")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Analysis reasons ──────────────────────────────────────────────── */}
      {vulnReasons.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-200">
            Analisis
          </h4>
          <ul className="space-y-1.5">
            {vulnReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Recommendation ────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800/80 p-4">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
          <h4 className="text-sm font-semibold text-white">
            Rekomendasi
          </h4>
        </div>
        <p className="text-sm text-zinc-300">{finding.recommendation}</p>
      </div>
    </div>
  );
}
