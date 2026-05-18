import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeNpmVersion, parsePypiSpecifier, normalizePypiName } from "../../../lib/normalize.js";
import { parsePackageJson } from "../package-json.parser.js";
import { parsePackageLock } from "../package-lock.parser.js";
import { parseRequirementsTxt } from "../requirements-txt.parser.js";
import { parseFile } from "../parser.orchestrator.js";

const buf = (s: string) => Buffer.from(s, "utf-8");

// ─── normalizeNpmVersion ──────────────────────────────────────────────────────

describe("normalizeNpmVersion", () => {
  it("strips ^ prefix", () => assert.equal(normalizeNpmVersion("^4.17.15"), "4.17.15"));
  it("strips ~ prefix", () => assert.equal(normalizeNpmVersion("~1.2.3"), "1.2.3"));
  it("strips >= prefix", () => assert.equal(normalizeNpmVersion(">=1.0.0"), "1.0.0"));
  it("strips v prefix", () => assert.equal(normalizeNpmVersion("v2.0.0"), "2.0.0"));
  it("keeps plain version", () => assert.equal(normalizeNpmVersion("4.17.15"), "4.17.15"));
  it("handles compound range (first part)", () => assert.equal(normalizeNpmVersion(">=1.0.0 <2.0.0"), "1.0.0"));
  it("returns undefined for *", () => assert.equal(normalizeNpmVersion("*"), undefined));
  it("returns undefined for latest", () => assert.equal(normalizeNpmVersion("latest"), undefined));
  it("returns undefined for empty string", () => assert.equal(normalizeNpmVersion(""), undefined));
  it("returns undefined for undefined", () => assert.equal(normalizeNpmVersion(undefined), undefined));
  it("returns undefined for workspace:", () => assert.equal(normalizeNpmVersion("workspace:*"), undefined));
  it("returns undefined for file:", () => assert.equal(normalizeNpmVersion("file:../local-pkg"), undefined));
});

// ─── parsePypiSpecifier ───────────────────────────────────────────────────────

describe("parsePypiSpecifier", () => {
  it("parses == specifier", () => {
    const r = parsePypiSpecifier("requests==2.28.0");
    assert.equal(r?.name, "requests");
    assert.equal(r?.version, "2.28.0");
  });
  it("parses >= specifier", () => {
    const r = parsePypiSpecifier("flask>=2.0.0");
    assert.equal(r?.name, "flask");
    assert.equal(r?.version, "2.0.0");
  });
  it("parses ~= specifier", () => {
    const r = parsePypiSpecifier("numpy~=1.21.0");
    assert.equal(r?.name, "numpy");
    assert.equal(r?.version, "1.21.0");
  });
  it("parses name-only (no version)", () => {
    const r = parsePypiSpecifier("pandas");
    assert.equal(r?.name, "pandas");
    assert.equal(r?.version, undefined);
  });
  it("strips extras", () => {
    const r = parsePypiSpecifier("requests[security]>=2.27.1");
    assert.equal(r?.name, "requests");
    assert.equal(r?.version, "2.27.1");
  });
  it("normalizes uppercase name", () => {
    const r = parsePypiSpecifier("Pillow==9.0.0");
    assert.equal(r?.name, "pillow");
  });
  it("normalizes underscore to dash", () => {
    const r = parsePypiSpecifier("scikit_learn==1.0.0");
    assert.equal(r?.name, "scikit-learn");
  });
  it("returns null for comment", () => {
    assert.equal(parsePypiSpecifier("# comment"), null);
  });
  it("returns null for empty string", () => {
    assert.equal(parsePypiSpecifier(""), null);
  });
});

// ─── normalizePypiName ────────────────────────────────────────────────────────

describe("normalizePypiName", () => {
  it("lowercases", () => assert.equal(normalizePypiName("Django"), "django"));
  it("replaces underscore", () => assert.equal(normalizePypiName("scikit_learn"), "scikit-learn"));
  it("replaces dot", () => assert.equal(normalizePypiName("zope.interface"), "zope-interface"));
});

