export type Ecosystem = "npm" | "PyPI";

export type DependencyType = "prod" | "dev" | "lock" | "unknown";

export type RiskCategory = "Low" | "Medium" | "High" | "Critical";

export type Confidence = "Low" | "Medium" | "High";

export type ParsedDependency = {
  name: string;
  version?: string;
  ecosystem: Ecosystem;
  sourceFile: string;
  dependencyType?: DependencyType;
};

export type NormalizedVulnerability = {
  id: string;
  summary: string;
  severity?: string;
  cvssScore?: number;
  publishedAt?: string;
  url?: string;
};

export type RiskFinding = {
  packageName: string;
  version?: string;
  ecosystem: Ecosystem;
  riskScore: number;
  riskCategory: RiskCategory;
  confidence: Confidence;
  reasons: string[];
  vulnerabilities: NormalizedVulnerability[];
  recommendation: string;
  explanationId?: string;
};

export type ScanResult = {
  scanId: string;
  scannedAt: string;
  projectName?: string;
  sourceFile: string;
  totalDependencies: number;
  vulnerableDependencies: number;
  overallRiskScore: number;
  overallRiskCategory: RiskCategory;
  findings: RiskFinding[];
};

export type ScanStatus = "idle" | "uploading" | "scanning" | "done" | "error";

// ── API response types (matches POST /api/scan backend response) ───────────────

export type ScanData = {
  scanId: string;
  scannedAt: string;
  sourceFile: string;
  totalDependencies: number;
  vulnerableDependencies: number;
  overallRiskScore: number;
  overallRiskCategory: RiskCategory;
  findings: RiskFinding[];
  /** true when OSV mock data was used instead of live API */
  usedMock: boolean;
};

export type UploadScanResponse = {
  accepted: true;
  fileName: string;
  ecosystem: Ecosystem;
  fileSize: number;
  hasLockfile: boolean;
  lockfileVersion?: number;
  warnings: string[];
  scan: ScanData;
  message: string;
};
