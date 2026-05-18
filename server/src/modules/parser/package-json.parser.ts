import type { ParsedDependency, DependencyType } from "../../types/index.js";
import { normalizeNpmVersion } from "../../lib/normalize.js";

type PackageJsonShape = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [key: string]: unknown;
};

export type PackageJsonParseResult = {
  dependencies: ParsedDependency[];
  warnings: string[];
};

/**
 * Ekstrak semua dependency dari satu bucket (dependencies / devDependencies / dll.)
 * dan normalisasi ke ParsedDependency[].
 */
function extractBucket(
  bucket: Record<string, unknown> | undefined,
  depType: DependencyType,
  sourceFile: string
): { deps: ParsedDependency[]; warnings: string[] } {
  if (!bucket || typeof bucket !== "object") {
    return { deps: [], warnings: [] };
  }

  const deps: ParsedDependency[] = [];
  const warnings: string[] = [];

  for (const [name, rawVersion] of Object.entries(bucket)) {
    // Skip invalid entries
    if (!name || typeof name !== "string" || name.trim() === "") {
      warnings.push(`Nama package tidak valid, dilewati: "${name}"`);
      continue;
    }

    const versionStr = typeof rawVersion === "string" ? rawVersion : undefined;
    const version = normalizeNpmVersion(versionStr);

    // Warn for non-standard references (workspace, git, URL) tapi tetap include
    if (versionStr && !version) {
      warnings.push(
        `Package "${name}" menggunakan versi non-standar "${versionStr}" — tidak dapat di-scan vulnerability secara akurat.`
      );
    }

    deps.push({
      name: name.trim(),
      version,
      ecosystem: "npm",
      sourceFile,
      dependencyType: depType,
    });
  }

  return { deps, warnings };
}

/**
 * Parse package.json buffer → ParsedDependency[]
 * Mengekstrak dependencies, devDependencies, dan peerDependencies.
 * Tidak crash jika salah satu bucket tidak ada.
 */
export function parsePackageJson(
  buffer: Buffer,
  sourceFile = "package.json"
): PackageJsonParseResult {
  const warnings: string[] = [];

  // Parse JSON — validator sudah memastikan ini valid, tapi kita tetap guard
  let parsed: PackageJsonShape;
  try {
    parsed = JSON.parse(buffer.toString("utf-8")) as PackageJsonShape;
  } catch {
    return {
      dependencies: [],
      warnings: ["package.json tidak bisa di-parse. File mungkin corrupt."],
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      dependencies: [],
      warnings: ["package.json bukan objek JSON yang valid."],
    };
  }

  const allDeps: ParsedDependency[] = [];

  // Parse setiap bucket
  const buckets: Array<{ key: keyof PackageJsonShape; type: DependencyType }> = [
    { key: "dependencies", type: "prod" },
    { key: "devDependencies", type: "dev" },
    { key: "peerDependencies", type: "dev" },
  ];

  for (const { key, type } of buckets) {
    const bucket = parsed[key] as Record<string, unknown> | undefined;
    if (!bucket) continue;

    const { deps, warnings: w } = extractBucket(bucket, type, sourceFile);
    allDeps.push(...deps);
    warnings.push(...w);
  }

  return { dependencies: allDeps, warnings };
}
