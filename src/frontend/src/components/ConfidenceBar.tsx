import { cn } from "@/lib/utils";
import type { Verdict } from "../types";

interface ConfidenceBarProps {
  score: number;
  verdict: Verdict;
  showLabel?: boolean;
  className?: string;
}

const barColorClass: Record<Verdict, string> = {
  genuine: "bg-chart-4",
  suspicious: "bg-chart-2",
  fake: "bg-chart-3",
};

export function ConfidenceBar({
  score,
  verdict,
  showLabel = true,
  className,
}: ConfidenceBarProps) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLabel && (
        <span className="text-muted-foreground text-xs whitespace-nowrap font-mono">
          Confidence
        </span>
      )}
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            barColorClass[verdict],
          )}
          style={{ width: `${clamped}%` }}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-xs font-semibold text-foreground tabular-nums w-8 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
