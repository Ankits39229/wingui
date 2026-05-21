import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useUpgrades } from "@/hooks/usePackages";
import { AppGridSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
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
    <div className="space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Updates</h1>
          <p className="text-sm text-muted-foreground">{data.length} updates available</p>
        </div>
        <Button onClick={() => upgradeAll.mutate()} disabled={upgradeAll.isPending}>
          <RefreshCw className="h-4 w-4" />
          Update all
        </Button>
      </div>
      <div className="space-y-2">
        {data.map((pkg, index) => (
          <div key={`${pkg.id}-${pkg.version ?? "unknown"}-${index}`} className="glass-panel flex items-center justify-between rounded-xl p-4">
            <div>
              <h3 className="font-semibold">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground">
                {pkg.version} → {pkg.availableVersion ?? "latest"}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => upgradeOne.mutate(pkg.id)}
              disabled={upgradeOne.isPending}
            >
              Update
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
