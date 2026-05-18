import type { ParsedDependency } from "../../types/index.js";

// ─── Lockfile shape types ─────────────────────────────────────────────────────

type LockV1Dep = { version?: string; [key: string]: unknown };

type LockfileShape = {
  lockfileVersion?: number;
  // v1 / v2 format
  dependencies?: Record<string, LockV1Dep>;
  // v2 / v3 format (node_modules/{name})
  packages?: Record<string, { version?: string; [key: string]: unknown }>;
  [key: string]: unknown;
};

export type PackageLockParseResult = {
  dependencies: ParsedDependency[];
  lockfileVersion: number | undefined;
  warnings: string[];
};

/** Strip "node_modules/" prefix dan nested paths untuk mendapat package name. */
function extractNameFromPackagesKey(key: string): string | null {
  // Key format: "node_modules/express" atau "node_modules/@scope/name"
  // Nested: "node_modules/foo/node_modules/bar" → ambil package terakhir
  if (!key.startsWith("node_modules/")) return null;

  const withoutPrefix = key.slice("node_modules/".length);
  // Untuk nested dep, ambil bagian setelah node_modules/ terakhir
  const lastSegment = withoutPrefix.split("/node_modules/").pop() ?? withoutPrefix;
  return lastSegment || null;
}

/**
 * Parse package-lock.json buffer → ParsedDependency[]
 * Mendukung lockfileVersion 1, 2, dan 3.
 */
export function parsePackageLock(
  buffer: Buffer,
  sourceFile = "package-lock.json"
): PackageLockParseResult {
  const warnings: string[] = [];

  let parsed: LockfileShape;
  try {
    parsed = JSON.parse(buffer.toString("utf-8")) as LockfileShape;
  } catch {
    return {
      dependencies: [],
      lockfileVersion: undefined,
      warnings: ["package-lock.json tidak bisa di-parse."],
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      dependencies: [],
      lockfileVersion: undefined,
      warnings: ["package-lock.json bukan objek JSON yang valid."],
    };
  }

  const lockfileVersion =
    typeof parsed.lockfileVersion === "number" ? parsed.lockfileVersion : undefined;

  const deps: ParsedDependency[] = [];
  const seen = new Set<string>();

  // ── Strategy 1: packages (v2/v3) ─────────────────────────────────────────
  if (parsed.packages && typeof parsed.packages === "object") {
    for (const [key, entry] of Object.entries(parsed.packages)) {
      // Skip root package entry (key === "")
      if (key === "") continue;

      const name = extractNameFromPackagesKey(key);
      if (!name) continue;

      const version =
        entry && typeof entry.version === "string" && entry.version
          ? entry.version
          : undefined;

      const depKey = `${name}@${version ?? "?"}`;
      if (seen.has(depKey)) continue;
      seen.add(depKey);

      deps.push({
        name,
        version,
        ecosystem: "npm",
        sourceFile,
        dependencyType: "lock",
      });
    }
  }

  // ── Strategy 2: dependencies (v1) — fallback jika packages tidak ada ──────
  if (deps.length === 0 && parsed.dependencies && typeof parsed.dependencies === "object") {
    const walkDeps = (
      depsObj: Record<string, LockV1Dep>,
      depth = 0
    ) => {
      if (depth > 5) return; // guard rekursi berlebihan

      for (const [name, entry] of Object.entries(depsObj)) {
        if (!name || typeof entry !== "object" || entry === null) continue;

        const version =
          typeof entry.version === "string" && entry.version
            ? entry.version
            : undefined;

        const depKey = `${name}@${version ?? "?"}`;
        if (!seen.has(depKey)) {
          seen.add(depKey);
          deps.push({
            name,
            version,
            ecosystem: "npm",
            sourceFile,
            dependencyType: "lock",
          });
        }

        // Rekursi untuk nested dependencies (v1 hoist style)
        if (
          entry.dependencies &&
          typeof entry.dependencies === "object" &&
          !Array.isArray(entry.dependencies)
        ) {
          walkDeps(entry.dependencies as Record<string, LockV1Dep>, depth + 1);
        }
      }
    };

    walkDeps(parsed.dependencies);
  }

  if (deps.length === 0) {
    warnings.push(
      "Tidak ada dependency ditemukan di package-lock.json. File mungkin kosong atau format tidak dikenali."
    );
  }

  return { dependencies: deps, lockfileVersion, warnings };
}
