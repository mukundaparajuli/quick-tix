import { create } from "zustand"

type PaymentModal = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const usePaymentModal = create<PaymentModal>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}))