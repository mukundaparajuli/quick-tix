"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CreditCard, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePaymentStore } from '@/stores/payment-store';
import { useInitializeBooking, useBookingStatus } from '@/hooks/booking/use-booking';
import { redirectToKhalti, submitToEsewa, SeatInfo } from '@/services/booking.service';
import { toast } from 'sonner';

interface PaymentMethodSelectorProps {
    onSelect: (method: 'khalti' | 'esewa') => void;
    selectedMethod: 'khalti' | 'esewa' | null;
    disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
    onSelect,
    selectedMethod,
    disabled = false
}) => {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant={selectedMethod === 'khalti' ? 'default' : 'primaryOutline'}
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => onSelect('khalti')}
                    disabled={disabled}
                >
                    <div className="w-8 h-8 bg-purple-600 rounded mb-1 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">K</span>
                    </div>
                    <span>Khalti</span>
                </Button>

                <Button
                    variant={selectedMethod === 'esewa' ? 'default' : 'primaryOutline'}
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => onSelect('esewa')}
                    disabled={disabled}
                >
                    <div className="w-8 h-8 bg-green-600 rounded mb-1 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">E</span>
                    </div>
                    <span>eSewa</span>
                </Button>
            </div>
        </div>
    );
};

interface BookingSummaryProps {
    seats: SeatInfo[];
    totalAmount: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ seats, totalAmount }) => {
    const seatsBySection = seats.reduce((acc, seat) => {
        if (!acc[seat.sectionName]) {
            acc[seat.sectionName] = [];
        }
        acc[seat.sectionName].push(seat);
        return acc;
    }, {} as Record<string, SeatInfo[]>);

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Object.entries(seatsBySection).map(([sectionName, sectionSeats]) => (
                        <div key={sectionName}>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">{sectionName}</h4>
                            <div className="space-y-2">
                                {sectionSeats.map((seat) => (
                                    <div key={seat.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {seat.label}
                                            </Badge>
                                            <span className="text-sm">{seat.ticketTypeName}</span>
                                        </div>
                                        <span className="font-medium">Rs. {seat.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between items-center font-semibold">
                        <span>Total ({seats.length} seat{seats.length > 1 ? 's' : ''})</span>
                        <span className="text-lg">Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface PaymentFlowProps {
    eventId: number;
    selectedSeats: SeatInfo[];
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ eventId, selectedSeats }) => {
    const {
        paymentMethod,
        totalAmount,
        isProcessing,
        currentStep,
        paymentResponse,
        bookingId,
        error,
        setPaymentMethod,
        setProcessing,
        setStep,
        setPaymentResponse,
        setBookingId,
        setError,
    } = usePaymentStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const initializeBookingMutation = useInitializeBooking(
        (response) => {
            setPaymentResponse(response);
            setBookingId(response.bookingId);
            setStep('payment');
            setIsSubmitting(false);

            // Redirect to payment gateway
            if (response.paymentMethod === 'khalti') {
                redirectToKhalti(response.paymentUrl);
            } else if (response.paymentMethod === 'esewa') {
                submitToEsewa(response);
            }
        },
        (error) => {
            setError(error.response?.data?.message || 'Failed to initialize booking');
            setStep('failed');
            setIsSubmitting(false);
        }
    );

    const { data: bookingStatus, refetch: refetchBookingStatus } = useBookingStatus(
        bookingId,
        {
            enabled: !!bookingId && currentStep === 'verification',
            refetchInterval: 5000 // Poll every 5 seconds during verification
        }
    );

    const handlePaymentMethodSelect = (method: 'khalti' | 'esewa') => {
        setPaymentMethod(method);
        setError(null);
    };

    const handleProceedToPayment = () => {
        if (!paymentMethod || isProcessing || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setProcessing(true);
        setError(null);

        initializeBookingMutation.mutate({
            eventId,
            seatInfo: selectedSeats,
            paymentMethod,
        });
    };

    const handleRetry = () => {
        setError(null);
        setStep('selection');
        setProcessing(false);
        setIsSubmitting(false);
    };

    // Check booking status when component mounts if we have a booking ID
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pidx = urlParams.get('pidx');
        const bookingIdFromUrl = urlParams.get('booking_id');

        if (pidx || bookingIdFromUrl) {
            setStep('verification');
            if (bookingIdFromUrl) {
                setBookingId(parseInt(bookingIdFromUrl));
            }
        }
    }, [setStep, setBookingId]);

    // Update step based on booking status
    useEffect(() => {
        if (bookingStatus) {
            if (bookingStatus.status === 'CONFIRMED' && bookingStatus.paymentStatus === 'PAID') {
                setStep('completed');
            } else if (bookingStatus.status === 'CANCELLED' || bookingStatus.paymentStatus === 'FAILED') {
                setStep('failed');
                setError('Payment failed or was cancelled');
            }
        }
    }, [bookingStatus, setStep, setError]);

    if (currentStep === 'verification') {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <h3 className="font-semibold">Verifying Payment</h3>
                        <p className="text-sm text-gray-600">
                            Please wait while we verify your payment. This may take a few moments.
                        </p>
                        {bookingStatus && (
                            <div className="text-xs text-gray-500">
                                Status: {bookingStatus.status} | Payment: {bookingStatus.paymentStatus}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (currentStep === 'completed') {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                        <h3 className="font-semibold text-lg">Payment Successful!</h3>
                        <p className="text-sm text-gray-600">
                            Your booking has been confirmed. You should receive a confirmation email shortly.
                        </p>
                        {bookingStatus && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="font-medium">Booking ID: {bookingStatus.bookingId}</p>
                                <p className="text-sm">Transaction ID: {bookingStatus.payment?.transactionId || 'N/A'}</p>
                            </div>
                        )}
                        <Button onClick={() => window.location.href = '/dashboard'}>
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (currentStep === 'failed') {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                        <h3 className="font-semibold text-lg">Payment Failed</h3>
                        <p className="text-sm text-gray-600">
                            {error || 'Something went wrong with your payment. Please try again.'}
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={handleRetry} variant="primaryOutline">
                                Try Again
                            </Button>
                            <Button onClick={() => window.location.href = '/dashboard'} variant="default">
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <BookingSummary seats={selectedSeats} totalAmount={totalAmount} />

            <Card>
                <CardContent className="pt-6">
                    <PaymentMethodSelector
                        onSelect={handlePaymentMethodSelect}
                        selectedMethod={paymentMethod}
                        disabled={isProcessing || isSubmitting}
                    />

                    {error && (
                        <Alert className="mt-4" variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="mt-6 flex gap-3">
                        <Button
                            onClick={handleProceedToPayment}
                            disabled={!paymentMethod || isProcessing || isSubmitting}
                            className="flex-1"
                        >
                            {(isProcessing || isSubmitting) ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay Rs. {totalAmount.toFixed(2)}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentFlow;