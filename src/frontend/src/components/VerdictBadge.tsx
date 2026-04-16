import { cn } from "@/lib/utils";
import type React from "react";
import type { Verdict } from "../types";

interface VerdictBadgeProps {
  verdict: Verdict;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const verdictConfig: Record<
  Verdict,
  { label: string; className: string; style: React.CSSProperties }
> = {
  genuine: {
    label: "GENUINE",
    className: "text-chart-4",
    style: {
      background: "oklch(var(--chart-4) / 0.12)",
      border: "1px solid oklch(var(--chart-4) / 0.35)",
    },
  },
  suspicious: {
    label: "SUSPICIOUS",
    className: "text-chart-2",
    style: {
      background: "oklch(var(--chart-2) / 0.12)",
      border: "1px solid oklch(var(--chart-2) / 0.35)",
    },
  },
  fake: {
    label: "HIGHLY LIKELY FAKE",
    className: "text-chart-3",
    style: {
      background: "oklch(var(--chart-3) / 0.12)",
      border: "1px solid oklch(var(--chart-3) / 0.35)",
    },
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

export function VerdictBadge({
  verdict,
  className,
  size = "md",
}: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-semibold tracking-widest rounded-sm uppercase",
        config.className,
        sizeClasses[size],
        className,
      )}
      style={config.style}
    >
      {config.label}
    </span>
  );
}
