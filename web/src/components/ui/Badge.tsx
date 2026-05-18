import type { RiskCategory } from "@/types/scan";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | RiskCategory;

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-300",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  danger: "bg-red-500/15 text-red-400",
  info: "bg-zinc-700 text-zinc-300",
  Low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  High: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Critical: "bg-red-500/10 text-red-400 border border-red-500/20",
};

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({ children, variant = "default", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
