import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useCatalogRefresh, useInstalledPackages } from "@/hooks/usePackages";
import { VirtualizedAppGrid } from "@/components/apps/VirtualizedAppGrid";
import { AppGridSkeleton, PageHeaderSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { useSearchStore } from "@/store/searchStore";
import type { WingetPackage } from "@/types/package";

function filterPackages(packages: WingetPackage[], query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return packages;
  return packages.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.publisher?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q)),
  );
}

export function HomePage() {
  const query = useSearchStore((s) => s.query);
  const { data: catalog, isLoading, error, refetch } = useCatalogRefresh();
  const { data: installed } = useInstalledPackages();

  const installedIds = useMemo(
    () => new Set(installed?.map((p) => p.id) ?? []),
    [installed],
  );

  const filtered = useMemo(
    () => filterPackages(catalog ?? [], query),
    [catalog, query],
  );

  if (isLoading) {
    return (
      <div>
        <PageHeaderSkeleton />
        <AppGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={String(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex h-full flex-col gap-8 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to WingUI</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and install apps from winget — no terminal required.
          {isLoading && " Loading catalog from winget (first launch may take a minute)…"}
        </p>
      </motion.div>

      {!query && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">All packages</h2>
            <span className="text-sm text-muted-foreground">
              ({filtered.length} apps)
            </span>
          </div>
        </section>
      )}

      <div className="min-h-0 flex-1">
        <VirtualizedAppGrid packages={filtered} installedIds={installedIds} />
      </div>
    </div>
  );
}
