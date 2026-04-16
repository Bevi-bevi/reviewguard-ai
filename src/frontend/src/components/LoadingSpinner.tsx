import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function LoadingSpinner({
  className,
  size = 20,
  label = "Loading…",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-muted-foreground",
        className,
      )}
      aria-live="polite"
    >
      <Loader2 size={size} className="animate-spin text-primary" />
      {label && <span className="text-sm font-body">{label}</span>}
    </div>
  );
}
