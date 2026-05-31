import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { api } from "@/services/api";
import { cn } from "@/utils/cn";

interface AppIconProps {
  packageId: string;
  name: string;
  website?: string;
  className?: string;
}

export function AppIcon({ packageId, name, website, className }: AppIconProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = await api.getIconPath(packageId);
        if (cached && !cancelled) {
          setSrc(convertFileSrc(cached));
          return;
        }
        const fetched = await api.fetchPackageIcon(packageId, website);
        if (fetched && !cancelled) setSrc(convertFileSrc(fetched));
      } catch {
        /* ignore icon errors */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [packageId, website]);

  if (error || !src) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted",
          className,
        )}
      >
        {!src && !error && (
          <div className="absolute inset-0 skeleton-shimmer rounded-xl" />
        )}
        <Package className="h-1/2 w-1/2 text-muted-foreground" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted",
        className,
      )}
    >
      {!loaded && (
        <div className="absolute inset-0 skeleton-shimmer rounded-xl" />
      )}
      <img
        src={src}
        alt={`${name} icon`}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
