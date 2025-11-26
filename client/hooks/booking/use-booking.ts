import { useMutation, useQuery } from '@tanstack/react-query';
import {
    initializeBooking,
    getBookingStatus,
    cancelBooking,
    getUserBookings,
    getBookingById,
    BookingRequest,
    PaymentResponse,
    BookingStatus,
    BookingDetails
} from '@/services/booking.service';
import { handleApiErrorResponse, handleApiSuccessResponse } from '@/utils/handle-api-response';
import { toast } from 'sonner';

export const useInitializeBooking = (
    onSuccess?: (data: PaymentResponse) => void,
    onError?: (error: any) => void
) => {
    return useMutation({
        mutationFn: initializeBooking,
        onSuccess: (data) => {
            toast.success('Booking initialized successfully');
            toast.info('Redirecting to payment gateway...');
            onSuccess?.(data);
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            toast.error(error.response?.data?.message || 'Failed to initialize booking');
            onError?.(error);
        }
    });
};

export const useBookingStatus = (
    bookingId: number | null,
    options?: {
        enabled?: boolean;
        refetchInterval?: number;
    }
) => {
    return useQuery({
        queryKey: ['booking-status', bookingId],
        queryFn: () => getBookingStatus(bookingId!),
        enabled: !!bookingId && (options?.enabled ?? true),
        refetchInterval: options?.refetchInterval || false,
        retry: 3,
        retryDelay: 1000,
    });
};

// Hook for canceling booking
export const useCancelBooking = (
    onSuccess?: () => void,
    onError?: (error: any) => void
) => {
    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            toast.success('Booking has been cancelled');
            onSuccess?.();
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
            onError?.(error);
        }
    });
};

export const useGetUserBookings = () => {
    return useQuery({
        queryKey: ['user-bookings'],
        queryFn: getUserBookings,
    });
};

export const useGetBookingById = (bookingId: number | null) => {
    return useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () => getBookingById(bookingId!),
        enabled: !!bookingId,
    });
};