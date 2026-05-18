import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeRiskFindings } from "../risk.engine.js";
import { checkSuspicious } from "../suspicious.heuristic.js";
import type { ParseSummary } from "../../parser/parser.orchestrator.js";
import type { OsvScanSummary, OsvScanEntry } from "../../scanner/osv.scanner.js";
import type { NormalizedVulnerability } from "../../../types/index.js";

// ── Test fixtures ─────────────────────────────────────────────────────────────

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
  skipped = false
): OsvScanEntry {
  return {
    packageName: name,
    version,
    ecosystem: "npm",
    vulnerabilities: vulns,
    skipped,
    error: undefined,
  };
}

function makeOsvScan(entries: OsvScanEntry[]): OsvScanSummary {
  return {
    entries,
    totalVulnerable: entries.filter((e) => e.vulnerabilities.length > 0).length,
    totalSkipped: entries.filter((e) => e.skipped).length,
    totalErrors: 0,
    usedMock: true,
    scannedAt: "2026-01-01T00:00:00Z",
  };
}

function makeParseSummary(hasLockfile: boolean, count = 1): ParseSummary {
  return {
    dependencies: [],
    totalFound: count,
    warnings: [],
    hasLockfile,
    ecosystem: "npm",
    sourceFile: "package.json",
  };
}

// ── computeRiskFindings ───────────────────────────────────────────────────────

describe("computeRiskFindings — basic shape", () => {
  it("returns a ScanResult with all required fields", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("express", "4.18.0", [])]),
      "scan-001"
    );
    assert.equal(result.scanId, "scan-001");
    assert.equal(result.sourceFile, "package.json");
    assert.ok(typeof result.overallRiskScore === "number");
    assert.ok(typeof result.overallRiskCategory === "string");
    assert.ok(Array.isArray(result.findings));
  });

  it("overallRiskScore is 0 for clean deps with lockfile", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("express", "4.18.0", [])]),
      "scan-001"
    );
    assert.equal(result.overallRiskScore, 0);
    assert.equal(result.overallRiskCategory, "Low");
  });

  it("missing lockfile adds 10 to overall score", () => {
    const result = computeRiskFindings(
      makeParseSummary(false),
      makeOsvScan([entry("express", "4.18.0", [])]),
      "scan-002"
    );
    assert.equal(result.overallRiskScore, 10);
  });
});

// ── Score formula ─────────────────────────────────────────────────────────────

describe("computeRiskFindings — severity scoring", () => {
  it("CRITICAL vuln adds 40 to package score", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", "1.0.0", [vuln("V1", "CRITICAL")])]),
      "s1"
    );
    assert.equal(result.findings[0].riskScore, 40);
  });

  it("HIGH vuln adds 30 to package score", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", "1.0.0", [vuln("V1", "HIGH")])]),
      "s2"
    );
    assert.equal(result.findings[0].riskScore, 30);
  });

  it("MEDIUM vuln adds 15 to package score", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", "1.0.0", [vuln("V1", "MEDIUM")])]),
      "s3"
    );
    assert.equal(result.findings[0].riskScore, 15);
  });

  it("LOW vuln adds 5 to package score", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", "1.0.0", [vuln("V1", "LOW")])]),
      "s4"
    );
    assert.equal(result.findings[0].riskScore, 5);
  });

  it("unknown severity vuln adds 10 to package score", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", "1.0.0", [vuln("V1", undefined)])]),
      "s5"
    );
    assert.equal(result.findings[0].riskScore, 10);
  });

  it("multiple vulns accumulate", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([
        entry("pkg", "1.0.0", [
          vuln("V1", "HIGH"),    // +30
          vuln("V2", "MEDIUM"),  // +15
        ]),
      ]),
      "s6"
    );
    assert.equal(result.findings[0].riskScore, 45);
  });

  it("package score is capped at 100", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([
        entry("pkg", "1.0.0", [
          vuln("V1", "CRITICAL"), // +40
          vuln("V2", "CRITICAL"), // +40
          vuln("V3", "HIGH"),     // +30 → total 110 → cap 100
        ]),
      ]),
      "s7"
    );
    assert.equal(result.findings[0].riskScore, 100);
  });

  it("overall score is capped at 100", () => {
    const entries = Array.from({ length: 5 }, (_, i) =>
      entry(`pkg${i}`, "1.0.0", [vuln("V1", "CRITICAL")])  // each +40 → 200 total
    );
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan(entries),
      "s8"
    );
    assert.equal(result.overallRiskScore, 100);
  });

  it("overall score is never NaN", () => {
    const result = computeRiskFindings(
      makeParseSummary(false),
      makeOsvScan([]),
      "s9"
    );
    assert.ok(!isNaN(result.overallRiskScore));
  });
});

// ── Category thresholds ───────────────────────────────────────────────────────

