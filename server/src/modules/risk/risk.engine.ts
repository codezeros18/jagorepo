import type {
  RiskFinding,
  RiskCategory,
  Confidence,
  ScanResult,
  NormalizedVulnerability,
  Ecosystem,
} from "../../types/index.js";
import type { ParseSummary } from "../parser/parser.orchestrator.js";
import type { OsvScanSummary, OsvScanEntry } from "../scanner/osv.scanner.js";
import { checkSuspicious, type SuspiciousSignal } from "./suspicious.heuristic.js";
import {
  buildReasons,
  buildRecommendation,
} from "./explanation.js";

// ── Scoring constants (documented, matches TASK_07 spec) ─────────────────────

const SCORE = {
  CRITICAL: 40,
  HIGH: 30,
  MEDIUM: 15,
  LOW: 5,
  UNKNOWN_VULN: 10,    // vuln exists but severity not determined
  UNKNOWN_VERSION: 8,  // dep was skipped (no version) — uncertainty penalty
  SUSPICIOUS: 15,      // heuristic signal (not a confirmed vuln)
  MISSING_LOCKFILE: 10, // project-level: lockfile absent
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function vulnSeverityScore(severity?: string): number {
  if (!severity) return SCORE.UNKNOWN_VULN;
  switch (severity.toUpperCase()) {
    case "CRITICAL": return SCORE.CRITICAL;
    case "HIGH":     return SCORE.HIGH;
    case "MEDIUM":   return SCORE.MEDIUM;
    case "LOW":      return SCORE.LOW;
    default:         return SCORE.UNKNOWN_VULN;
  }
}

function toCategory(score: number): RiskCategory {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

function toConfidence(
  vulns: NormalizedVulnerability[],
  suspicious: SuspiciousSignal[],
  skipped: boolean
): Confidence {
  if (vulns.length > 0) return "High";   // known CVE from OSV database
  if (suspicious.length > 0) return "Low"; // heuristic only
  if (skipped) return "Low";              // no version, can't verify
  return "Medium";                        // checked OSV, found nothing
}

// ── Per-package scoring ───────────────────────────────────────────────────────

type PackageScore = {
  score: number;
  vulnScore: number;       // contribution from known vulns only
  heuristicScore: number;  // contribution from heuristic only
  suspicious: SuspiciousSignal[];
};

function scorePackage(entry: OsvScanEntry): PackageScore {
  let vulnScore = 0;

  // Accumulate per-vuln (multiple CVEs in one package each add to risk)
  for (const vuln of entry.vulnerabilities) {
    vulnScore += vulnSeverityScore(vuln.severity);
  }

  // Missing version: can't run OSV check → uncertainty penalty
  if (entry.skipped) {
    vulnScore += SCORE.UNKNOWN_VERSION;
  }

  // Heuristic check (separate bucket — keeps known-vuln vs heuristic distinct)
  const suspicious = checkSuspicious(entry.packageName, entry.ecosystem);
  const heuristicScore = suspicious.length > 0 ? SCORE.SUSPICIOUS : 0;

  const total = Math.min(vulnScore + heuristicScore, 100);
  return { score: total, vulnScore, heuristicScore, suspicious };
}


function explanationId(score: number, hasSuspicious: boolean): string {
  if (hasSuspicious && score < 15) return "finding-suspicious";
  const cat = toCategory(score);
  return `finding-${cat.toLowerCase()}`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Build per-package RiskFindings and an overall ScanResult.
 *
 * Score formula (additive, capped at 100 per package and 100 overall):
 *   vulnScore    = sum(severity_penalty) per vulnerability
 *   heuristic    = +15 if suspicious name signal triggered
 *   unknownVer   = +8  if version was not available (skipped by OSV)
 *   packageScore = min(vulnScore + heuristic + unknownVer, 100)
 *
 *   overallScore = min(sum(packageScores) + missingLockfilePenalty, 100)
 */
export function computeRiskFindings(
  parseSummary: ParseSummary,
  osvScan: OsvScanSummary,
  scanId: string
): ScanResult {
  const findings: RiskFinding[] = [];
  let cumulativeScore = 0;

  for (const entry of osvScan.entries) {
    const { score, suspicious } = scorePackage(entry);
    cumulativeScore += score;

    findings.push({
      packageName: entry.packageName,
      version: entry.version,
      ecosystem: entry.ecosystem as Ecosystem,
      riskScore: score,
      riskCategory: toCategory(score),
      confidence: toConfidence(entry.vulnerabilities, suspicious, entry.skipped),
      reasons: buildReasons(entry, suspicious, parseSummary.hasLockfile),
      vulnerabilities: entry.vulnerabilities,
      recommendation: buildRecommendation(entry, suspicious, score, entry.ecosystem),
      explanationId: explanationId(score, suspicious.length > 0),
    });
  }

  // Project-level signal: missing lockfile raises overall risk
  const lockfilePenalty = parseSummary.hasLockfile ? 0 : SCORE.MISSING_LOCKFILE;
  const overallScore = Math.min(cumulativeScore + lockfilePenalty, 100);

  // Sort findings by riskScore descending so highest risk appears first
  findings.sort((a, b) => b.riskScore - a.riskScore);

  return {
    scanId,
    scannedAt: osvScan.scannedAt,
    sourceFile: parseSummary.sourceFile,
    totalDependencies: parseSummary.totalFound,
    vulnerableDependencies: osvScan.totalVulnerable,
    overallRiskScore: overallScore,
    overallRiskCategory: toCategory(overallScore),
    findings,
  };
}
