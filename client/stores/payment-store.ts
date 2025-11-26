import { create } from "zustand";
import { SeatInfo, PaymentResponse, BookingStatus } from "@/services/booking.service";

export interface PaymentState {
    // Modal state
    isModalOpen: boolean;

    // Payment process state
    isProcessing: boolean;
    currentStep: 'selection' | 'payment' | 'verification' | 'completed' | 'failed';

    // Booking data
    selectedSeats: SeatInfo[];
    eventId: number | null;
    totalAmount: number;
    paymentMethod: 'khalti' | 'esewa' | null;

    // Payment response
    paymentResponse: PaymentResponse | null;
    bookingStatus: BookingStatus | null;
    bookingId: number | null;

    // Error handling
    error: string | null;
}

export interface PaymentActions {
    // Modal actions
    openModal: () => void;
    closeModal: () => void;

    // Payment process actions
    setProcessing: (processing: boolean) => void;
    setStep: (step: PaymentState['currentStep']) => void;

    // Booking data actions
    setSelectedSeats: (seats: SeatInfo[]) => void;
    setEventId: (eventId: number) => void;
    setPaymentMethod: (method: 'khalti' | 'esewa') => void;

    // Payment response actions
    setPaymentResponse: (response: PaymentResponse) => void;
    setBookingStatus: (status: BookingStatus) => void;
    setBookingId: (id: number) => void;

    // Error actions
    setError: (error: string | null) => void;

    // Reset actions
    resetPayment: () => void;
    resetAll: () => void;
}

type PaymentStore = PaymentState & PaymentActions;

const initialState: PaymentState = {
    isModalOpen: false,
    isProcessing: false,
    currentStep: 'selection',
    selectedSeats: [],
    eventId: null,
    totalAmount: 0,
    paymentMethod: null,
    paymentResponse: null,
    bookingStatus: null,
    bookingId: null,
    error: null,
};

export const usePaymentStore = create<PaymentStore>((set, get) => ({
    ...initialState,

    // Modal actions
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),

    // Payment process actions
    setProcessing: (processing) => set({ isProcessing: processing }),
    setStep: (step) => set({ currentStep: step }),

    // Booking data actions
    setSelectedSeats: (seats) => {
        const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
        set({ selectedSeats: seats, totalAmount });
    },
    setEventId: (eventId) => set({ eventId }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),

    // Payment response actions
    setPaymentResponse: (response) => set({ paymentResponse: response }),
    setBookingStatus: (status) => set({ bookingStatus: status }),
    setBookingId: (id) => set({ bookingId: id }),

    // Error actions
    setError: (error) => set({ error }),

    // Reset actions
    resetPayment: () => set({
        isProcessing: false,
        currentStep: 'selection',
        paymentMethod: null,
        paymentResponse: null,
        error: null,
    }),

    resetAll: () => set(initialState),
}));

// Legacy modal hook for backward compatibility
export const usePaymentModal = create<{
    isOpen: boolean;
    open: () => void;
    close: () => void;
}>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));