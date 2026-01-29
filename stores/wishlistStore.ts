// stores/wishlistStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  name: string;
  designer: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().isInWishlist(item.id)) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: 'wishlist-storage', 
      storage: createJSONStorage(() => localStorage), 
      version: 1, 
    }
  )
);