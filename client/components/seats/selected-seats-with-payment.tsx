"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { SelectedSeat } from "@/hooks/use-seat-selection";
import { X, CreditCard } from "lucide-react";
import { usePaymentStore } from '@/stores/payment-store';

interface SelectedSeatsWithPaymentProps {
    seats: SelectedSeat[];
    seatsBySection: Record<string, SelectedSeat[]>;
    onRemove: (seatId: string) => void;
    onClear: () => void;
    totalPrice: number;
    eventId: number;
    disabled?: boolean;
}

export default function SelectedSeatsWithPayment({
    seats,
    seatsBySection,
    onRemove,
    onClear,
    totalPrice,
    eventId,
    disabled = false
}: SelectedSeatsWithPaymentProps) {
    const { openModal, setSelectedSeats, setEventId, resetAll } = usePaymentStore();

    if (seats.length === 0) return null;

    const handleProceedToPayment = () => {
        // Convert to payment store format
        const seatInfo = seats.map(seat => ({
            id: seat.id,
            label: seat.label,
            ticketTypeId: seat.ticketTypeId,
            ticketTypeName: seat.ticketTypeName,
            price: seat.price,
            sectionId: seat.sectionId,
            sectionName: seat.sectionName,
        }));

        resetAll();
        setEventId(eventId);
        setSelectedSeats(seatInfo);
        openModal();
    };

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-700 text-white rounded-t-lg">
                    <h3 className="font-semibold">Selected Seats ({seats.length})</h3>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Rs. {totalPrice.toFixed(2)}</span>
                        <button
                            onClick={onClear}
                            className="p-1 hover:bg-gray-600 rounded"
                            aria-label="Clear all seats"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <div className="max-h-32 overflow-y-auto mb-4">
                        {Object.entries(seatsBySection).map(([sectionName, sectionSeats]) => (
                            <div key={sectionName} className="mb-3 last:mb-0">
                                <h4 className="text-xs font-medium text-gray-600 mb-1">{sectionName}</h4>
                                <div className="space-y-1">
                                    {sectionSeats.map((seat) => (
                                        <div key={seat.id} className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{seat.label}</span>
                                                <span className="text-xs text-gray-500">
                                                    {seat.ticketTypeName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">
                                                    Rs. {seat.price.toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => onRemove(seat.id)}
                                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                    aria-label={`Remove seat ${seat.label}`}
                                                    disabled={disabled}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span className="text-lg">Rs. {totalPrice.toFixed(2)}</span>
                        </div>

                        <Button
                            onClick={handleProceedToPayment}
                            className="w-full"
                            disabled={disabled || seats.length === 0}
                            variant="primary"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Proceed to Payment
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}