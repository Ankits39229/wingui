import { create } from "zustand";
import { api } from "@/services/api";

interface FavoritesState {
  ids: Set<string>;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (packageId: string) => Promise<void>;
  isFavorite: (packageId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: new Set(),
  loaded: false,

  load: async () => {
    const favorites = await api.getFavorites();
    set({
      ids: new Set(favorites.map((f) => f.packageId)),
      loaded: true,
    });
  },

  toggle: async (packageId) => {
    const { ids } = get();
    if (ids.has(packageId)) {
      await api.removeFavorite(packageId);
      const next = new Set(ids);
      next.delete(packageId);
      set({ ids: next });
    } else {
      await api.addFavorite(packageId);
      const next = new Set(ids);
      next.add(packageId);
      set({ ids: next });
    }
  },

  isFavorite: (packageId) => get().ids.has(packageId),
}));
