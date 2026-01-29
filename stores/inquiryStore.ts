import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface InquiryItem {
  id: string;
  name: string;
  category: string;
  specifications: Array<{ name: string; value: string }>;
  image: string;
  quantity: number;
  notes: string;
}

interface InquiryState {
  items: InquiryItem[];
  addItem: (item: Omit<InquiryItem, 'quantity' | 'notes'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearInquiry: () => void;
  itemCount: () => number;
}

export const useInquiryStore = create<InquiryState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find(i => i.id === item.id);
        
        if (existingItem) {
          set((state) => ({
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1, notes: "" }],
          }));
        }
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },
      updateNotes: (id, notes) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, notes }
              : item
          ),
        }));
      },
      clearInquiry: () => set({ items: [] }),
      itemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'inquiry-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);