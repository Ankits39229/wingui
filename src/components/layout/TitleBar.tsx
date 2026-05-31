import { useEffect, useState } from "react";
import { Minus, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const win = getCurrentWindow();
    win.isMaximized().then(setIsMaximized);
    let cleanup: (() => void) | undefined;
    win.onResized(async () => {
      setIsMaximized(await win.isMaximized());
    }).then((fn) => { cleanup = fn; });
    return () => cleanup?.();
  }, []);

  const minimize = () => getCurrentWindow().minimize();
  const maximize = () => getCurrentWindow().toggleMaximize();
  const close = () => getCurrentWindow().close();

  return (
    <div
      className="flex h-8 w-full shrink-0 select-none items-center bg-sidebar border-b border-border"
      data-tauri-drag-region
    >
      {/* Drag region fills all space to the left of the controls */}
      <div className="flex-1" data-tauri-drag-region />

      {/* Window controls — Windows standard order */}
      <div className="flex h-full shrink-0">
        <button
          onClick={minimize}
          tabIndex={-1}
          aria-label="Minimize"
          className="flex h-full w-11 items-center justify-center text-sidebar-muted transition-colors duration-100 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={maximize}
          tabIndex={-1}
          aria-label={isMaximized ? "Restore" : "Maximize"}
          className="flex h-full w-11 items-center justify-center text-sidebar-muted transition-colors duration-100 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isMaximized ? (
            /* Restore: two overlapping squares */
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 1h6v6M1 3.5h6v6H1z" />
            </svg>
          ) : (
            /* Maximize: single square */
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="0.5" y="0.5" width="10" height="10" />
            </svg>
          )}
        </button>

        <button
          onClick={close}
          tabIndex={-1}
          aria-label="Close"
          className="flex h-full w-11 items-center justify-center text-sidebar-muted transition-colors duration-100 hover:bg-red-500 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
