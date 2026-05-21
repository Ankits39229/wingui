import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useUpgrades } from "@/hooks/usePackages";
import { AppGridSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export function UpdatesPage() {
  const { data, isLoading, error, refetch } = useUpgrades();
  const queryClient = useQueryClient();

  const upgradeOne = useMutation({
    mutationFn: (id: string) => api.upgradePackage(id),
    onSuccess: () => {
      toast.success("Update started");
      queryClient.invalidateQueries({ queryKey: ["packages", "upgrades"] });
    },
    onError: (e) => toast.error(String(e)),
  });

  const upgradeAll = useMutation({
    mutationFn: () => api.upgradePackage(),
    onSuccess: () => {
      toast.success("Updating all apps");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e) => toast.error(String(e)),
  });

  if (isLoading) return <AppGridSkeleton />;
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />;
  if (!data?.length)
    return (
      <EmptyState
        icon={RefreshCw}
        title="Everything is up to date"
        description="No updates available for your installed apps."
      />
    );

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      <PageHeader
        title="Updates"
        description={`${data.length} update${data.length === 1 ? "" : "s"} available`}
        action={
          <Button onClick={() => upgradeAll.mutate()} disabled={upgradeAll.isPending}>
            <RefreshCw className="h-4 w-4" />
            Update all
          </Button>
        }
      />
      <div className="space-y-2">
        {data.map((pkg, index) => (
          <motion.div
            key={`${pkg.id}-${pkg.version ?? "unknown"}-${index}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
            className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-4"
          >
            <div className="min-w-0">
              <h3 className="font-semibold tracking-tight">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground">
                <span className="tabular-nums">{pkg.version}</span>
                <span className="mx-1.5 text-border">→</span>
                <span className="font-medium text-foreground tabular-nums">
                  {pkg.availableVersion ?? "latest"}
                </span>
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => upgradeOne.mutate(pkg.id)}
              disabled={upgradeOne.isPending}
            >
              Update
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
