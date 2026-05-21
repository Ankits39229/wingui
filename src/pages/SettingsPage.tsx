import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Moon, Sun, Monitor, Trash2, Download, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettingsStore, type Theme } from "@/store/settingsStore";
import { api } from "@/services/api";

export function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const autoUpdateCheck = useSettingsStore((s) => s.autoUpdateCheck);
  const setAutoUpdateCheck = useSettingsStore((s) => s.setAutoUpdateCheck);
  const concurrentDownloads = useSettingsStore((s) => s.concurrentDownloads);
  const setConcurrentDownloads = useSettingsStore((s) => s.setConcurrentDownloads);

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
    <div className="mx-auto max-w-2xl space-y-8 overflow-y-auto h-full pb-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize WingUI to your preferences</p>
      </div>

      <section className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Appearance</h2>
        <div className="flex gap-2">
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

      <section className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Updates</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Auto-check for updates</p>
            <p className="text-xs text-muted-foreground">Check for app updates on launch</p>
          </div>
          <Switch checked={autoUpdateCheck} onCheckedChange={setAutoUpdateCheck} />
        </div>
      </section>

      <section className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Downloads</h2>
        <div>
          <label className="text-sm font-medium">Concurrent downloads: {concurrentDownloads}</label>
          <input
            type="range"
            min={1}
            max={5}
            value={concurrentDownloads}
            onChange={(e) => setConcurrentDownloads(parseInt(e.target.value, 10))}
            className="mt-2 w-full"
          />
        </div>
      </section>

      <section className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Data</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => exportPkgs.mutate()}>
            <Upload className="h-4 w-4" />
            Export installed
          </Button>
          <Button variant="outline" onClick={() => toast.info("Select a JSON export file to import")}>
            <Download className="h-4 w-4" />
            Import packages
          </Button>
          <Button
            variant="destructive"
            onClick={() => clearCache.mutate()}
            disabled={clearCache.isPending}
          >
            <Trash2 className="h-4 w-4" />
            Clear cache
          </Button>
        </div>
      </section>
    </div>
  );
}
