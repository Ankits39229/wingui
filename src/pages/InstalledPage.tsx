import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Trash2, ExternalLink } from "lucide-react";
import { useInstalledPackages } from "@/hooks/usePackages";
import { AppGridSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { AppIcon } from "@/components/apps/AppIcon";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { displayPublisher } from "@/utils/publisher";

export function InstalledPage() {
  const { data, isLoading, error, refetch } = useInstalledPackages();
  const queryClient = useQueryClient();

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

  if (isLoading) return <AppGridSkeleton />;
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />;
  if (!data?.length)
    return (
      <EmptyState
        icon={Download}
        title="No installed apps"
        description="Install apps from Home to see them here."
      />
    );

  return (
    <div className="space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold">Installed</h1>
        <p className="text-sm text-muted-foreground">{data.length} apps installed</p>
      </div>
      <div className="space-y-2">
        {data.map((pkg, index) => (
          <div
            key={`${pkg.id}-${pkg.version ?? "unknown"}-${index}`}
            className="glass-panel flex items-center gap-4 rounded-xl p-4"
          >
            <AppIcon packageId={pkg.id} name={pkg.name} website={pkg.homepage} className="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground">
                {pkg.version ?? "Unknown version"} · {displayPublisher(pkg)}
              </p>
            </div>
            <div className="flex gap-2">
              {pkg.homepage && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(pkg.homepage, "_blank")}
                  aria-label="Open homepage"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  uninstall.mutate({
                    id: pkg.id,
                    name: pkg.name,
                    source: pkg.source,
                  })
                }
                disabled={uninstall.isPending}
              >
                <Trash2 className="h-4 w-4" />
                Uninstall
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
