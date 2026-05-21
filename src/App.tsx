import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { InstalledPage } from "@/pages/InstalledPage";
import { UpdatesPage } from "@/pages/UpdatesPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AppDetailsPage } from "@/pages/AppDetailsPage";
import { useSettingsStore } from "@/store/settingsStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { api } from "@/services/api";
import { useInstallQueueStore } from "@/store/installQueueStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function AppBootstrap() {
  const applyTheme = useSettingsStore((s) => s.applyTheme);
  const loadSettings = useSettingsStore((s) => s.loadFromBackend);
  const loadFavorites = useFavoritesStore((s) => s.load);
  const updateJob = useInstallQueueStore((s) => s.updateJob);
  const processQueue = useInstallQueueStore((s) => s.processQueue);

  useEffect(() => {
    applyTheme();
    loadSettings();
    loadFavorites();
  }, [applyTheme, loadSettings, loadFavorites]);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    api.onInstallProgress((progress) => {
      const progressValue = progress.status === "success" ? 100 : progress.status === "error" ? 0 : 50;
      updateJob(progress.packageId, {
        status: progress.status,
        progress: progressValue,
        log: progress.line,
      });
      if (progress.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["packages"] });
        processQueue();
      }
      if (progress.status === "error") processQueue();
    }).then((fn) => {
      unlisten = fn;
    });
    return () => unlisten?.();
  }, [updateJob, processQueue]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/installed" element={<InstalledPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/app/:id" element={<AppDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppBootstrap />
        <Toaster
          richColors
          position="bottom-right"
          toastOptions={{
            className: "rounded-xl border border-border shadow-lg",
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
