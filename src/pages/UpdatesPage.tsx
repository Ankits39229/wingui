import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, Loader2 } from "lucide-react";
import { useUpgrades } from "@/hooks/usePackages";
import { AppListSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AppIcon } from "@/components/apps/AppIcon";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export function UpdatesPage() {
  const { data, isLoading, error, refetch } = useUpgrades();
  const queryClient = useQueryClient();
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [showUpdateAllConfirm, setShowUpdateAllConfirm] = useState(false);

  const upgradeOne = useMutation({
    mutationFn: (id: string) => {
      setUpgradingId(id);
      const pkgName = data?.find((p) => p.id === id)?.name || id;
      toast.info(`Updating ${pkgName}...`);
      return api.upgradePackage(id);
    },
    onSuccess: (_, id) => {
      setUpgradingId(null);
      const pkgName = data?.find((p) => p.id === id)?.name || id;
      toast.success(`${pkgName} updated successfully`);
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e) => {
      setUpgradingId(null);
      toast.error(String(e));
    },
  });

  const upgradeAll = useMutation({
    mutationFn: () => {
      toast.info("Updating all apps...");
      return api.upgradePackage();
    },
    onSuccess: () => {
      toast.success("All apps updated successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e) => toast.error(String(e)),
  });

  if (isLoading) return <AppListSkeleton />;
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
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-4">
      <PageHeader
        title="Updates"
        description={`${data.length} update${data.length === 1 ? "" : "s"} available`}
        action={
          <Button
            onClick={() => setShowUpdateAllConfirm(true)}
            disabled={upgradeAll.isPending}
          >
            <RefreshCw className="h-4 w-4" />
            Update all
          </Button>
        }
      />
      <div className="space-y-2">
        {data.map((pkg, index) => (
          <div
            key={`${pkg.id}-${pkg.version ?? "unknown"}-${index}`}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <AppIcon
              packageId={pkg.id}
              name={pkg.name}
              website={pkg.homepage}
              className="h-10 w-10 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold tracking-tight">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground">
                <span className="tabular-nums">{pkg.version}</span>
                <span className="mx-1.5 text-muted-foreground/40">→</span>
                <span className="font-medium text-foreground tabular-nums">
                  {pkg.availableVersion ?? "latest"}
                </span>
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 shrink-0"
              onClick={() => upgradeOne.mutate(pkg.id)}
              disabled={upgradingId === pkg.id}
            >
              {upgradingId === pkg.id ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={showUpdateAllConfirm}
        onOpenChange={setShowUpdateAllConfirm}
        title="Update all apps?"
        description={`This will update ${data.length} app${data.length === 1 ? "" : "s"} to their latest versions. This may take a while.`}
        confirmLabel="Update all"
        onConfirm={() => upgradeAll.mutate()}
        loading={upgradeAll.isPending}
      />
    </div>
  );
}
