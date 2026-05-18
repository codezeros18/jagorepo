import type { RiskCategory } from "@/types/scan";

export function getRiskLabel(category: RiskCategory): string {
  const labels: Record<RiskCategory, string> = {
    Low: "Rendah",
    Medium: "Sedang",
    High: "Tinggi",
    Critical: "Kritis",
  };
  return labels[category];
}

export function getRiskColor(category: RiskCategory): string {
  const colors: Record<RiskCategory, string> = {
    Low: "text-emerald-400",
    Medium: "text-amber-400",
    High: "text-orange-400",
    Critical: "text-red-400",
  };
  return colors[category];
}

export function getRiskBadgeClass(category: RiskCategory): string {
  const classes: Record<RiskCategory, string> = {
    Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return classes[category];
}

export function formatScore(score: number): string {
  return Math.min(100, Math.max(0, Math.round(score))).toString();
}

export function getRiskBarColor(category: RiskCategory): string {
  const colors: Record<RiskCategory, string> = {
    Low: "bg-emerald-500",
    Medium: "bg-amber-500",
    High: "bg-orange-500",
    Critical: "bg-red-500",
  };
  return colors[category];
}

export function getRiskScoreColor(category: RiskCategory): string {
  const colors: Record<RiskCategory, string> = {
    Low: "text-emerald-400",
    Medium: "text-amber-400",
    High: "text-orange-400",
    Critical: "text-red-400",
  };
  return colors[category];
}

export function getRiskBorderBg(category: RiskCategory): string {
  const classes: Record<RiskCategory, string> = {
    Low: "border-emerald-800/40 bg-emerald-500/5",
    Medium: "border-amber-800/40 bg-amber-500/5",
    High: "border-orange-800/40 bg-orange-500/5",
    Critical: "border-red-800/40 bg-red-500/5",
  };
  return classes[category];
}
