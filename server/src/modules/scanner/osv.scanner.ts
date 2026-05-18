import type { ParsedDependency, NormalizedVulnerability } from "../../types/index.js";
import { queryOsv, type OsvRawVuln, type OsvDepResult } from "../../lib/osv-client.js";
import { getMockResults } from "../../lib/osv-mock.js";

// ── Public types ──────────────────────────────────────────────────────────────

export type OsvScanEntry = {
  packageName: string;
  version?: string;
  ecosystem: string;
  vulnerabilities: NormalizedVulnerability[];
  /** true when dep had no version and was not queried */
  skipped: boolean;
  /** set when the API call failed for this specific dep */
  error?: string;
};

export type OsvScanSummary = {
  entries: OsvScanEntry[];
  totalVulnerable: number;
  totalSkipped: number;
  totalErrors: number;
  /** true when mock data was used instead of the live API */
  usedMock: boolean;
  scannedAt: string;
};

// ── Normalization helpers ─────────────────────────────────────────────────────

function extractSeverity(vuln: OsvRawVuln): string | undefined {
  // Prefer database_specific.severity (GHSA provides "HIGH" / "MEDIUM" / etc.)
  const dbSev = vuln.database_specific?.severity;
  if (typeof dbSev === "string" && dbSev.length > 0) {
    return dbSev.toUpperCase();
  }
  // Fall back to the first severity entry type (e.g. "CVSS_V3")
  if (vuln.severity && vuln.severity.length > 0) {
    return vuln.severity[0].type;
  }
  return undefined;
}

function extractUrl(vuln: OsvRawVuln): string | undefined {
  if (!vuln.references || vuln.references.length === 0) return undefined;
  // Prefer ADVISORY type, then any WEB reference
  const advisory = vuln.references.find((r) => r.type === "ADVISORY");
  if (advisory) return advisory.url;
  const web = vuln.references.find((r) => r.type === "WEB");
  return web?.url;
}

function normalizeVuln(raw: OsvRawVuln): NormalizedVulnerability {
  return {
    id: raw.id,
    summary: raw.summary ?? "Vulnerability terdeteksi (deskripsi tidak tersedia).",
    severity: extractSeverity(raw),
    publishedAt: raw.published,
    url: extractUrl(raw),
  };
}

function toEntry(result: OsvDepResult): OsvScanEntry {
  return {
    packageName: result.dep.name,
    version: result.dep.version,
    ecosystem: result.dep.ecosystem,
    vulnerabilities: result.vulns.map(normalizeVuln),
    skipped: result.skipped,
    error: result.error,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Scan a list of parsed dependencies against OSV.
 *
 * Mock mode is activated when:
 *   - options.forceMock === true  (explicit, used in tests)
 *   - DEMO_MODE=true in environment
 *
 * If the live API fails for ALL queryable deps, the scanner falls back to mock
 * data automatically and logs a warning — it never throws.
 */
export async function scanDependencies(
  deps: ParsedDependency[],
  options: { timeoutMs?: number; forceMock?: boolean } = {}
): Promise<OsvScanSummary> {
  const useMock =
    options.forceMock === true || process.env.DEMO_MODE === "true";

  let rawResults: OsvDepResult[];

  if (useMock) {
    rawResults = getMockResults(deps);
  } else {
    rawResults = await queryOsv(deps, { timeoutMs: options.timeoutMs });

    // If every queryable dep came back with an error, fall back to mock
    const queryable = rawResults.filter((r) => !r.skipped);
    if (queryable.length > 0 && queryable.every((r) => !!r.error)) {
      console.warn(
        "[JagaRepo] OSV API tidak dapat dijangkau — menggunakan data mock untuk demo."
      );
      rawResults = getMockResults(deps);
    }
  }

  const entries = rawResults.map(toEntry);

  return {
    entries,
    totalVulnerable: entries.filter((e) => e.vulnerabilities.length > 0).length,
    totalSkipped: entries.filter((e) => e.skipped).length,
    totalErrors: entries.filter((e) => !!e.error).length,
    usedMock: useMock,
    scannedAt: new Date().toISOString(),
  };
}
