import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Heart, ExternalLink } from "lucide-react";
import { usePackageDetails, useInstalledPackages } from "@/hooks/usePackages";
import { AppIcon } from "@/components/apps/AppIcon";
import { Button } from "@/components/ui/button";
import { AppGridSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useInstallQueueStore } from "@/store/installQueueStore";
import type { WingetPackage } from "@/types/package";
import { displayPublisher } from "@/utils/publisher";
import { cn } from "@/utils/cn";

export function AppDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const packageId = decodeURIComponent(id ?? "");
  const catalogPkg = (location.state as { pkg?: WingetPackage } | null)?.pkg;
  const { data: fetchedPkg, isLoading, error, refetch } = usePackageDetails(packageId);
  const pkg = fetchedPkg ?? (catalogPkg?.id === packageId ? catalogPkg : undefined);
  const { data: installed } = useInstalledPackages();
  const isFavorite = useFavoritesStore((s) => s.isFavorite(packageId));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const enqueue = useInstallQueueStore((s) => s.enqueue);

  const isInstalled = installed?.some((p) => p.id === packageId);

  if (isLoading && !pkg) return <AppGridSkeleton />;
  if (!pkg && (error || !isLoading)) {
    return (
      <ErrorState
        message={String(error ?? "Package not found")}
        onRetry={() => refetch()}
      />
    );
  }
  if (!pkg) return <AppGridSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto h-full max-w-3xl space-y-6 overflow-y-auto pb-8"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </Link>

      <div className="glass-panel flex gap-6 rounded-2xl p-6 shadow-[var(--shadow-card)]">
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
            <Button disabled={isInstalled} onClick={() => enqueue(pkg.id, pkg.name)}>
              <Download className="h-4 w-4" />
              {isInstalled ? "Installed" : "Install"}
            </Button>
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
        <section className="glass-panel rounded-2xl p-6">
          <h2 className="mb-3 text-sm font-semibold tracking-tight">Description</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
        </section>
      )}

      {pkg.tags && pkg.tags.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {pkg.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </section>
      )}
    </motion.div>
  );
}
