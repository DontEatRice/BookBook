import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReservationViewModelType } from './models/ReservationViewModel';

type CartState = {
  isOpen: boolean;
  isChanged: boolean;
  toggleCart: () => void;
  toggleIsChanged: () => void;
  selectedReservation: ReservationViewModelType | null;
  setSelectedReservation: (reservation: ReservationViewModelType | null) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      isChanged: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleIsChanged: () => set((state) => ({ isChanged: !state.isChanged })),
      selectedReservation: null,
      setSelectedReservation: (reservation) => set(() => ({ selectedReservation: reservation })),
    }),
    {
      name: 'cart-store',
    }
  )
);

