import { $axios } from '@/lib/axios';

export interface SeatInfo {
    id: string;
    label: string;
    ticketTypeId: string;
    ticketTypeName: string;
    price: number;
    sectionId: number;
    sectionName: string;
}

export interface BookingRequest {
    eventId: number;
    seatInfo: SeatInfo[];
    paymentMethod: 'khalti' | 'esewa';
}

export interface KhaltiPaymentResponse {
    bookingId: number;
    paymentMethod: 'khalti';
    paymentUrl: string;
    pidx: string;
    expiresAt: string;
}

export interface EsewaPaymentResponse {
    bookingId: number;
    paymentMethod: 'esewa';
    paymentUrl: string;
    payload: {
        amount: number;
        tax_amount: number;
        total_amount: number;
        transaction_uuid: string;
        product_code: string;
        product_service_charge: number;
        product_delivery_charge: number;
        success_url: string;
        failure_url: string;
        signed_field_names: string;
        signature: string;
    };
    method: 'POST';
    transactionId: string;
}

export type PaymentResponse = KhaltiPaymentResponse | EsewaPaymentResponse;

export interface BookingStatus {
    bookingId: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED';
    totalPrice: number;
    event: {
        id: number;
        title: string;
        date: string;
    };
    seats: Array<{
        id: number;
        label: string;
        sectionId: number;
    }>;
    payment: {
        id: number;
        amount: number;
        method: string;
        status: string;
        transactionId: string | null;
        paidAt: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
}

// Initialize booking and get payment details
export const initializeBooking = async (bookingData: BookingRequest): Promise<PaymentResponse> => {
    const response = await $axios.post('/bookings/initialize', bookingData);
    return response.data.data;
};

// Get booking status
export const getBookingStatus = async (bookingId: number): Promise<BookingStatus> => {
    const response = await $axios.get(`/payments/booking/${bookingId}/status`);
    return response.data.data;
};

// Cancel booking
export const cancelBooking = async (bookingId: number) => {
    const response = await $axios.delete(`/payments/booking/${bookingId}`);
    return response.data;
};

// Handle Khalti payment redirect
export const redirectToKhalti = (paymentUrl: string) => {
    window.location.href = paymentUrl;
};

// Handle eSewa payment submission
export const submitToEsewa = (response: EsewaPaymentResponse) => {
    // Create form and submit to eSewa
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = response.paymentUrl;

    // Add all payload fields as hidden inputs
    Object.entries(response.payload).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
    });

    // Add form to body, submit, then remove
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};