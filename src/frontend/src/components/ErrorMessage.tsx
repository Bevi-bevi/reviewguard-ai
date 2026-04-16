import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive-foreground",
        className,
      )}
      role="alert"
      data-ocid="error_state"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-destructive" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
