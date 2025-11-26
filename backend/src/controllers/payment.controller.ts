import { Request, Response } from 'express';
import ApiError from '../types/api-error';
import asyncHandler from '../utils/async-handler';
import { bookingService } from '../services/booking.service';
import { khaltiPaymentService } from '../services/khalti-payment.service';
import { esewaPaymentService } from '../services/esewa-payment.service';

// Khalti payment success callback
export const khaltiPaymentSuccess = asyncHandler(async (req: Request, res: Response) => {
    const { pidx } = req.query as { pidx: string };

    if (!pidx) {
        console.error('Khalti success callback: Missing pidx parameter');
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error_message=Missing payment information`);
    }

    try {
        // Get booking by pidx
        const booking = await bookingService.getBookingByPidx(pidx);

        if (!booking) {
            console.error(`Khalti success callback: Booking not found for pidx ${pidx}`);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error_message=Booking not found`);
        }

        // Verify payment with Khalti
        const verificationResponse = await khaltiPaymentService.verifyPayment({ pidx });

        if (verificationResponse.status === 'Completed') {
            // Confirm the payment and booking
            const confirmedBooking = await bookingService.confirmPayment(booking.id, verificationResponse);

            console.log(`Khalti payment successful for booking ${confirmedBooking.id}`);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/success?booking_id=${confirmedBooking.id}&pidx=${pidx}`);
        } else {
            // Payment failed
            console.log(`Khalti payment failed for booking ${booking.id}: ${verificationResponse.status}`);
            await bookingService.failPayment(booking.id, `Payment status: ${verificationResponse.status}`);

            return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?booking_id=${booking.id}&error_message=Payment ${verificationResponse.status.toLowerCase()}`);
        }
    } catch (error: any) {
        console.error('Khalti payment verification error:', error);

        // Try to get booking ID from pidx for error handling
        let bookingId: number | null = null;
        try {
            const booking = await bookingService.getBookingByPidx(pidx);
            bookingId = booking?.id || null;
        } catch (e) {
            console.error('Could not retrieve booking for error handling:', e);
        }

        if (bookingId) {
            await bookingService.failPayment(bookingId, 'Payment verification failed');
        }

        const errorMessage = error instanceof ApiError ? error.message : 'Payment verification failed';
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?booking_id=${bookingId || ''}&error_message=${encodeURIComponent(errorMessage)}`);
    }
});

// eSewa payment success callback
export const esewaPaymentSuccess = asyncHandler(async (req: Request, res: Response) => {
    const callbackData = req.method === 'GET' ? req.query : req.body;
    console.log('eSewa callback received:', { method: req.method, data: callbackData });

    // eSewa sends: amt, rid, pid, scd along with our custom parameters
    const { amt, rid, pid, scd, booking_id, transaction_uuid, total_amount, refId } = callbackData as any;

    // Use custom parameters (our booking_id and transaction_uuid)
    const finalBookingId = booking_id;
    const finalTransactionUuid = transaction_uuid || rid || refId;
    const finalTotalAmount = amt || total_amount;
    const merchantCode = scd;

    if (!finalBookingId || !finalTransactionUuid) {
        console.error('eSewa success callback: Missing required parameters', { booking_id: finalBookingId, transaction_uuid: finalTransactionUuid, total_amount: finalTotalAmount });
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error_message=Missing required payment information`);
    }

    try {
        const bookingId = parseInt(finalBookingId);

        // Get booking details
        const booking = await bookingService.getBookingWithPayment(bookingId);

        if (!booking) {
            console.error(`eSewa success callback: Booking not found for ID ${bookingId}`);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error_message=Booking not found`);
        }

        // Verify payment with eSewa
        const verificationResponse = await esewaPaymentService.verifyPayment({
            data: {
                transaction_uuid: finalTransactionUuid,
                total_amount: finalTotalAmount,
                booking_id: finalBookingId,
                merchant_code: merchantCode
            },
            bookingId: bookingId
        });

        if (verificationResponse.verified && verificationResponse.status === 'Completed') {
            // Confirm the payment and booking
            const confirmedBooking = await bookingService.confirmPayment(bookingId, verificationResponse);

            console.log(`eSewa payment successful for booking ${confirmedBooking.id}`);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/success?booking_id=${confirmedBooking.id}&transaction_uuid=${finalTransactionUuid}`);
        } else {
            // Payment failed
            console.log(`eSewa payment failed for booking ${bookingId}: ${verificationResponse.status || 'Verification failed'}`);
            await bookingService.failPayment(bookingId, 'eSewa payment verification failed');

            return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?booking_id=${bookingId}&error_message=Payment verification failed`);
        }
    } catch (error: any) {
        console.error('eSewa payment verification error:', error);

        const bookingId = finalBookingId ? parseInt(finalBookingId) : null;
        if (bookingId) {
            try {
                await bookingService.failPayment(bookingId, 'Payment verification failed');
            } catch (failError) {
                console.error('Failed to update payment status:', failError);
            }
        }

        const errorMessage = error instanceof ApiError ? error.message : 'Payment verification failed';
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?booking_id=${bookingId || ''}&error_message=${encodeURIComponent(errorMessage)}`);
    }
});

