import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type {
  ExportData,
  FavoriteEntry,
  InstallProgress,
  PackageMetadata,
  WingetPackage,
} from "@/types/package";

export const api = {
  searchPackages: (query?: string) =>
    invoke<WingetPackage[]>("search_packages", { query }),

  listInstalled: () => invoke<WingetPackage[]>("list_installed"),

  listUpgrades: () => invoke<WingetPackage[]>("list_upgrades"),

  showPackage: (id: string) => invoke<WingetPackage>("show_package", { id }),

  installPackage: (id: string) => invoke<void>("install_package", { id }),

  uninstallPackage: (params: {
    id: string;
    name?: string;
    source?: string;
  }) => invoke<string>("uninstall_package", params),

  upgradePackage: (id?: string) =>
    invoke<string>("upgrade_package", { id }),

  refreshCatalog: () => invoke<WingetPackage[]>("refresh_catalog"),

  getFavorites: () => invoke<FavoriteEntry[]>("get_favorites"),

  addFavorite: (packageId: string) =>
    invoke<void>("add_favorite", { packageId }),

  removeFavorite: (packageId: string) =>
    invoke<void>("remove_favorite", { packageId }),

  getCachedPackages: (limit?: number) =>
    invoke<PackageMetadata[]>("get_cached_packages", { limit }),

  clearPackageCache: () => invoke<void>("clear_package_cache"),

  getSetting: (key: string) =>
    invoke<string | null>("get_setting", { key }),

  setSetting: (key: string, value: string) =>
    invoke<void>("set_setting", { key, value }),

  getRecentlyInstalled: (limit?: number) =>
    invoke<string[]>("get_recently_installed", { limit }),

  fetchPackageIcon: (packageId: string, website?: string) =>
    invoke<string | null>("fetch_package_icon", { packageId, website }),

  getIconPath: (packageId: string) =>
    invoke<string | null>("get_icon_path", { packageId }),

  clearIconCache: () => invoke<void>("clear_icon_cache_cmd"),

  exportInstalled: () => invoke<ExportData>("export_installed_packages"),

  importPackages: (ids: string[]) =>
    invoke<string[]>("import_packages", { ids }),

  onInstallProgress: (handler: (progress: InstallProgress) => void) =>
    listen<InstallProgress>("install-progress", (event) =>
      handler(event.payload),
    ),
};
