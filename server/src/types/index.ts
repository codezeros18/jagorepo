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

export type ApiError = {
  error: string;
  details?: string;
};
