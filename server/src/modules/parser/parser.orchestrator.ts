import type { ParsedDependency } from "../../types/index.js";
import type { AcceptedFileName } from "../../lib/validation.js";
import { parsePackageJson } from "./package-json.parser.js";
import { parsePackageLock } from "./package-lock.parser.js";
import { parseRequirementsTxt } from "./requirements-txt.parser.js";

export type ParseSummary = {
  /** Semua dependency yang berhasil di-parse dan dinormalisasi */
  dependencies: ParsedDependency[];
  /** Jumlah dependency yang ditemukan */
  totalFound: number;
  /** Warning non-fatal dari parser */
  warnings: string[];
  /** Signal: apakah ada lockfile (berguna untuk risk engine) */
  hasLockfile: boolean;
  /** Versi lockfile jika package-lock.json */
  lockfileVersion?: number;
  /** Ekosistem yang terdeteksi */
  ecosystem: "npm" | "PyPI";
  /** Nama file sumber */
  sourceFile: string;
};

/**
 * Orchestrator utama: pilih parser yang tepat berdasarkan nama file,
 * jalankan parser, dan kembalikan ParseSummary yang dinormalisasi.
 */
export function parseFile(
  buffer: Buffer,
  fileName: AcceptedFileName
): ParseSummary {
  switch (fileName) {
    case "package.json": {
      const result = parsePackageJson(buffer, fileName);
      return {
        dependencies: result.dependencies,
        totalFound: result.dependencies.length,
        warnings: result.warnings,
        hasLockfile: false,
        ecosystem: "npm",
        sourceFile: fileName,
      };
    }

    case "package-lock.json": {
      const result = parsePackageLock(buffer, fileName);
      return {
        dependencies: result.dependencies,
        totalFound: result.dependencies.length,
        warnings: result.warnings,
        hasLockfile: true,
        lockfileVersion: result.lockfileVersion,
        ecosystem: "npm",
        sourceFile: fileName,
      };
    }

    case "requirements.txt": {
      const result = parseRequirementsTxt(buffer, fileName);
      return {
        dependencies: result.dependencies,
        totalFound: result.dependencies.length,
        warnings: result.warnings,
        hasLockfile: false,
        ecosystem: "PyPI",
        sourceFile: fileName,
      };
    }
  }
}