// ─── parsePackageJson ─────────────────────────────────────────────────────────

describe("parsePackageJson", () => {
  it("parses dependencies and devDependencies", () => {
    const json = JSON.stringify({
      name: "my-app",
      dependencies: { express: "^4.18.0", lodash: "4.17.21" },
      devDependencies: { typescript: "^5.0.0" },
    });
    const r = parsePackageJson(buf(json));
    assert.equal(r.dependencies.length, 3);

    const express = r.dependencies.find((d) => d.name === "express");
    assert.equal(express?.version, "4.18.0");
    assert.equal(express?.ecosystem, "npm");
    assert.equal(express?.dependencyType, "prod");

    const ts = r.dependencies.find((d) => d.name === "typescript");
    assert.equal(ts?.dependencyType, "dev");
    assert.equal(ts?.version, "5.0.0");
  });

  it("handles package with no dependencies (only name)", () => {
    const json = JSON.stringify({ name: "empty-app" });
    const r = parsePackageJson(buf(json));
    assert.equal(r.dependencies.length, 0);
    assert.equal(r.warnings.length, 0);
  });

  it("does not crash on invalid JSON", () => {
    const r = parsePackageJson(buf("this is not json {{"));
    assert.equal(r.dependencies.length, 0);
    assert.ok(r.warnings.length > 0);
  });

  it("does not crash on empty buffer", () => {
    const r = parsePackageJson(buf(""));
    assert.equal(r.dependencies.length, 0);
  });

  it("marks workspace versions with warning, still includes dep", () => {
    const json = JSON.stringify({
      dependencies: { "local-pkg": "workspace:*" },
    });
    const r = parsePackageJson(buf(json));
    assert.equal(r.dependencies.length, 1);
    assert.equal(r.dependencies[0].version, undefined);
    assert.ok(r.warnings.some((w) => w.includes("workspace")));
  });

  it("includes peerDependencies as dev type", () => {
    const json = JSON.stringify({
      peerDependencies: { react: ">=16.0.0" },
    });
    const r = parsePackageJson(buf(json));
    assert.equal(r.dependencies.length, 1);
    assert.equal(r.dependencies[0].name, "react");
    assert.equal(r.dependencies[0].dependencyType, "dev");
  });

  it("sets ecosystem to npm", () => {
    const json = JSON.stringify({ dependencies: { axios: "^1.0.0" } });
    const r = parsePackageJson(buf(json));
    assert.equal(r.dependencies[0].ecosystem, "npm");
  });
});

// ─── parsePackageLock ─────────────────────────────────────────────────────────

describe("parsePackageLock", () => {
  it("parses lockfile v3 packages format", () => {
    const lock = JSON.stringify({
      lockfileVersion: 3,
      packages: {
        "": { name: "root" }, // root entry — should be skipped
        "node_modules/express": { version: "4.18.2" },
        "node_modules/lodash": { version: "4.17.21" },
      },
    });
    const r = parsePackageLock(buf(lock));
    assert.equal(r.lockfileVersion, 3);
    assert.equal(r.dependencies.length, 2);
    assert.ok(r.dependencies.every((d) => d.dependencyType === "lock"));
    assert.ok(r.dependencies.some((d) => d.name === "express" && d.version === "4.18.2"));
  });

  it("parses lockfile v1 dependencies format", () => {
    const lock = JSON.stringify({
      lockfileVersion: 1,
      dependencies: {
        express: { version: "4.17.1" },
        lodash: { version: "4.17.15" },
      },
    });
    const r = parsePackageLock(buf(lock));
    assert.equal(r.lockfileVersion, 1);
    assert.equal(r.dependencies.length, 2);
    assert.ok(r.dependencies.some((d) => d.name === "express" && d.version === "4.17.1"));
  });

  it("handles scoped packages in v3", () => {
    const lock = JSON.stringify({
      lockfileVersion: 3,
      packages: {
        "node_modules/@types/node": { version: "20.0.0" },
      },
    });
    const r = parsePackageLock(buf(lock));
    assert.equal(r.dependencies.length, 1);
    assert.equal(r.dependencies[0].name, "@types/node");
  });

  it("does not crash on invalid JSON", () => {
    const r = parsePackageLock(buf("bad json"));
    assert.equal(r.dependencies.length, 0);
    assert.ok(r.warnings.length > 0);
  });

  it("sets ecosystem to npm", () => {
    const lock = JSON.stringify({
      lockfileVersion: 3,
      packages: { "node_modules/axios": { version: "1.4.0" } },
    });
    const r = parsePackageLock(buf(lock));
    assert.equal(r.dependencies[0].ecosystem, "npm");
  });
});

