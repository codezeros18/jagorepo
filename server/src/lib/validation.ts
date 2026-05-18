import type { Ecosystem } from "../types/index.js";

// ─── Constants ───────────────────────────────────────────────────────────────

export const ACCEPTED_FILE_NAMES = [
  "package.json",
  "package-lock.json",
  "requirements.txt",
] as const;

export type AcceptedFileName = (typeof ACCEPTED_FILE_NAMES)[number];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── Result types ─────────────────────────────────────────────────────────────

export type ValidationOk = {
  valid: true;
  fileName: AcceptedFileName;
  ecosystem: Ecosystem;
  fileSize: number;
};

export type ValidationFail = {
  valid: false;
  code:
    | "INVALID_NAME"
    | "FILE_TOO_LARGE"
    | "FILE_EMPTY"
    | "INVALID_JSON"
    | "MISSING_DEPENDENCIES"
    | "INVALID_FORMAT";
  error: string;
};

export type ValidationResult = ValidationOk | ValidationFail;

// ─── Ecosystem mapping ────────────────────────────────────────────────────────

const ECOSYSTEM_MAP: Record<AcceptedFileName, Ecosystem> = {
  "package.json": "npm",
  "package-lock.json": "npm",
  "requirements.txt": "PyPI",
};

// ─── Validators ───────────────────────────────────────────────────────────────

function isAcceptedFileName(name: string): name is AcceptedFileName {
  return (ACCEPTED_FILE_NAMES as readonly string[]).includes(name);
}

function detectCanonicalName(originalName: string, buffer: Buffer): AcceptedFileName | null {
  const lower = originalName.toLowerCase();

  if (lower.endsWith(".txt")) {
    return "requirements.txt";
  }

  if (lower.endsWith(".json")) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(buffer.toString("utf-8"));
    } catch {
      return null;
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    const obj = parsed as Record<string, unknown>;
    if ("lockfileVersion" in obj || "packages" in obj) {
      return "package-lock.json";
    }
    if ("dependencies" in obj || "devDependencies" in obj || "name" in obj) {
      return "package.json";
    }
  }

  return null;
}

function validatePackageJson(buffer: Buffer): ValidationFail | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(buffer.toString("utf-8"));
  } catch {
    return {
      valid: false,
      code: "INVALID_JSON",
      error:
        "File package.json tidak bisa dibaca. Pastikan formatnya adalah JSON yang valid.",
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      valid: false,
      code: "INVALID_FORMAT",
      error: "File package.json harus berupa objek JSON, bukan array atau nilai lain.",
    };
  }

  const obj = parsed as Record<string, unknown>;
  const hasDeps =
    "dependencies" in obj ||
    "devDependencies" in obj ||
    "peerDependencies" in obj ||
    "name" in obj;

  if (!hasDeps) {
    return {
      valid: false,
      code: "MISSING_DEPENDENCIES",
      error:
        "File package.json tidak memiliki field dependencies, devDependencies, atau name. Pastikan ini adalah file package.json yang valid.",
    };
  }

  return null;
}

function validatePackageLockJson(buffer: Buffer): ValidationFail | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(buffer.toString("utf-8"));
  } catch {
    return {
      valid: false,
      code: "INVALID_JSON",
      error:
        "File package-lock.json tidak bisa dibaca. Pastikan formatnya adalah JSON yang valid.",
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      valid: false,
      code: "INVALID_FORMAT",
      error: "File package-lock.json harus berupa objek JSON.",
    };
  }

  const obj = parsed as Record<string, unknown>;
  if (!("lockfileVersion" in obj) && !("dependencies" in obj) && !("packages" in obj)) {
    return {
      valid: false,
      code: "MISSING_DEPENDENCIES",
      error:
        "File package-lock.json tidak terlihat valid. Pastikan file ini dihasilkan oleh npm install.",
    };
  }

  return null;
}

function validateRequirementsTxt(buffer: Buffer): ValidationFail | null {
  const text = buffer.toString("utf-8");
  const lines = text.split(/\r?\n/);

  // Count meaningful lines (non-empty, non-comment)
  const meaningfulLines = lines.filter((line) => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith("#");
  });

  if (meaningfulLines.length === 0) {
    return {
      valid: false,
      code: "MISSING_DEPENDENCIES",
      error:
        "File requirements.txt tidak memiliki dependency. Pastikan file berisi daftar package Python.",
    };
  }

  // Basic format check: at least one line should look like a package spec
  const looksLikePackage = meaningfulLines.some((line) =>
    /^[a-zA-Z0-9_\-\.]+/.test(line.trim())
  );

  if (!looksLikePackage) {
    return {
      valid: false,
      code: "INVALID_FORMAT",
      error:
        "Format requirements.txt tidak dikenali. Pastikan setiap baris berisi nama package seperti: requests==2.28.0",
    };
  }

  return null;
}

// ─── Main validate function ───────────────────────────────────────────────────

export function validateUploadedFile(
  originalName: string,
  buffer: Buffer,
  fileSize: number
): ValidationResult {
  // 2. Check size (before content parsing)
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    const mb = (fileSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      code: "FILE_TOO_LARGE",
      error: `Ukuran file (${mb} MB) melebihi batas maksimum 5 MB.`,
    };
  }

  // 3. Check empty
  if (fileSize === 0 || buffer.length === 0) {
    return {
      valid: false,
      code: "FILE_EMPTY",
      error: "File kosong. Pastikan file berisi dependency yang valid.",
    };
  }

  // 1. Resolve canonical file name — exact match first, then content detection
  const canonicalName: AcceptedFileName | null = isAcceptedFileName(originalName)
    ? originalName
    : detectCanonicalName(originalName, buffer);

  if (!canonicalName) {
    return {
      valid: false,
      code: "INVALID_NAME",
      error: `File "${originalName}" tidak didukung. Gunakan package.json, package-lock.json, atau requirements.txt.`,
    };
  }

  // 4. Content validation per file type
  let contentError: ValidationFail | null = null;

  if (canonicalName === "package.json") {
    contentError = validatePackageJson(buffer);
  } else if (canonicalName === "package-lock.json") {
    contentError = validatePackageLockJson(buffer);
  } else if (canonicalName === "requirements.txt") {
    contentError = validateRequirementsTxt(buffer);
  }

  if (contentError) return contentError;

  // All checks passed
  return {
    valid: true,
    fileName: canonicalName,
    ecosystem: ECOSYSTEM_MAP[canonicalName],
    fileSize,
  };
}
