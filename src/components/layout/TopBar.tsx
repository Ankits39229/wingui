import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/searchStore";

export function TopBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="glass-panel sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-6">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps, publishers, tags... (Ctrl+K)"
          className="pl-9"
          aria-label="Search packages"
        />
      </div>
      <kbd className="hidden rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground md:inline">
        Ctrl+K
      </kbd>
    </header>
  );
}
