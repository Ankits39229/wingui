import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useInstallQueueStore } from "@/store/installQueueStore";

export function InstallQueueBar() {
  const jobs = useInstallQueueStore((s) => s.jobs);

  if (jobs.length === 0) return null;

  return (
    <div className="glass-panel border-t px-4 py-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">Install queue</p>
      <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
        <AnimatePresence>
          {jobs.map((job) => (
            <motion.div
              key={job.packageId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
            >
              {job.status === "running" && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {job.status === "success" && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {job.status === "error" && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {job.status === "queued" && (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{job.name}</p>
                <Progress value={job.progress} className="mt-1 h-1" />
              </div>
              {(job.status === "success" || job.status === "error") && (
                <button
                  onClick={() =>
                    useInstallQueueStore.setState((s) => ({
                      jobs: s.jobs.filter((j) => j.packageId !== job.packageId),
                    }))
                  }
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
