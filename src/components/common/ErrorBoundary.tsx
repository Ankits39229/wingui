import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Something went wrong</h3>
            <p className="max-w-sm text-xs text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
