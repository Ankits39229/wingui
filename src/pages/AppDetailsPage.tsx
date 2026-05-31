import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Heart,
  ExternalLink,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  usePackageDetails,
  useInstalledPackages,
  useUpgrades,
} from "@/hooks/usePackages";
import { AppIcon } from "@/components/apps/AppIcon";
import { Button } from "@/components/ui/button";
import { AppDetailSkeleton } from "@/components/common/AppDetailSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useInstallQueueStore } from "@/store/installQueueStore";
import { api } from "@/services/api";
import type { WingetPackage } from "@/types/package";
import { displayPublisher } from "@/utils/publisher";
import { cn } from "@/utils/cn";

export function AppDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const packageId = decodeURIComponent(id ?? "");
  const catalogPkg = (location.state as { pkg?: WingetPackage } | null)?.pkg;
  const { data: fetchedPkg, isLoading, error, refetch } = usePackageDetails(packageId);
  const pkg = fetchedPkg ?? (catalogPkg?.id === packageId ? catalogPkg : undefined);
  const { data: installed } = useInstalledPackages();
  const { data: upgrades } = useUpgrades();
  const isFavorite = useFavoritesStore((s) => s.ids.has(packageId));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const enqueue = useInstallQueueStore((s) => s.enqueue);

  const queryClient = useQueryClient();
  const [showUninstallConfirm, setShowUninstallConfirm] = useState(false);

  const isInstalled = installed?.some((p) => p.id === packageId);
  const hasUpdate = upgrades?.some((p) => p.id === packageId);

  const uninstall = useMutation({
    mutationFn: () =>
      api.uninstallPackage({
        id: packageId,
        name: pkg?.name,
      }),
    onSuccess: () => {
      toast.success(`${pkg?.name || "App"} uninstalled successfully`);
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e) => toast.error(String(e)),
  });

  const upgrade = useMutation({
    mutationFn: () => api.upgradePackage(packageId),
    onSuccess: () => {
      toast.success(`${pkg?.name || "App"} updated successfully`);
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e) => toast.error(String(e)),
  });

  if (isLoading && !pkg) return <AppDetailSkeleton />;
  if (!pkg && (error || !isLoading)) {
    return (
      <ErrorState
        message={String(error ?? "Package not found")}
        onRetry={() => refetch()}
      />
    );
  }
  if (!pkg) return <AppDetailSkeleton />;

  return (
    <div className="mx-auto h-full max-w-3xl space-y-6 overflow-y-auto pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <AppIcon
          packageId={pkg.id}
          name={pkg.name}
          website={pkg.homepage}
          className="h-20 w-20 rounded-2xl"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{pkg.name}</h1>
          <p className="mt-1 text-muted-foreground">{displayPublisher(pkg)}</p>
          {pkg.version && (
            <p className="mt-1 text-sm tabular-nums text-muted-foreground">
              Version {pkg.version}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {!isInstalled ? (
              <Button onClick={() => enqueue(pkg.id, pkg.name)}>
                <Download className="h-4 w-4" />
                Install
              </Button>
            ) : (
              <>
                <Button variant="secondary" disabled>
                  Installed
                </Button>
                {hasUpdate && (
                  <Button
                    onClick={() => upgrade.mutate()}
                    disabled={upgrade.isPending}
                  >
                    {upgrade.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Update
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => setShowUninstallConfirm(true)}
                  disabled={uninstall.isPending}
                >
                  {uninstall.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uninstalling…
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Uninstall
                    </>
                  )}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => toggleFavorite(pkg.id)}>
              <Heart
                className={cn("h-4 w-4", isFavorite && "fill-primary text-primary")}
              />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>
            {pkg.homepage && (
              <Button variant="outline" onClick={() => window.open(pkg.homepage, "_blank")}>
                <ExternalLink className="h-4 w-4" />
                Website
              </Button>
            )}
          </div>
        </div>
      </div>

      {pkg.description && (
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 text-sm font-semibold tracking-tight">Description</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
        </section>
      )}

      {pkg.tags && pkg.tags.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-tight">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {pkg.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={showUninstallConfirm}
        onOpenChange={setShowUninstallConfirm}
        title={`Uninstall ${pkg.name}?`}
        description="This will remove the app from your system. You can always reinstall it later."
        confirmLabel="Uninstall"
        variant="destructive"
        onConfirm={() => {
          uninstall.mutate();
          setShowUninstallConfirm(false);
        }}
      />
    </div>
  );
}
