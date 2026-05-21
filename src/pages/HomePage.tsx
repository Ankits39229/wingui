import { useMemo } from "react";
import { Package } from "lucide-react";
import { useCatalogRefresh, useInstalledPackages } from "@/hooks/usePackages";
import { VirtualizedAppGrid } from "@/components/apps/VirtualizedAppGrid";
import { AppGridSkeleton, PageHeaderSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
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
      <div className="flex h-full flex-col gap-6">
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
    <div className="flex h-full flex-col gap-6 overflow-hidden">
      <PageHeader
        title={query ? "Search results" : "Discover apps"}
        description={
          query
            ? `${filtered.length} result${filtered.length === 1 ? "" : "s"} for “${query}”`
            : "Browse and install apps from winget — no terminal required."
        }
      />

      {!query && (
        <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4 text-primary" />
          <span>
            <span className="font-medium text-foreground">{filtered.length}</span> packages
            available
          </span>
        </div>
      )}

      <div className="min-h-0 flex-1">
        <VirtualizedAppGrid
          packages={filtered}
          installedIds={installedIds}
          emptyTitle={query ? "No matching apps" : "No packages found"}
          emptyDescription={
            query
              ? "Try different keywords, publisher names, or tags."
              : "The catalog appears empty. Check your winget connection and try again."
          }
        />
      </div>
    </div>
  );
}
