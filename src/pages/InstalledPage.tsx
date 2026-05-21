import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Download, Trash2, ExternalLink } from "lucide-react";
import { useInstalledPackages } from "@/hooks/usePackages";
import { AppGridSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
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
        description="Install apps from Discover to see them here."
      />
    );

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      <PageHeader
        title="Installed"
        description={`${data.length} app${data.length === 1 ? "" : "s"} on this device`}
      />
      <div className="space-y-2">
        {data.map((pkg, index) => (
          <motion.div
            key={`${pkg.id}-${pkg.version ?? "unknown"}-${index}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
            className="glass-panel flex items-center gap-4 rounded-2xl p-4 transition-shadow hover:shadow-[var(--shadow-card)]"
          >
            <AppIcon
              packageId={pkg.id}
              name={pkg.name}
              website={pkg.homepage}
              className="h-12 w-12 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold tracking-tight">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground">
                {pkg.version ?? "Unknown version"} · {displayPublisher(pkg)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
