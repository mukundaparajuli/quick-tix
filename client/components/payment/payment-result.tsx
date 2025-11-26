"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useBookingStatus } from '@/hooks/booking/use-booking';


interface PaymentResultProps {
    type: 'success' | 'failure';
}

const PaymentResult: React.FC<PaymentResultProps> = ({ type }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [bookingId, setBookingId] = useState<number | null>(null);

    // Get parameters from URL
    const pidx = searchParams.get('pidx'); // Khalti
    const transactionUuid = searchParams.get('transaction_uuid'); // eSewa
    const bookingIdParam = searchParams.get('booking_id');
    const errorMessage = searchParams.get('error_message');

    useEffect(() => {
        if (bookingIdParam) {
            setBookingId(parseInt(bookingIdParam));
        }
    }, [bookingIdParam]);

    const {
        data: bookingStatus,
        isLoading,
        error,
        refetch
    } = useBookingStatus(
        bookingId,
        {
            enabled: !!bookingId,
            refetchInterval: type === 'success' ? 3000 : undefined // Poll only for success to check status
        }
    );

    const handleGoHome = () => {
        router.push('/dashboard');
    };

    const handleViewBooking = () => {
        if (bookingId) {
            router.push(`/dashboard/bookings/${bookingId}`);
        }
    };

    const handleRetryPayment = () => {
        // Navigate back to the event page to retry
        router.back();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                            <h2 className="text-xl font-semibold">Processing Payment</h2>
                            <p className="text-gray-600">
                                Please wait while we verify your payment...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (type === 'success' && bookingStatus) {
        const isPaymentSuccessful = bookingStatus.status === 'CONFIRMED' &&
            bookingStatus.paymentStatus === 'PAID';
        const isPaymentPending = bookingStatus.status === 'PENDING' &&
            bookingStatus.paymentStatus === 'PENDING';
        const isPaymentFailed = bookingStatus.status === 'CANCELLED' ||
            bookingStatus.paymentStatus === 'FAILED';

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            {isPaymentSuccessful ? (
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            ) : isPaymentPending ? (
                                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                            ) : (
                                <AlertCircle className="h-16 w-16 text-yellow-500" />
                            )}
                        </div>
                        <CardTitle className="text-2xl">
                            {isPaymentSuccessful ? 'Payment Successful!' :
                                isPaymentPending ? 'Processing Payment...' :
                                    'Payment Status Unknown'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="text-center space-y-2">
                            <p className="text-gray-600">
                                {isPaymentSuccessful
                                    ? 'Your booking has been confirmed successfully.'
                                    : isPaymentPending
                                        ? 'Your payment is being processed. Please wait...'
                                        : 'We are verifying your payment status. Please wait...'
                                }
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Booking ID:</span>
                                    <span className="text-sm">{bookingStatus.bookingId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Event:</span>
                                    <span className="text-sm">{bookingStatus.event.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Amount:</span>
                                    <span className="text-sm">Rs. {bookingStatus.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span className={`text-sm font-medium ${isPaymentSuccessful ? 'text-green-600' :
                                        isPaymentPending ? 'text-blue-600' :
                                            'text-yellow-600'
                                        }`}>
                                        {bookingStatus.paymentStatus}
                                    </span>
                                </div>
                                {bookingStatus.payment?.transactionId && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Transaction ID:</span>
                                        <span className="text-sm font-mono">
                                            {bookingStatus.payment.transactionId}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {isPaymentSuccessful ? (
                                <>
                                    <Button onClick={handleViewBooking} className="flex-1">
                                        View Booking
                                    </Button>
                                    <Button onClick={handleGoHome} variant="primaryOutline" className="flex-1">
                                        Go Home
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => refetch()} className="w-full">
                                    Refresh Status
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Failure case
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl">Payment Failed</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                                <p className="text-red-700">{decodeURIComponent(errorMessage)}</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            {errorMessage
                                ? 'Your payment could not be processed due to the reason above.'
                                : 'Your payment could not be processed. Please try again.'
                            }
                        </p>

                        {bookingStatus && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Booking ID:</span>
                                    <span className="text-sm">{bookingStatus.bookingId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span className="text-sm text-red-600 font-medium">
                                        {bookingStatus.paymentStatus}
                                    </span>
                                </div>
                                {bookingStatus.event && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Event:</span>
                                        <span className="text-sm">{bookingStatus.event.title}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {!bookingId && !error && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center">
                                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                                    <p className="text-yellow-700">
                                        No booking information found. Please contact support if you were charged.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleRetryPayment} className="flex-1">
                            Try Again
                        </Button>
                        <Button onClick={handleGoHome} variant="primaryOutline" className="flex-1">
                            Go Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentResult;