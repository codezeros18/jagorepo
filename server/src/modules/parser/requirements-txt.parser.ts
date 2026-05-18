import type { ParsedDependency } from "../../types/index.js";
import { parsePypiSpecifier } from "../../lib/normalize.js";

export type RequirementsTxtParseResult = {
  dependencies: ParsedDependency[];
  warnings: string[];
  skippedLines: string[];
};

// Lines yang dimulai dengan ini bukan package spec
const SKIP_PREFIXES = [
  "#",  // komentar
  "-r", // -r other-requirements.txt (include)
  "-c", // -c constraints.txt
  "-f", // -f url (find-links)
  "-i", // -i url (index-url)
  "--",  // --index-url, --extra-index-url, dll.
  "-e", // -e . (editable install)
  "http://",
  "https://",
  "git+",
  "svn+",
  "hg+",
  "bzr+",
];

function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true; // blank line
  return SKIP_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

/**
 * Hapus inline comment dari baris requirements.txt
 * Contoh: "requests==2.28.0  # security fix" → "requests==2.28.0"
 */
function stripInlineComment(line: string): string {
  // Hanya strip # yang dipisahkan oleh spasi (inline comment)
  const commentIdx = line.indexOf(" #");
  if (commentIdx !== -1) return line.slice(0, commentIdx).trim();
  // Atau di akhir langsung
  const tabCommentIdx = line.indexOf("\t#");
  if (tabCommentIdx !== -1) return line.slice(0, tabCommentIdx).trim();
  return line.trim();
}

/**
 * Hapus environment markers: ";python_requires>='3.8'"
 */
function stripEnvMarker(line: string): string {
  const markerIdx = line.indexOf(";");
  if (markerIdx !== -1) return line.slice(0, markerIdx).trim();
  return line;
}

/**
 * Parse requirements.txt buffer → ParsedDependency[]
 *
 * Format yang didukung:
 *   requests==2.28.0
 *   flask>=2.0.0,<3.0.0
 *   numpy~=1.21.0
 *   pandas!=1.5.0
 *   scipy
 *   Pillow[jpeg]>=9.0
 *   requests[security,socks]>=2.27.1
 */
export function parseRequirementsTxt(
  buffer: Buffer,
  sourceFile = "requirements.txt"
): RequirementsTxtParseResult {
  const warnings: string[] = [];
  const skippedLines: string[] = [];
  const deps: ParsedDependency[] = [];
  const seen = new Set<string>();

  const text = buffer.toString("utf-8");
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip blank and special lines
    if (shouldSkipLine(trimmed)) {
      if (trimmed && !trimmed.startsWith("#")) {
        skippedLines.push(trimmed);
      }
      continue;
    }

    // Handle line continuation (\)
    let line = trimmed;
    while (line.endsWith("\\") && i + 1 < lines.length) {
      i += 1;
      line = line.slice(0, -1).trim() + " " + lines[i].trim();
    }

    // Strip inline comment and env marker
    const cleaned = stripEnvMarker(stripInlineComment(line));
    if (!cleaned) continue;

    // Parse specifier
    const parsed = parsePypiSpecifier(cleaned);
    if (!parsed) {
      warnings.push(
        `Baris ${i + 1} tidak dikenali dan dilewati: "${trimmed.slice(0, 60)}"`
      );
      skippedLines.push(trimmed);
      continue;
    }

    // Deduplicate by name (ambil entri pertama)
    if (seen.has(parsed.name)) continue;
    seen.add(parsed.name);

    deps.push({
      name: parsed.name,
      version: parsed.version,
      ecosystem: "PyPI",
      sourceFile,
      dependencyType: "prod",
    });
  }

  return { dependencies: deps, warnings, skippedLines };
}
