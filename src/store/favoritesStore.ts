import { create } from "zustand";
import { api } from "@/services/api";
import { toast } from "sonner";

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
    try {
      const favorites = await api.getFavorites();
      set({
        ids: new Set(favorites.map((f) => f.packageId)),
        loaded: true,
      });
    } catch (e) {
      console.error("Failed to load favorites", e);
      set({ loaded: true });
    }
  },

  toggle: async (packageId) => {
    const { ids } = get();
    try {
      if (ids.has(packageId)) {
        await api.removeFavorite(packageId);
        const next = new Set(ids);
        next.delete(packageId);
        set({ ids: next });
        toast.success("Removed from favorites");
      } else {
        await api.addFavorite(packageId);
        const next = new Set(ids);
        next.add(packageId);
        set({ ids: next });
        toast.success("Added to favorites");
      }
    } catch (e) {
      console.error("Failed to toggle favorite", e);
      toast.error(`Failed to update favorite: ${String(e)}`);
    }
  },

  isFavorite: (packageId) => get().ids.has(packageId),
}));