// ─── parseRequirementsTxt ─────────────────────────────────────────────────────

describe("parseRequirementsTxt", () => {
  it("parses basic requirements file", () => {
    const txt = `
# comment
requests==2.28.0
flask>=2.0.0
numpy~=1.21.0
pandas
`.trim();
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies.length, 4);
    assert.equal(r.dependencies[0].name, "requests");
    assert.equal(r.dependencies[0].version, "2.28.0");
    assert.equal(r.dependencies[0].ecosystem, "PyPI");
    assert.equal(r.dependencies[3].name, "pandas");
    assert.equal(r.dependencies[3].version, undefined);
  });

  it("skips comment lines", () => {
    const txt = "# just a comment\nrequests==2.28.0";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies.length, 1);
  });

  it("skips -r include lines", () => {
    const txt = "-r base.txt\nflask==2.0.0";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies.length, 1);
    assert.equal(r.skippedLines.length, 1);
  });

  it("strips inline comments", () => {
    const txt = "requests==2.28.0  # security fix";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies[0].version, "2.28.0");
  });

  it("strips environment markers", () => {
    const txt = "futures==3.0.5; python_version=='2.6'";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies[0].name, "futures");
  });

  it("handles extras notation", () => {
    const txt = "requests[security,socks]>=2.27.1";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies[0].name, "requests");
    assert.equal(r.dependencies[0].version, "2.27.1");
  });

  it("normalizes package names", () => {
    const txt = "Pillow==9.0.0\nscikit_learn==1.0.0";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies[0].name, "pillow");
    assert.equal(r.dependencies[1].name, "scikit-learn");
  });

  it("deduplicates same package", () => {
    const txt = "requests==2.28.0\nrequests==2.27.0";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies.length, 1);
    assert.equal(r.dependencies[0].version, "2.28.0");
  });

  it("does not crash on empty buffer", () => {
    const r = parseRequirementsTxt(buf(""));
    assert.equal(r.dependencies.length, 0);
  });

  it("handles blank lines", () => {
    const txt = "\n\nrequests==2.28.0\n\nflask==2.0.0\n";
    const r = parseRequirementsTxt(buf(txt));
    assert.equal(r.dependencies.length, 2);
  });
});

// ─── parseFile orchestrator ───────────────────────────────────────────────────

describe("parseFile orchestrator", () => {
  it("routes package.json correctly", () => {
    const json = JSON.stringify({ dependencies: { lodash: "4.17.21" } });
    const r = parseFile(buf(json), "package.json");
    assert.equal(r.ecosystem, "npm");
    assert.equal(r.hasLockfile, false);
    assert.equal(r.sourceFile, "package.json");
    assert.equal(r.dependencies.length, 1);
  });

  it("routes package-lock.json and sets hasLockfile", () => {
    const lock = JSON.stringify({
      lockfileVersion: 3,
      packages: { "node_modules/express": { version: "4.18.2" } },
    });
    const r = parseFile(buf(lock), "package-lock.json");
    assert.equal(r.hasLockfile, true);
    assert.equal(r.lockfileVersion, 3);
    assert.equal(r.ecosystem, "npm");
  });

  it("routes requirements.txt correctly", () => {
    const txt = "requests==2.28.0\nflask>=2.0.0";
    const r = parseFile(buf(txt), "requirements.txt");
    assert.equal(r.ecosystem, "PyPI");
    assert.equal(r.hasLockfile, false);
    assert.equal(r.dependencies.length, 2);
  });
});
