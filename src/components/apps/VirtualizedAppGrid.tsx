import { useRef, useMemo } from "react";
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

const CARD_HEIGHT = 200; // estimated row height in px
const GAP = 16; // gap between rows


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

  // Calculate columns based on container width
  const columns = useMemo(() => {
    // Default to 3 columns, recalculate isn't needed for SSR
    // These match the Tailwind classes: sm:2, lg:3, xl:4
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w >= 1280) return 4; // xl
    if (w >= 1024) return 3; // lg
    if (w >= 640) return 2; // sm
    return 1;
  }, []);

  const rows = useMemo(() => {
    const result: WingetPackage[][] = [];
    for (let i = 0; i < packages.length; i += columns) {
      result.push(packages.slice(i, i + columns));
    }
    return result;
  }, [packages, columns]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
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
    <div ref={parentRef} className="h-full overflow-y-auto pr-1 pb-8">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size - GAP}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {row.map((pkg) => (
                  <AppCard
                    key={pkg.id}
                    pkg={pkg}
                    installedIds={installedIds}
                    selectable={selectable}
                    selected={selectedIds?.has(pkg.id)}
                    onToggleSelect={() => onToggleSelect?.(pkg.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
