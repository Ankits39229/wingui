import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
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
    <header className="sticky top-0 z-10 flex h-[56px] shrink-0 items-center bg-background px-5">
      {/* Search bar */}
      <div
        className={cn(
          "relative flex flex-1 max-w-lg items-center rounded-xl border border-border bg-card transition-all duration-150",
          "shadow-sm hover:border-ring/60",
          "focus-within:border-ring focus-within:shadow-[0_0_0_3px_rgba(69,123,157,0.12)]",
        )}
      >
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps, publishers…"
          className={cn(
            "h-10 w-full bg-transparent pl-10 pr-24 text-sm text-foreground placeholder:text-muted-foreground",
            "outline-none font-[450]",
          )}
          aria-label="Search packages"
        />
        {/* Kbd hint / clear */}
        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="hidden items-center gap-1 sm:flex">
              <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Ctrl
              </kbd>
              <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                K
              </kbd>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
