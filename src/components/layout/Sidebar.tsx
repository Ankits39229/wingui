import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Download,
  RefreshCw,
  Heart,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useSettingsStore } from "@/store/settingsStore";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/installed", icon: Download, label: "Installed" },
  { to: "/updates", icon: RefreshCw, label: "Updates" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const collapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const toggle = useSettingsStore((s) => s.toggleSidebar);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-[64px]" : "w-56",
      )}
    >
      {/* Brand header */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center px-0" : "gap-3 px-4",
        )}
      >
        <img
          src="/brand-mark.png"
          alt="WingUI"
          className="h-8 w-8 shrink-0 rounded-lg object-cover"
        />
        {!collapsed && (
          <div className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
              WingUI
            </span>
            <span className="block truncate text-[10px] text-sidebar-muted">
              Package Manager
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Main navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex w-full items-center rounded-lg py-2 text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <p className="px-4 pb-1 text-[10px] text-sidebar-muted/50">
          v0.1.0
        </p>
      )}

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "m-2 flex items-center rounded-lg p-2 text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed ? "justify-center" : "gap-2",
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand (Ctrl+B)" : "Collapse (Ctrl+B)"}
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        {!collapsed && <span className="text-xs font-medium">Collapse</span>}
      </button>
    </aside>
  );
}
