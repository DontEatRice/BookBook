import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartState = {
  isOpen: boolean;
  isChanged: boolean;
  toggleCart: () => void;
  toggleIsChanged: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      isChanged: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleIsChanged: () => set((state) => ({ isChanged: !state.isChanged })),
    }),
    {
      name: 'cart-store',
    }
  )
);