// Payment failure callback (both Khalti and eSewa)
export const paymentFailure = asyncHandler(async (req: Request, res: Response) => {
    const { booking_id, pidx, transaction_uuid, error_message } = req.query as any;

    let bookingId: number | null = null;
    let errorReason = error_message || 'Payment cancelled by user';

    try {
        if (booking_id) {
            bookingId = parseInt(booking_id);
        } else if (pidx) {
            // Get booking by pidx for Khalti
            const booking = await bookingService.getBookingByPidx(pidx);
            bookingId = booking?.id || null;
        }

        if (bookingId) {
            console.log(`Payment failed/cancelled for booking ${bookingId}: ${errorReason}`);
            await bookingService.failPayment(bookingId, errorReason);
        } else {
            console.log(`Payment failed/cancelled: ${errorReason} (no booking ID found)`);
        }

        // Redirect to frontend failure page with appropriate parameters
        const redirectParams = new URLSearchParams();
        if (bookingId) redirectParams.append('booking_id', bookingId.toString());
        if (errorReason) redirectParams.append('error_message', errorReason);
        if (pidx) redirectParams.append('pidx', pidx);
        if (transaction_uuid) redirectParams.append('transaction_uuid', transaction_uuid);

        return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?${redirectParams.toString()}`);
    } catch (error: any) {
        console.error('Payment failure handling error:', error);

        // Even if there's an error, redirect to failure page
        const redirectParams = new URLSearchParams();
        if (booking_id) redirectParams.append('booking_id', booking_id);
        redirectParams.append('error_message', 'An error occurred while processing payment failure');

        return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?${redirectParams.toString()}`);
    }
});

// Get booking status
export const getBookingStatus = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    if (!bookingId) {
        throw new ApiError(400, 'Booking ID is required');
    }

    try {
        const booking = await bookingService.getBookingWithPayment(parseInt(bookingId));

        res.status(200).json({
            success: true,
            message: 'Booking status retrieved successfully',
            data: {
                bookingId: booking.id,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                totalPrice: booking.totalPrice,
                event: {
                    id: booking.event.id,
                    title: booking.event.title,
                    date: booking.event.date
                },
                seats: booking.seats.map((seat: any) => ({
                    id: seat.id,
                    label: seat.label,
                    sectionId: seat.sectionId
                })),
                payment: booking.payment ? {
                    id: booking.payment.id,
                    amount: booking.payment.amount,
                    method: booking.payment.method,
                    status: booking.payment.status,
                    transactionId: booking.payment.transactionId,
                    paidAt: booking.payment.paidAt
                } : null,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }
        });
    } catch (error: any) {
        console.error('Get booking status error:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Failed to get booking status');
    }
});

// Cancel booking (before payment)
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
        throw new ApiError(401, 'Authentication required');
    }

    if (!bookingId) {
        throw new ApiError(400, 'Booking ID is required');
    }

    try {
        const booking = await bookingService.getBookingWithPayment(parseInt(bookingId));

        // Check if user owns this booking
        if (booking.attendee.userId !== userId) {
            throw new ApiError(403, 'Not authorized to cancel this booking');
        }

        // Check if booking can be cancelled
        if (booking.status === 'CONFIRMED') {
            throw new ApiError(400, 'Cannot cancel confirmed booking');
        }

        if (booking.paymentStatus === 'PAID') {
            throw new ApiError(400, 'Cannot cancel paid booking');
        }

        // Cancel the booking
        await bookingService.failPayment(parseInt(bookingId), 'Cancelled by user');

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: {
                bookingId: parseInt(bookingId),
                status: 'cancelled'
            }
        });
    } catch (error: any) {
        console.error('Cancel booking error:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Failed to cancel booking');
    }
});