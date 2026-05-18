import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scanDependencies } from "../osv.scanner.js";
import type { ParsedDependency } from "../../../types/index.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

function dep(
  name: string,
  version?: string,
  ecosystem: "npm" | "PyPI" = "npm"
): ParsedDependency {
  return { name, version, ecosystem, sourceFile: "test", dependencyType: "prod" };
}

// All tests use forceMock:true — no network calls

// ── scanDependencies (mock mode) ──────────────────────────────────────────────

describe("scanDependencies — basic", () => {
  it("returns empty summary for empty dep list", async () => {
    const r = await scanDependencies([], { forceMock: true });
    assert.equal(r.entries.length, 0);
    assert.equal(r.totalVulnerable, 0);
    assert.equal(r.totalSkipped, 0);
    assert.equal(r.usedMock, true);
  });

  it("returns no vulns for unknown package", async () => {
    const r = await scanDependencies([dep("totally-unknown-pkg", "1.0.0")], {
      forceMock: true,
    });
    assert.equal(r.entries.length, 1);
    assert.equal(r.entries[0].vulnerabilities.length, 0);
    assert.equal(r.entries[0].skipped, false);
  });

  it("skips dep without version", async () => {
    const r = await scanDependencies([dep("pandas", undefined, "PyPI")], {
      forceMock: true,
    });
    assert.equal(r.entries[0].skipped, true);
    assert.equal(r.entries[0].vulnerabilities.length, 0);
    assert.equal(r.totalSkipped, 1);
  });

  it("sets usedMock=true when forceMock", async () => {
    const r = await scanDependencies([dep("express", "4.18.0")], {
      forceMock: true,
    });
    assert.equal(r.usedMock, true);
  });

  it("scannedAt is a valid ISO string", async () => {
    const r = await scanDependencies([], { forceMock: true });
    assert.ok(!isNaN(new Date(r.scannedAt).getTime()));
  });
});

// ── Known-vulnerable packages in mock ────────────────────────────────────────

describe("scanDependencies — mock vuln data", () => {
  it("detects vulns in lodash (npm)", async () => {
    const r = await scanDependencies([dep("lodash", "4.17.20")], {
      forceMock: true,
    });
    assert.ok(r.entries[0].vulnerabilities.length > 0);
    assert.equal(r.totalVulnerable, 1);
  });

  it("detects vulns in requests (PyPI)", async () => {
    const r = await scanDependencies([dep("requests", "2.27.0", "PyPI")], {
      forceMock: true,
    });
    assert.ok(r.entries[0].vulnerabilities.length > 0);
    assert.equal(r.totalVulnerable, 1);
  });

  it("detects vulns in pillow (PyPI, uppercase name)", async () => {
    const r = await scanDependencies([dep("Pillow", "8.0.0", "PyPI")], {
      forceMock: true,
    });
    // Mock lookup normalizes to lowercase
    assert.ok(r.entries[0].vulnerabilities.length > 0);
  });
});

// ── NormalizedVulnerability shape ─────────────────────────────────────────────

describe("scanDependencies — vulnerability normalization", () => {
  it("vuln has id, summary, severity, publishedAt, url", async () => {
    const r = await scanDependencies([dep("lodash", "4.17.20")], {
      forceMock: true,
    });
    const vuln = r.entries[0].vulnerabilities[0];
    assert.ok(typeof vuln.id === "string" && vuln.id.length > 0);
    assert.ok(typeof vuln.summary === "string" && vuln.summary.length > 0);
    assert.ok(typeof vuln.severity === "string");
    assert.ok(typeof vuln.publishedAt === "string");
    assert.ok(typeof vuln.url === "string");
  });

  it("severity is extracted from database_specific (HIGH)", async () => {
    const r = await scanDependencies([dep("lodash", "4.17.20")], {
      forceMock: true,
    });
    assert.equal(r.entries[0].vulnerabilities[0].severity, "HIGH");
  });

  it("severity is extracted from database_specific (MEDIUM)", async () => {
    const r = await scanDependencies([dep("minimist", "0.2.0")], {
      forceMock: true,
    });
    assert.equal(r.entries[0].vulnerabilities[0].severity, "MEDIUM");
  });

  it("id starts with GHSA or CVE", async () => {
    const r = await scanDependencies([dep("lodash", "4.17.20")], {
      forceMock: true,
    });
    const id = r.entries[0].vulnerabilities[0].id;
    assert.ok(id.startsWith("GHSA-") || id.startsWith("CVE-"));
  });
});

// ── Mixed deps ────────────────────────────────────────────────────────────────

describe("scanDependencies — mixed dep list", () => {
  it("handles mix of versioned, unversioned, vulnerable, and safe", async () => {
    const deps = [
      dep("lodash", "4.17.20"),          // vulnerable
      dep("express", "4.18.2"),          // safe in mock
      dep("pandas", undefined, "PyPI"),  // skipped (no version)
      dep("requests", "2.27.0", "PyPI"), // vulnerable
    ];
    const r = await scanDependencies(deps, { forceMock: true });
    assert.equal(r.entries.length, 4);
    assert.equal(r.totalSkipped, 1);
    assert.ok(r.totalVulnerable >= 2); // lodash + requests
    assert.equal(r.totalErrors, 0);
  });

  it("preserves order of input deps", async () => {
    const deps = [
      dep("requests", "2.27.0", "PyPI"),
      dep("lodash", "4.17.20"),
    ];
    const r = await scanDependencies(deps, { forceMock: true });
    assert.equal(r.entries[0].packageName, "requests");
    assert.equal(r.entries[1].packageName, "lodash");
  });
});
