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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl space-y-6 overflow-y-auto h-full pb-8"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="glass-panel flex gap-6 rounded-2xl p-6">
        <AppIcon packageId={pkg.id} name={pkg.name} website={pkg.homepage} className="h-20 w-20" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{pkg.name}</h1>
          <p className="text-muted-foreground">{displayPublisher(pkg)}</p>
          {pkg.version && (
            <p className="mt-1 text-sm text-muted-foreground">Version {pkg.version}</p>
          )}
          <div className="mt-4 flex gap-2">
            <Button disabled={isInstalled} onClick={() => enqueue(pkg.id, pkg.name)}>
              <Download className="h-4 w-4" />
              {isInstalled ? "Installed" : "Install"}
            </Button>
            <Button variant="outline" onClick={() => toggleFavorite(pkg.id)}>
              <Heart className={isFavorite ? "fill-primary text-primary" : ""} />
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
        <section className="glass-panel rounded-xl p-6">
          <h2 className="mb-2 font-semibold">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
        </section>
      )}

      {pkg.tags && pkg.tags.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {pkg.tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="rounded-full bg-muted px-3 py-1 text-xs">
              {tag}
            </span>
          ))}
        </section>
      )}

      <section className="glass-panel rounded-xl p-6 opacity-60">
        <h2 className="mb-2 font-semibold">Ratings</h2>
        <p className="text-sm text-muted-foreground">Community ratings coming soon.</p>
      </section>
    </motion.div>
  );
}
