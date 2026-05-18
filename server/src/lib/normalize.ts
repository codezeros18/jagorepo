// ─── npm / semver normalization ───────────────────────────────────────────────

/**
 * Strip semver range operators dan kembalikan versi pertama yang bermakna.
 * Contoh:
 *   "^4.17.15"   → "4.17.15"
 *   "~1.2.3"     → "1.2.3"
 *   ">=1.0.0"    → "1.0.0"
 *   "1.0.0"      → "1.0.0"
 *   "*"          → undefined
 *   "latest"     → undefined
 *   "workspace:*"→ undefined
 */
export function normalizeNpmVersion(raw: string | undefined): string | undefined {
  if (!raw || typeof raw !== "string") return undefined;

  const trimmed = raw.trim();

  // Non-version markers
  if (
    trimmed === "*" ||
    trimmed === "latest" ||
    trimmed === "" ||
    trimmed.startsWith("workspace:") ||
    trimmed.startsWith("link:") ||
    trimmed.startsWith("file:") ||
    trimmed.startsWith("git+") ||
    trimmed.startsWith("github:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return undefined;
  }

  // Strip leading range operators: ^, ~, >=, <=, >, <, =, v
  // Handle compound ranges like ">=1.0.0 <2.0.0" → take the first part
  const firstPart = trimmed.split(/\s+/)[0];
  const stripped = firstPart.replace(/^[~^>=<!v]+/, "");

  // Validate that what remains looks like a version (starts with a digit)
  if (!stripped || !/^\d/.test(stripped)) return undefined;

  // Remove build metadata (+foo) and pre-release suffixes if needed for OSV query
  // Keep the full version for now — OSV handles semver properly
  return stripped;
}

// ─── PyPI name normalization ──────────────────────────────────────────────────

/**
 * Normalisasi nama package PyPI ke bentuk canonical:
 * - lowercase
 * - ganti _ dan . dengan - (PEP 503)
 * Contoh: "Requests" → "requests", "Pillow" → "pillow"
 */
export function normalizePypiName(raw: string): string {
  return raw.trim().toLowerCase().replace(/[_.]+/g, "-");
}

/**
 * Parse versi dari specifier PyPI.
 * Mendukung: ==, >=, ~=, <=, !=, >  <
 * Contoh:
 *   "requests==2.28.0"  → { name: "requests", version: "2.28.0" }
 *   "flask>=2.0.0"      → { name: "flask", version: "2.0.0" }
 *   "numpy"             → { name: "numpy", version: undefined }
 */
export function parsePypiSpecifier(
  raw: string
): { name: string; version: string | undefined } | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  // Match: name[extras] operator version
  // e.g. "requests[security]>=2.28.0,<3.0"
  const match = trimmed.match(
    /^([A-Za-z0-9]([A-Za-z0-9._-]*[A-Za-z0-9])?)(\[.*?\])?\s*(==|>=|~=|<=|!=|>|<)\s*([^\s,;]+)/
  );

  if (match) {
    const name = normalizePypiName(match[1]);
    const version = match[5].trim();
    return { name, version: version || undefined };
  }

  // Package name only (no version constraint)
  const nameOnly = trimmed.match(/^([A-Za-z0-9]([A-Za-z0-9._-]*[A-Za-z0-9])?)(\[.*?\])?/);
  if (nameOnly) {
    return { name: normalizePypiName(nameOnly[1]), version: undefined };
  }

  return null;
}
