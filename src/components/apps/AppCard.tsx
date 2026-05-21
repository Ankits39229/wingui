import { motion } from "framer-motion";
import { Heart, Download, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/apps/AppIcon";
import { cn } from "@/utils/cn";
import { displayPublisher } from "@/utils/publisher";
import type { WingetPackage } from "@/types/package";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useInstallQueueStore } from "@/store/installQueueStore";

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
  const isFavorite = useFavoritesStore((s) => s.isFavorite(pkg.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const enqueue = useInstallQueueStore((s) => s.enqueue);
  const job = useInstallQueueStore((s) =>
    s.jobs.find((j) => j.packageId === pkg.id),
  );

  const installed = installedIds?.has(pkg.id) ?? pkg.installed;
  const isInstalling = job?.status === "running" || job?.status === "queued";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        selected && "ring-2 ring-primary",
      )}
    >
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="absolute right-3 top-3 h-4 w-4 rounded border-border"
          aria-label={`Select ${pkg.name}`}
        />
      )}

      <Link
        to={`/app/${encodeURIComponent(pkg.id)}`}
        state={{ pkg }}
        className="flex flex-1 flex-col gap-3"
      >
        <div className="flex items-start gap-3">
          <AppIcon
            packageId={pkg.id}
            name={pkg.name}
            website={pkg.homepage}
            className="h-12 w-12"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold leading-tight">{pkg.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {displayPublisher(pkg)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(pkg.id);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn("h-4 w-4", isFavorite && "fill-primary text-primary")}
            />
          </Button>
        </div>

        {pkg.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{pkg.description}</p>
        )}
      </Link>

      <Button
        size="sm"
        variant={installed ? "secondary" : "default"}
        className="mt-3 w-full"
        disabled={installed || isInstalling}
        onClick={() => enqueue(pkg.id, pkg.name)}
      >
        {isInstalling ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Installing...
          </>
        ) : installed ? (
          <>
            <Check className="h-4 w-4" />
            Installed
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Install
          </>
        )}
      </Button>
    </motion.article>
  );
}
