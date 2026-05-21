import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SearchX } from "lucide-react";
import { AppCard } from "@/components/apps/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { WingetPackage } from "@/types/package";

interface VirtualizedAppGridProps {
  packages: WingetPackage[];
  installedIds?: Set<string>;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const COLS = 4;
const ROW_HEIGHT = 228;
const GAP = 16;

export function VirtualizedAppGrid({
  packages,
  installedIds,
  selectable,
  selectedIds,
  onToggleSelect,
  emptyTitle = "No results found",
  emptyDescription = "Try a different search term or browse all packages.",
}: VirtualizedAppGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = Math.ceil(packages.length / COLS);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + GAP,
    overscan: 3,
  });

  if (packages.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div ref={parentRef} className="h-full overflow-auto pr-1">
      <div
        style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * COLS;
          const rowPackages = packages.slice(start, start + COLS);
          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 top-0 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowPackages.map((pkg, index) => (
                <AppCard
                  key={`${pkg.id}-${pkg.version ?? "unknown"}-${start + index}`}
                  pkg={pkg}
                  installedIds={installedIds}
                  selectable={selectable}
                  selected={selectedIds?.has(pkg.id)}
                  onToggleSelect={() => onToggleSelect?.(pkg.id)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
