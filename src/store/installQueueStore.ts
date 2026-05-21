import { create } from "zustand";
import { api } from "@/services/api";
import type { InstallJob } from "@/types/package";
import { toast } from "sonner";

interface InstallQueueState {
  jobs: InstallJob[];
  selectedIds: Set<string>;
  enqueue: (packageId: string, name: string) => void;
  processQueue: () => Promise<void>;
  toggleSelect: (packageId: string) => void;
  clearSelection: () => void;
  installSelected: (names: Record<string, string>) => Promise<void>;
  updateJob: (packageId: string, patch: Partial<InstallJob>) => void;
}

export const useInstallQueueStore = create<InstallQueueState>((set, get) => ({
  jobs: [],
  selectedIds: new Set(),

  enqueue: (packageId, name) => {
    const exists = get().jobs.some((j) => j.packageId === packageId);
    if (exists) return;
    set((s) => ({
      jobs: [
        ...s.jobs,
        {
          packageId,
          name,
          status: "queued",
          progress: 0,
          log: "",
        },
      ],
    }));
    get().processQueue();
  },

  updateJob: (packageId, patch) =>
    set((s) => ({
      jobs: s.jobs.map((j) =>
        j.packageId === packageId ? { ...j, ...patch } : j,
      ),
    })),

  processQueue: async () => {
    const running = get().jobs.some((j) => j.status === "running");
    if (running) return;

    const next = get().jobs.find((j) => j.status === "queued");
    if (!next) return;

    get().updateJob(next.packageId, { status: "running", progress: 10 });
    toast.info(`Installing ${next.name}...`);

    try {
      await api.installPackage(next.packageId);
    } catch (e) {
      get().updateJob(next.packageId, {
        status: "error",
        log: String(e),
      });
      toast.error(`Failed to install ${next.name}`);
      await get().processQueue();
    }
  },

  toggleSelect: (packageId) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(packageId)) next.delete(packageId);
      else next.add(packageId);
      return { selectedIds: next };
    }),

  clearSelection: () => set({ selectedIds: new Set() }),

  installSelected: async (names) => {
    const { selectedIds } = get();
    for (const id of selectedIds) {
      get().enqueue(id, names[id] ?? id);
    }
    set({ selectedIds: new Set() });
  },
}));
