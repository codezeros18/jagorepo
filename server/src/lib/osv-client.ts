import type { ParsedDependency } from "../types/index.js";

const DEFAULT_TIMEOUT_MS = 10_000;
const BATCH_SIZE = 500;

function osvBaseUrl(): string {
  return process.env.OSV_API_BASE_URL ?? "https://api.osv.dev";
}

// ── Raw OSV API types ─────────────────────────────────────────────────────────

export type OsvSeverityEntry = {
  type: string;
  score: string;
};

export type OsvRawVuln = {
  id: string;
  summary?: string;
  severity?: OsvSeverityEntry[];
  published?: string;
  references?: Array<{ type: string; url: string }>;
  database_specific?: Record<string, unknown>;
  aliases?: string[];
};

type OsvQueryResult = {
  vulns?: OsvRawVuln[];
};

type OsvBatchResponse = {
  results: OsvQueryResult[];
};

type OsvPackageQuery = {
  version?: string;
  package: {
    name: string;
    ecosystem: string;
  };
};

// ── Public result type ────────────────────────────────────────────────────────

export type OsvDepResult = {
  dep: ParsedDependency;
  vulns: OsvRawVuln[];
  /** true when dep had no version — OSV query was not attempted */
  skipped: boolean;
  /** set when the API call itself failed for this dep */
  error?: string;
};

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchBatch(
  queries: OsvPackageQuery[],
  timeoutMs: number,
): Promise<OsvQueryResult[]> {
  const signal = AbortSignal.timeout(timeoutMs);

  const response = await fetch(`${osvBaseUrl()}/v1/querybatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queries }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`OSV API error: HTTP ${response.status}`);
  }

  const data = (await response.json()) as OsvBatchResponse;
  return data.results ?? [];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Query the OSV batch API for a list of parsed dependencies.
 *
 * - Deps without a version are skipped (result.skipped = true).
 * - Network / timeout errors per batch are captured in result.error;
 *   they do NOT throw so callers can gracefully degrade.
 * - Results are returned in the same order as the input array.
 */
export async function queryOsv(
  deps: ParsedDependency[],
  options: { timeoutMs?: number } = {},
): Promise<OsvDepResult[]> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const results: OsvDepResult[] = new Array(deps.length);

  // Split into queryable (have version) vs. skipped (no version)
  const queryableIndices: number[] = [];
  const queries: OsvPackageQuery[] = [];

  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];
    if (!dep.version) {
      results[i] = { dep, vulns: [], skipped: true };
      continue;
    }
    queryableIndices.push(i);
    queries.push({
      version: dep.version,
      package: { name: dep.name, ecosystem: dep.ecosystem },
    });
  }

  if (queries.length === 0) return results;

  // Process in chunks to respect batch size limit
  for (let offset = 0; offset < queries.length; offset += BATCH_SIZE) {
    const batchQueries = queries.slice(offset, offset + BATCH_SIZE);
    const batchIndices = queryableIndices.slice(offset, offset + BATCH_SIZE);

    let batchResults: OsvQueryResult[];
    try {
      batchResults = await fetchBatch(batchQueries, timeoutMs);
    } catch (err) {
      const message = err instanceof Error ? err.message : "OSV query gagal";
      for (const idx of batchIndices) {
        results[idx] = {
          dep: deps[idx],
          vulns: [],
          skipped: false,
          error: message,
        };
      }
      continue;
    }

    for (let j = 0; j < batchIndices.length; j++) {
      const idx = batchIndices[j];
      results[idx] = {
        dep: deps[idx],
        vulns: batchResults[j]?.vulns ?? [],
        skipped: false,
      };
    }
  }

  return results;
}
