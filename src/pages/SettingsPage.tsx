import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Moon, Sun, Monitor, Trash2, Download, Upload, Package } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SettingRow } from "@/components/settings/SettingRow";
import { useSettingsStore, type Theme } from "@/store/settingsStore";
import { api } from "@/services/api";

export function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const autoUpdateCheck = useSettingsStore((s) => s.autoUpdateCheck);
  const setAutoUpdateCheck = useSettingsStore((s) => s.setAutoUpdateCheck);
  const concurrentDownloads = useSettingsStore((s) => s.concurrentDownloads);
  const setConcurrentDownloads = useSettingsStore((s) => s.setConcurrentDownloads);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const clearCache = useMutation({
    mutationFn: async () => {
      await api.clearPackageCache();
      await api.clearIconCache();
    },
    onSuccess: () => toast.success("Cache cleared"),
    onError: (e) => toast.error(String(e)),
  });

  const exportPkgs = useMutation({
    mutationFn: () => api.exportInstalled(),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wingui-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Exported installed packages");
    },
  });

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="mx-auto h-full max-w-2xl space-y-8 overflow-y-auto pb-8">
      <PageHeader
        title="Settings"
        description="Customize appearance, updates, and data preferences."
      />

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-tight">Appearance</h2>
        <p className="text-xs text-muted-foreground">
          Choose how WingUI looks on your system.
        </p>
        <div className="flex gap-2 pt-1">
          {themes.map(({ value, icon: Icon, label }) => (
            <Button
              key={value}
              variant={theme === value ? "default" : "outline"}
              onClick={() => setTheme(value)}
              className="flex-1"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-tight">Updates</h2>
        <SettingRow
          label="Auto-check for updates"
          description="Check for app updates when WingUI launches."
        >
          <Switch checked={autoUpdateCheck} onCheckedChange={setAutoUpdateCheck} />
        </SettingRow>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-tight">Downloads</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Concurrent downloads</p>
            <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium tabular-nums">
              {concurrentDownloads}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={concurrentDownloads}
            onChange={(e) => setConcurrentDownloads(parseInt(e.target.value, 10))}
            className="w-full"
            aria-label="Concurrent downloads"
          />
          <p className="text-xs text-muted-foreground">
            Higher values install faster but use more bandwidth.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-tight">Data</h2>
        <p className="text-xs text-muted-foreground">
          Export, import, or clear cached package and icon data.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" onClick={() => exportPkgs.mutate()}>
            <Upload className="h-4 w-4" />
            Export installed
          </Button>
          <Button
            variant="outline"
            disabled
          >
            <Download className="h-4 w-4" />
            Import (Coming soon)
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowClearConfirm(true)}
            disabled={clearCache.isPending}
          >
            <Trash2 className="h-4 w-4" />
            Clear cache
          </Button>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-tight">About</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Package className="h-7 w-7" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">WingUI</p>
            <p className="text-xs text-muted-foreground">Version 0.1.0</p>
            <p className="text-xs text-muted-foreground">
              Modern GUI for Windows Package Manager
            </p>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear all cache?"
        description="This will remove all cached package data and icons. They will be re-downloaded when needed."
        confirmLabel="Clear cache"
        variant="destructive"
        onConfirm={() => clearCache.mutate()}
        loading={clearCache.isPending}
      />
    </div>
  );
}
