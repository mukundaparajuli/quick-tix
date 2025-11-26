"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { usePaymentStore } from '@/stores/payment-store';
import PaymentFlow from './payment-flow';

const PaymentModal: React.FC = () => {
    const {
        isModalOpen,
        selectedSeats,
        eventId,
        currentStep,
        closeModal,
        resetAll,
    } = usePaymentStore();

    const handleClose = () => {
        if (currentStep === 'payment' || currentStep === 'verification') {
            return;
        }
        closeModal();
        resetAll();
    };

    const canClose = currentStep !== 'payment' && currentStep !== 'verification';

    return (
        <Dialog open={isModalOpen} onOpenChange={canClose ? handleClose : undefined}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle>Complete Your Booking</DialogTitle>
                            <DialogDescription>
                                Review your selection and proceed with payment
                            </DialogDescription>
                        </div>
                        {canClose && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClose}
                                className="h-6 w-6"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                {eventId && selectedSeats.length > 0 ? (
                    <PaymentFlow eventId={eventId} selectedSeats={selectedSeats} />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No seats selected for booking.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;