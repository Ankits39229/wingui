import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5">
        <AlertCircle className="h-8 w-8 text-destructive/70" strokeWidth={1.5} />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">Something went wrong</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
      </div>

      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
