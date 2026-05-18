import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildReasons, buildRecommendation, sevLabel } from "../explanation.js";
import type { OsvScanEntry } from "../../scanner/osv.scanner.js";
import type { NormalizedVulnerability } from "../../../types/index.js";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function vuln(id: string, severity?: string): NormalizedVulnerability {
  return {
    id,
    summary: `Test vuln ${id}`,
    severity,
    publishedAt: "2024-01-01T00:00:00Z",
    url: `https://example.com/${id}`,
  };
}

function entry(
  name: string,
  version: string | undefined,
  vulns: NormalizedVulnerability[],
  skipped = false,
  ecosystem = "npm"
): OsvScanEntry {
  return { packageName: name, version, ecosystem, vulnerabilities: vulns, skipped, error: undefined };
}

const noSuspicious: { code: string; message: string }[] = [];
const suspicious = [{ code: "TYPOSQUAT", message: "Nama ini mirip dengan package populer 'colors'." }];

// ── sevLabel ──────────────────────────────────────────────────────────────────

describe("sevLabel", () => {
  it("returns Critical for CRITICAL", () => assert.equal(sevLabel("CRITICAL"), "Critical"));
  it("returns High (tinggi) for HIGH", () => assert.equal(sevLabel("HIGH"), "High (tinggi)"));
  it("returns Medium (sedang) for MEDIUM", () => assert.equal(sevLabel("MEDIUM"), "Medium (sedang)"));
  it("returns Low (rendah) for LOW", () => assert.equal(sevLabel("LOW"), "Low (rendah)"));
  it("handles lowercase input", () => assert.equal(sevLabel("high"), "High (tinggi)"));
  it("returns fallback for unknown", () => assert.ok(sevLabel("EXOTIC").includes("tidak diketahui")));
});

// ── buildReasons — known vulnerabilities ─────────────────────────────────────

describe("buildReasons — known vulnerabilities", () => {
  it("mentions Critical for CRITICAL vuln", () => {
    const r = buildReasons(entry("pkg", "1.0.0", [vuln("V1", "CRITICAL")]), noSuspicious, true);
    assert.ok(r.some((s) => s.includes("Critical")));
  });

  it("includes educational context for CRITICAL (remote/eksekusi)", () => {
    const r = buildReasons(entry("pkg", "1.0.0", [vuln("V1", "CRITICAL")]), noSuspicious, true);
    const line = r.find((s) => s.includes("Critical"))!;
    assert.ok(line.includes("eksekusi") || line.includes("mengambil alih"), `line: ${line}`);
  });

  it("mentions High for HIGH vuln", () => {
    const r = buildReasons(entry("pkg", "1.0.0", [vuln("V1", "HIGH")]), noSuspicious, true);
    assert.ok(r.some((s) => s.includes("High")));
  });

  it("includes educational context for HIGH (kebocoran/bypass)", () => {
    const r = buildReasons(entry("pkg", "1.0.0", [vuln("V1", "HIGH")]), noSuspicious, true);
    const line = r.find((s) => s.includes("High"))!;
    assert.ok(line.includes("kebocoran") || line.includes("bypass") || line.includes("eksekusi"), `line: ${line}`);
  });

  it("groups multiple vulns of same severity in one sentence", () => {
    const r = buildReasons(
      entry("pkg", "1.0.0", [vuln("V1", "HIGH"), vuln("V2", "HIGH")]),
      noSuspicious,
      true
    );
    const highLines = r.filter((s) => s.includes("High"));
    assert.equal(highLines.length, 1);
    assert.ok(highLines[0].includes("2"));
  });

  it("produces separate sentences for different severities", () => {
    const r = buildReasons(
      entry("pkg", "1.0.0", [vuln("V1", "HIGH"), vuln("V2", "MEDIUM")]),
      noSuspicious,
      true
    );
    assert.ok(r.some((s) => s.includes("High")));
    assert.ok(r.some((s) => s.includes("Medium")));
  });

  it("returns safe message for clean package", () => {
    const r = buildReasons(entry("pkg", "1.0.0", []), noSuspicious, true);
    assert.equal(r.length, 1);
    assert.ok(r[0].includes("Tidak ada vulnerability"));
    assert.ok(r[0].includes("aman"));
  });
});

// ── buildReasons — skipped / lockfile ────────────────────────────────────────

describe("buildReasons — skipped entries", () => {
  it("explains that version is missing and OSV cannot be checked", () => {
    const r = buildReasons(entry("pkg", undefined, [], true), noSuspicious, true);
    assert.ok(r.some((s) => s.includes("tidak tercantum") || s.includes("tidak dapat dilakukan")));
  });

  it("adds lockfile reason when lockfile absent and version skipped", () => {
    const r = buildReasons(entry("pkg", undefined, [], true), noSuspicious, false);
    assert.ok(r.some((s) => s.includes("lockfile")));
  });

  it("does not add lockfile reason when lockfile present", () => {
    const r = buildReasons(entry("pkg", undefined, [], true), noSuspicious, true);
    assert.ok(!r.some((s) => s.includes("lockfile")));
  });
});

// ── buildReasons — heuristic signals ─────────────────────────────────────────

