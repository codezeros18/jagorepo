// Basic heuristic signals for potentially suspicious package names.
//
// These signals are NOT proof of malice. Always present with low confidence
// and clear language: "perlu dicek manual", bukan "pasti berbahaya".

export type SuspiciousSignal = {
  code: string;
  /** Pesan Bahasa Indonesia untuk ditampilkan ke user */
  message: string;
};

// ── Curated typosquat list ────────────────────────────────────────────────────
// Documented cases only — keeps false-positive rate low.

const NPM_TYPOSQUATS: Record<string, string> = {
  coloars: "colors",
  colr: "color",
  expres: "express",
  expresss: "express",
  lodsh: "lodash",
  lodassh: "lodash",
  axois: "axios",
  axxios: "axios",
  momnet: "moment",
  mooment: "moment",
  reqest: "request",
  nodeffetch: "node-fetch",
  crossenv: "cross-env",
  "cross-evn": "cross-env",
  babelcli: "babel-cli",
  eslintconfig: "eslint-config",
  recat: "react",
  raect: "react",
  "recat-dom": "react-dom",
};

const PYPI_TYPOSQUATS: Record<string, string> = {
  djago: "django",
  dajngo: "django",
  requets: "requests",
  reqeusts: "requests",
  flassk: "flask",
  flask2: "flask",
  numppy: "numpy",
  nunpy: "numpy",
  pandaas: "pandas",
  pandass: "pandas",
  scikit_leran: "scikit-learn",
  cryptograpy: "cryptography",
};

// ── Pattern checks ────────────────────────────────────────────────────────────

function isAllDigits(name: string): boolean {
  // strip scope prefix and separators before checking
  return /^\d+$/.test(name.replace(/^@[^/]+\//, "").replace(/[-_.]/g, ""));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Return any suspicious signals found for a package name.
 * An empty array means no signal — NOT a guarantee of safety.
 */
export function checkSuspicious(
  packageName: string,
  ecosystem: string
): SuspiciousSignal[] {
  const signals: SuspiciousSignal[] = [];
  const lower = packageName.toLowerCase();

  // 1. Known typosquatting match
  const typosquatMap =
    ecosystem === "PyPI" ? PYPI_TYPOSQUATS : NPM_TYPOSQUATS;
  const lookalike = typosquatMap[lower];
  if (lookalike) {
    signals.push({
      code: "TYPOSQUAT",
      message: `Nama "${packageName}" mirip dengan package populer "${lookalike}". Pastikan ini package yang dimaksud.`,
    });
  }

  // 2. All-digit package name
  if (isAllDigits(lower)) {
    signals.push({
      code: "NUMERIC_NAME",
      message: `Nama package "${packageName}" hanya berisi angka — perlu dicek keasliannya secara manual.`,
    });
  }

  return signals;
}
