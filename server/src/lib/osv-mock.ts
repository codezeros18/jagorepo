import type { OsvDepResult, OsvRawVuln } from "./osv-client.js";
import type { ParsedDependency } from "../types/index.js";

// ── Mock vulnerability database ───────────────────────────────────────────────
// Real GHSA/CVE IDs for well-known packages, used in demo mode.
// These are real advisories — versions and details may not be 100% precise.

const MOCK_VULNS: Record<string, OsvRawVuln[]> = {
  // npm ──────────────────────────────────────────────────────────────────────
  lodash: [
    {
      id: "GHSA-jf85-cpcp-j695",
      summary: "Prototype Pollution in lodash",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L",
        },
      ],
      published: "2020-08-03T00:00:00Z",
      database_specific: { severity: "HIGH" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-jf85-cpcp-j695",
        },
      ],
    },
  ],
  minimist: [
    {
      id: "GHSA-vh95-rmgr-6w4m",
      summary: "Prototype Pollution in minimist",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L",
        },
      ],
      published: "2020-03-11T00:00:00Z",
      database_specific: { severity: "MEDIUM" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-vh95-rmgr-6w4m",
        },
      ],
    },
  ],
  "node-fetch": [
    {
      id: "GHSA-r683-j2x4-v87g",
      summary: "Exposure of Sensitive Information in node-fetch",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N",
        },
      ],
      published: "2022-01-21T00:00:00Z",
      database_specific: { severity: "HIGH" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-r683-j2x4-v87g",
        },
      ],
    },
  ],
  "follow-redirects": [
    {
      id: "GHSA-cxjh-pqwp-8mfp",
      summary: "Improper Input Validation in follow-redirects",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N",
        },
      ],
      published: "2023-02-16T00:00:00Z",
      database_specific: { severity: "MEDIUM" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-cxjh-pqwp-8mfp",
        },
      ],
    },
  ],
  axios: [
    {
      id: "GHSA-wf5p-g6vw-rhxx",
      summary: "Axios Cross-Site Request Forgery Vulnerability",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
        },
      ],
      published: "2023-11-08T00:00:00Z",
      database_specific: { severity: "HIGH" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-wf5p-g6vw-rhxx",
        },
      ],
    },
  ],
  // PyPI ─────────────────────────────────────────────────────────────────────
  requests: [
    {
      id: "GHSA-j8r2-6x86-q33q",
      summary: "Unintended leak of Proxy-Authorization header in requests",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:N/A:N",
        },
      ],
      published: "2023-05-26T00:00:00Z",
      database_specific: { severity: "HIGH" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-j8r2-6x86-q33q",
        },
      ],
    },
  ],
  pillow: [
    {
      id: "GHSA-3f63-hfp8-52jq",
      summary: "Buffer overflow in Pillow",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
        },
      ],
      published: "2022-01-10T00:00:00Z",
      database_specific: { severity: "HIGH" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-3f63-hfp8-52jq",
        },
      ],
    },
  ],
  cryptography: [
    {
      id: "GHSA-jm77-qphf-c4w8",
      summary: "pyca/cryptography's wheels include vulnerable OpenSSL",
      severity: [
        {
          type: "CVSS_V3",
          score: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
        },
      ],
      published: "2023-11-29T00:00:00Z",
      database_specific: { severity: "MEDIUM" },
      references: [
        {
          type: "ADVISORY",
          url: "https://github.com/advisories/GHSA-jm77-qphf-c4w8",
        },
      ],
    },
  ],
};

// Minimum patched version per package — versions >= this are considered safe
const MIN_SAFE_VERSION: Record<string, string> = {
  lodash: "4.17.21",
  minimist: "1.2.6",
  axios: "0.27.2",
  "node-fetch": "3.0.0",
  "follow-redirects": "1.15.4",
  requests: "2.32.0",
  pillow: "10.0.1",
  cryptography: "42.0.0",
};

function parseVer(v: string): number[] {
  return v.split(".").map((n) => parseInt(n, 10) || 0);
}

function isVersionPatched(version: string, minSafe: string): boolean {
  const a = parseVer(version);
  const b = parseVer(minSafe);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff > 0;
  }
  return true; // equal to minSafe → patched
}

/**
 * Return mock OSV results for a list of dependencies.
 * Packages with versions >= MIN_SAFE_VERSION are treated as patched (no vulns).
 */
export function getMockResults(deps: ParsedDependency[]): OsvDepResult[] {
  return deps.map((dep) => {
    if (!dep.version) {
      return { dep, vulns: [], skipped: true };
    }
    const normName = dep.name.toLowerCase();
    const allVulns = MOCK_VULNS[normName] ?? [];

    const minSafe = MIN_SAFE_VERSION[normName];
    const vulns =
      allVulns.length > 0 && minSafe && isVersionPatched(dep.version, minSafe)
        ? [] // version is patched — no known CVEs
        : allVulns;

    return { dep, vulns, skipped: false };
  });
}
