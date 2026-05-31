import { Heart, Download, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/apps/AppIcon";
import { HighlightText } from "@/components/common/HighlightText";
import { cn } from "@/utils/cn";
import { displayPublisher } from "@/utils/publisher";
import type { WingetPackage } from "@/types/package";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useInstallQueueStore } from "@/store/installQueueStore";
import { useSearchStore } from "@/store/searchStore";

interface AppCardProps {
  pkg: WingetPackage;
  installedIds?: Set<string>;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export function AppCard({
  pkg,
  installedIds,
  selectable,
  selected,
  onToggleSelect,
}: AppCardProps) {
  const navigate = useNavigate();
  const query = useSearchStore((s) => s.query);
  const isFavorite = useFavoritesStore((s) => s.ids.has(pkg.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const enqueue = useInstallQueueStore((s) => s.enqueue);
  const job = useInstallQueueStore((s) =>
    s.jobs.find((j) => j.packageId === pkg.id),
  );

  const installed = installedIds?.has(pkg.id) ?? pkg.installed;
  const isInstalling = job?.status === "running" || job?.status === "queued";

  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground/25",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="absolute right-3 top-3 h-4 w-4 rounded border-border accent-primary"
          aria-label={`Select ${pkg.name}`}
        />
      )}

      {/* Clickable content area */}
      <div
        role="link"
        tabIndex={0}
        onClick={() =>
          navigate(`/app/${encodeURIComponent(pkg.id)}`, { state: { pkg } })
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/app/${encodeURIComponent(pkg.id)}`, { state: { pkg } });
          }
        }}
        className="flex flex-1 cursor-pointer flex-col gap-3"
      >
        <div className="flex items-start gap-3">
          <AppIcon
            packageId={pkg.id}
            name={pkg.name}
            website={pkg.homepage}
            className="h-10 w-10 shrink-0 rounded-lg"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold tracking-tight">
              <HighlightText text={pkg.name} query={query} />
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              <HighlightText text={displayPublisher(pkg)} query={query} />
            </p>
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground min-h-[32px]">
          {pkg.description || "No description available."}
        </p>
      </div>

      {/* Action row */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
        <span
          className="truncate text-[10px] font-mono text-muted-foreground/50 max-w-[120px]"
          title={pkg.id}
        >
          {pkg.id}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            onClick={() => toggleFavorite(pkg.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground",
                isFavorite && "fill-destructive text-destructive",
              )}
            />
          </Button>
          <Button
            size="sm"
            variant={installed ? "secondary" : "default"}
            className="h-7 rounded-md px-2.5 text-xs"
            disabled={installed || isInstalling}
            onClick={() => enqueue(pkg.id, pkg.name)}
          >
            {isInstalling ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Installing…
              </>
            ) : installed ? (
              <>
                <Check className="h-3 w-3" />
                Installed
              </>
            ) : (
              <>
                <Download className="h-3 w-3" />
                Install
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
