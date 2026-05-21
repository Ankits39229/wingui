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

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted",
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <Package className="h-1/2 w-1/2 text-muted-foreground" />
      )}
    </div>
  );
}
