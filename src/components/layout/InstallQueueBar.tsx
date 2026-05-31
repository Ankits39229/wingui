import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useInstallQueueStore } from "@/store/installQueueStore";

export function InstallQueueBar() {
  const jobs = useInstallQueueStore((s) => s.jobs);
  const retry = useInstallQueueStore((s) => s.retry);

  if (jobs.length === 0) return null;

  const activeCount = jobs.filter(
    (j) => j.status === "running" || j.status === "queued",
  ).length;

  const completedCount = jobs.filter(
    (j) => j.status === "success" || j.status === "error",
  ).length;

  return (
    <div className="shrink-0 border-t border-border bg-card px-5 py-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Install queue
        </p>
        {activeCount > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {activeCount} active
          </span>
        )}
      </div>
      <div className="flex max-h-36 flex-col gap-2 overflow-y-auto">
        <AnimatePresence initial={false}>
          {jobs.map((job) => (
            <motion.div
              key={job.packageId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5"
            >
              {job.status === "running" && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              )}
              {job.status === "success" && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              )}
              {job.status === "error" && (
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              )}
              {job.status === "queued" && (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted-foreground/40" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{job.name}</p>
                {(job.status === "running" || job.status === "queued") && (
                  <Progress
                    value={job.progress}
                    className="mt-1.5 h-1 overflow-hidden [&>div]:bg-primary"
                  />
                )}
                {job.status === "error" && job.log && (
                  <p className="mt-0.5 truncate text-[10px] text-destructive/80">
                    {job.log}
                  </p>
                )}
              </div>
              {job.status === "error" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => retry(job.packageId)}
                  aria-label={`Retry ${job.name}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              {(job.status === "success" || job.status === "error") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() =>
                    useInstallQueueStore.setState((s) => ({
                      jobs: s.jobs.filter((j) => j.packageId !== job.packageId),
                    }))
                  }
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {completedCount > 0 && (
        <button
          type="button"
          onClick={() =>
            useInstallQueueStore.setState((s) => ({
              jobs: s.jobs.filter(
                (j) => j.status !== "success" && j.status !== "error",
              ),
            }))
          }
          className="mt-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear {completedCount} completed
        </button>
      )}
    </div>
  );
}
