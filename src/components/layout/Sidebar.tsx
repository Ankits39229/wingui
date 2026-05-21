import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
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
  return (
    <aside
      className={cn(
        "glass-panel relative z-20 flex h-full flex-col border-r transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        collapsed ? "w-[72px]" : "w-56",
      )}
    >
      <div className="flex h-14 items-center gap-3 border-b border-border/80 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          W
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <span className="block truncate font-semibold tracking-tight">WingUI</span>
            <span className="block truncate text-[10px] text-muted-foreground">
              Package Manager
            </span>
          </motion.div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Main navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="relative z-10 truncate">{label}</span>}
                </>
              )}
            </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggle}
        className="m-2 flex items-center justify-center gap-2 rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        {!collapsed && <span className="text-xs font-medium">Collapse</span>}
      </button>
    </aside>
  );
}
