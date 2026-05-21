import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/utils/cn";

export function TopBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setQuery]);

  return (
    <header className="glass-panel sticky top-0 z-10 flex h-[60px] shrink-0 items-center gap-4 border-b px-6">
      <div className="search-spotlight relative flex-1 max-w-xl rounded-xl">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps, publishers, tags…"
          className="h-11 border-0 bg-transparent pl-10 pr-24 shadow-none focus-visible:ring-0"
          aria-label="Search packages"
        />
        <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <kbd
            className={cn(
              "hidden rounded-md border border-border bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline",
            )}
          >
            Ctrl
          </kbd>
          <kbd
            className={cn(
              "hidden rounded-md border border-border bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline",
            )}
          >
            K
          </kbd>
        </div>
      </div>
    </header>
  );
}