describe("buildReasons — heuristic signals", () => {
  it("prefixes heuristic reasons with [Signal heuristik]", () => {
    const r = buildReasons(entry("coloars", "1.0.0", []), suspicious, true);
    assert.ok(r.some((s) => s.startsWith("[Signal heuristik]")));
  });

  it("heuristic reason message is included verbatim", () => {
    const r = buildReasons(entry("coloars", "1.0.0", []), suspicious, true);
    const heuristicLine = r.find((s) => s.startsWith("[Signal heuristik]"))!;
    assert.ok(heuristicLine.includes("colors"), `line: ${heuristicLine}`);
  });

  it("can have both vuln reasons and heuristic reasons", () => {
    const r = buildReasons(entry("coloars", "1.0.0", [vuln("V1", "HIGH")]), suspicious, true);
    assert.ok(r.some((s) => s.includes("High")));
    assert.ok(r.some((s) => s.startsWith("[Signal heuristik]")));
  });
});

// ── buildRecommendation — suspicious only ────────────────────────────────────

describe("buildRecommendation — suspicious only", () => {
  it("recommends verifying package source", () => {
    const r = buildRecommendation(entry("coloars", "1.0.0", []), suspicious, 15, "npm");
    assert.ok(r.includes("Verifikasi") || r.includes("verifikasi"));
  });

  it("does not claim package is malicious", () => {
    const r = buildRecommendation(entry("coloars", "1.0.0", []), suspicious, 15, "npm");
    assert.ok(!r.toLowerCase().includes("malware"));
    assert.ok(!r.toLowerCase().includes("berbahaya"));
  });

  it("mentions npm for npm ecosystem", () => {
    const r = buildRecommendation(entry("coloars", "1.0.0", []), suspicious, 15, "npm");
    assert.ok(r.includes("npm"));
  });

  it("mentions PyPI for pypi ecosystem", () => {
    const r = buildRecommendation(entry("coloars", "1.0.0", []), suspicious, 15, "pypi");
    assert.ok(r.toLowerCase().includes("pypi"));
  });
});

// ── buildRecommendation — skipped (no version) ───────────────────────────────

describe("buildRecommendation — skipped entries", () => {
  it("instructs to add explicit version", () => {
    const r = buildRecommendation(entry("pkg", undefined, [], true), noSuspicious, 8, "npm");
    assert.ok(r.includes("versi eksplisit") || r.includes("version"));
  });

  it("includes npm install command for npm ecosystem", () => {
    const r = buildRecommendation(entry("pkg", undefined, [], true), noSuspicious, 8, "npm");
    assert.ok(r.includes("npm install") || r.includes("package-lock.json"));
  });

  it("includes pip freeze command for pypi ecosystem", () => {
    const r = buildRecommendation(entry("pkg", undefined, [], true), noSuspicious, 8, "pypi");
    assert.ok(r.includes("pip freeze") || r.includes("requirements.txt"));
  });

  it("mentions Dependabot for ongoing monitoring", () => {
    const r = buildRecommendation(entry("pkg", undefined, [], true), noSuspicious, 8, "npm");
    assert.ok(r.includes("Dependabot"));
  });
});

// ── buildRecommendation — by severity ────────────────────────────────────────

describe("buildRecommendation — severity-based actions", () => {
  it("CRITICAL: includes update command and mentions patch", () => {
    const e = entry("lodash", "4.17.20", [vuln("V1", "CRITICAL")]);
    const r = buildRecommendation(e, noSuspicious, 40, "npm");
    assert.ok(r.includes("npm update lodash"));
    assert.ok(r.includes("patch") || r.includes("dipatch"));
  });

  it("HIGH: includes update command and mentions Dependabot", () => {
    const e = entry("axios", "0.21.1", [vuln("V1", "HIGH")]);
    const r = buildRecommendation(e, noSuspicious, 30, "npm");
    assert.ok(r.includes("npm update axios"));
    assert.ok(r.includes("Dependabot") || r.includes("Renovate"));
  });

  it("MEDIUM: suggests scheduling update in next deployment cycle", () => {
    const e = entry("minimist", "1.2.5", [vuln("V1", "MEDIUM")]);
    const r = buildRecommendation(e, noSuspicious, 15, "npm");
    assert.ok(r.includes("npm update minimist"));
    assert.ok(r.includes("Dependabot") || r.includes("deployment") || r.includes("jadwal"));
  });

  it("LOW: acknowledges low risk but still recommends update", () => {
    const e = entry("safe-pkg", "1.0.0", [vuln("V1", "LOW")]);
    const r = buildRecommendation(e, noSuspicious, 5, "npm");
    assert.ok(r.includes("npm update safe-pkg"));
  });

  it("score 0 with no suspicious: safe acknowledgement", () => {
    const e = entry("express", "4.18.2", []);
    const r = buildRecommendation(e, noSuspicious, 0, "npm");
    assert.ok(r.includes("tidak memiliki vulnerability") || r.includes("aman"));
    assert.ok(!r.includes("npm update"));
  });

  it("PyPI: update command uses pip install --upgrade", () => {
    const e = entry("requests", "2.28.0", [vuln("V1", "HIGH")]);
    const r = buildRecommendation(e, noSuspicious, 30, "pypi");
    assert.ok(r.includes("pip install --upgrade requests"));
  });
});
