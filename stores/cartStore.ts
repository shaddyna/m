// stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  designer: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find(
          (i) => i.id === item.id && i.size === item.size
        );
        
        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
        }
      },
      removeItem: (id, size) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.size === size)),
        }));
      },
      updateQuantity: (id, size, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.size === size
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'cart-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      version: 1, // Version number for potential future migrations
    }
  )
);