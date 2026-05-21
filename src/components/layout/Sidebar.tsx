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
        "glass-panel flex h-full flex-col border-r transition-all duration-300",
        collapsed ? "w-[72px]" : "w-56",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          W
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold tracking-tight"
          >
            WingUI
          </motion.span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggle}
        className="m-2 flex items-center justify-center gap-2 rounded-lg p-2 text-muted-foreground hover:bg-accent"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        {!collapsed && <span className="text-xs">Collapse</span>}
      </button>
    </aside>
  );
}