describe("computeRiskFindings — category thresholds", () => {
  const cases: [string[], string, string][] = [
    [[],                        "Low",      "0 score"],
    [["LOW"],                   "Low",      "score 5"],
    [["MEDIUM"],                "Low",      "score 15"],
    [["HIGH"],                  "Medium",   "score 30"],
    [["HIGH", "MEDIUM"],        "Medium",   "score 45"],
    [["HIGH", "HIGH"],          "High",     "score 60"],
    [["CRITICAL", "HIGH"],      "High",     "score 70"],
    [["CRITICAL", "HIGH", "HIGH"], "Critical", "score 100"],
  ];

  for (const [sevs, expectedCat, label] of cases) {
    it(`category is ${expectedCat} for ${label}`, () => {
      const vulns = sevs.map((s: string, i: number) => vuln(`V${i}`, s));
      const result = computeRiskFindings(
        makeParseSummary(true),
        makeOsvScan([entry("pkg", "1.0.0", vulns)]),
        "cat-test"
      );
      assert.equal(result.findings[0].riskCategory, expectedCat);
    });
  }
});

// ── Confidence levels ─────────────────────────────────────────────────────────

describe("computeRiskFindings — confidence", () => {
  it("High confidence when OSV vulns found", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", "1.0.0", [vuln("V1", "HIGH")])]),
      "conf-1"
    );
    assert.equal(result.findings[0].confidence, "High");
  });

  it("Medium confidence when package is clean (version checked)", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", "1.0.0", [])]),
      "conf-2"
    );
    assert.equal(result.findings[0].confidence, "Medium");
  });

  it("Low confidence when version is unknown (skipped)", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("pkg", undefined, [], true)]),
      "conf-3"
    );
    assert.equal(result.findings[0].confidence, "Low");
  });
});

// ── Heuristic — separated from known vulns ────────────────────────────────────

describe("computeRiskFindings — suspicious heuristic", () => {
  it("adds heuristic score for typosquat name", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("coloars", "1.0.0", [])]),  // typosquat of "colors"
      "heur-1"
    );
    const finding = result.findings[0];
    assert.ok(finding.riskScore >= 15);
  });

  it("confidence is Low for heuristic-only finding", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("coloars", "1.0.0", [])]),
      "heur-2"
    );
    assert.equal(result.findings[0].confidence, "Low");
  });

  it("reasons include heuristic label for suspicious name", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("coloars", "1.0.0", [])]),
      "heur-3"
    );
    const hasHeuristicLabel = result.findings[0].reasons.some((r) =>
      r.includes("Signal heuristik")
    );
    assert.ok(hasHeuristicLabel);
  });

  it("heuristic and OSV vulns can coexist in same finding", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([entry("coloars", "1.0.0", [vuln("V1", "HIGH")])]),
      "heur-4"
    );
    const finding = result.findings[0];
    // Has both: OSV vuln score (30) + heuristic (15) = 45
    assert.equal(finding.riskScore, 45);
    // Confidence is High because OSV vuln takes precedence
    assert.equal(finding.confidence, "High");
  });
});

// ── Findings ordering ─────────────────────────────────────────────────────────

describe("computeRiskFindings — ordering", () => {
  it("findings sorted by riskScore descending", () => {
    const result = computeRiskFindings(
      makeParseSummary(true),
      makeOsvScan([
        entry("safe-pkg", "1.0.0", []),
        entry("risky-pkg", "1.0.0", [vuln("V1", "HIGH")]),
        entry("medium-pkg", "1.0.0", [vuln("V2", "MEDIUM")]),
      ]),
      "order-1"
    );
    const scores = result.findings.map((f) => f.riskScore);
    assert.ok(scores[0] >= scores[1]);
    assert.ok(scores[1] >= scores[2]);
  });
});

// ── checkSuspicious ───────────────────────────────────────────────────────────

describe("checkSuspicious", () => {
  it("detects known npm typosquat", () => {
    const signals = checkSuspicious("coloars", "npm");
    assert.ok(signals.some((s) => s.code === "TYPOSQUAT"));
  });

  it("detects known PyPI typosquat", () => {
    const signals = checkSuspicious("requets", "PyPI");
    assert.ok(signals.some((s) => s.code === "TYPOSQUAT"));
  });

  it("returns empty for legitimate package", () => {
    const signals = checkSuspicious("express", "npm");
    assert.equal(signals.length, 0);
  });

  it("detects all-digit name", () => {
    const signals = checkSuspicious("12345", "npm");
    assert.ok(signals.some((s) => s.code === "NUMERIC_NAME"));
  });

  it("does not flag scoped packages as digit-only unless genuinely so", () => {
    const signals = checkSuspicious("@types/node", "npm");
    assert.equal(signals.length, 0);
  });
});
