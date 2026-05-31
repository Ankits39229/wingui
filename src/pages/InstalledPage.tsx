import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Trash2, ExternalLink } from "lucide-react";
import { useInstalledPackages } from "@/hooks/usePackages";
import { AppListSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AppIcon } from "@/components/apps/AppIcon";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { displayPublisher } from "@/utils/publisher";

export function InstalledPage() {
  const { data, isLoading, error, refetch } = useInstalledPackages();
  const queryClient = useQueryClient();
  const [uninstallTarget, setUninstallTarget] = useState<{
    id: string;
    name: string;
    source?: string;
  } | null>(null);

  const uninstall = useMutation({
    mutationFn: (pkg: { id: string; name: string; source?: string }) =>
      api.uninstallPackage({
        id: pkg.id,
        name: pkg.name,
        source: pkg.source,
      }),
    onSuccess: () => {
      toast.success("App uninstalled");
      queryClient.invalidateQueries({ queryKey: ["packages", "installed"] });
    },
    onError: (e) => toast.error(String(e)),
  });

  if (isLoading) return <AppListSkeleton wide />;
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />;
  if (!data?.length)
    return (
      <EmptyState
        icon={Download}
        title="No installed apps"
        description="Install apps from Discover to see them here."
      />
    );

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-4">
      <PageHeader
        title="Installed"
        description={`${data.length} app${data.length === 1 ? "" : "s"} on this device`}
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
                {pkg.version ?? "Unknown version"} · {displayPublisher(pkg)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {pkg.homepage && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(pkg.homepage, "_blank")}
                  aria-label="Open homepage"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="h-8"
                onClick={() =>
                  setUninstallTarget({
                    id: pkg.id,
                    name: pkg.name,
                    source: pkg.source,
                  })
                }
                disabled={uninstall.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Uninstall
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!uninstallTarget}
        onOpenChange={(open) => !open && setUninstallTarget(null)}
        title={`Uninstall ${uninstallTarget?.name}?`}
        description="This will remove the app from your system. You can always reinstall it later."
        confirmLabel="Uninstall"
        variant="destructive"
        onConfirm={() => {
          if (uninstallTarget) uninstall.mutate(uninstallTarget);
          setUninstallTarget(null);
        }}
      />
    </div>
  );
}
