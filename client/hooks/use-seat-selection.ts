import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export interface SelectedSeat {
    id: string;
    label: string;
    ticketTypeId: string;
    ticketTypeName: string;
    price: number;
    sectionId: number;
    sectionName: string;
}

export interface PendingSeat {
    id: string;
    label: string;
    sectionId: number;
    sectionName: string;
}

export enum SeatSelectionState {
    IDLE = 'idle',
    SELECTING = 'selecting',
    CONFIRMING = 'confirming'
}

interface UseSeatSelectionProps {
    maxSeatsPerBooking?: number;
    onSelectionChange?: (selectedSeats: SelectedSeat[]) => void;
}

export function useSeatSelection({
    maxSeatsPerBooking = 10,
    onSelectionChange
}: UseSeatSelectionProps = {}) {
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [pendingSeat, setPendingSeat] = useState<PendingSeat | null>(null);
    const [selectionState, setSelectionState] = useState<SeatSelectionState>(SeatSelectionState.IDLE);
    const [processingSeats, setProcessingSeats] = useState<Set<string>>(new Set());

    const totalCost = useMemo(() =>
        selectedSeats.reduce((sum, seat) => sum + seat.price, 0), [selectedSeats]
    );

    const seatCount = useMemo(() => selectedSeats.length, [selectedSeats]);

    const canSelectMoreSeats = useMemo(() =>
        seatCount < maxSeatsPerBooking, [seatCount, maxSeatsPerBooking]
    );

    const isSeatSelected = useCallback((seatId: string) =>
        selectedSeats.some(s => s.id === seatId), [selectedSeats]
    );

    const isSeatProcessing = useCallback((seatId: string) =>
        processingSeats.has(seatId), [processingSeats]
    );

    const updateProcessingSeats = useCallback((seatId: string, add: boolean) => {
        setProcessingSeats(prev => {
            const newSet = new Set(prev);
            add ? newSet.add(seatId) : newSet.delete(seatId);
            return newSet;
        });
    }, []);

    const startSeatSelection = useCallback((seat: PendingSeat) => {
        if (selectionState !== SeatSelectionState.IDLE) {
            toast.error('Please complete current selection first');
            return false;
        }

        if (isSeatSelected(seat.id)) {
            toast.error('Seat already selected');
            return false;
        }

        if (isSeatProcessing(seat.id)) {
            toast.error('Seat currently being processed');
            return false;
        }

        if (!canSelectMoreSeats) {
            toast.error(`Maximum ${maxSeatsPerBooking} seats allowed`);
            return false;
        }

        setSelectionState(SeatSelectionState.CONFIRMING);
        updateProcessingSeats(seat.id, true);
        setPendingSeat(seat);
        return true;
    }, [selectionState, isSeatSelected, isSeatProcessing, canSelectMoreSeats, maxSeatsPerBooking, updateProcessingSeats]);

    const completeSeatSelection = useCallback((ticketTypeId: string, ticketTypeName: string, price: number) => {
        if (!pendingSeat) {
            toast.error('No seat selected');
            return false;
        }

        const newSeat: SelectedSeat = {
            id: pendingSeat.id,
            label: pendingSeat.label,
            ticketTypeId,
            ticketTypeName,
            price,
            sectionId: pendingSeat.sectionId,
            sectionName: pendingSeat.sectionName,
        };

        setSelectedSeats(prev => {
            const updated = [...prev, newSeat];
            onSelectionChange?.(updated);
            return updated;
        });

        toast.success(`Seat ${pendingSeat.label} selected`);
        updateProcessingSeats(pendingSeat.id, false);
        setPendingSeat(null);
        setSelectionState(SeatSelectionState.IDLE);
        return true;
    }, [pendingSeat, onSelectionChange, updateProcessingSeats]);

    const cancelSeatSelection = useCallback(() => {
        if (pendingSeat) {
            updateProcessingSeats(pendingSeat.id, false);
            setPendingSeat(null);
        }
        setSelectionState(SeatSelectionState.IDLE);
    }, [pendingSeat, updateProcessingSeats]);

    const removeSeat = useCallback((seatId: string) => {
        const removedSeat = selectedSeats.find(seat => seat.id === seatId);

        setSelectedSeats(prev => {
            const updated = prev.filter(seat => seat.id !== seatId);
            onSelectionChange?.(updated);
            return updated;
        });

        if (removedSeat) {
            toast.success(`Seat ${removedSeat.label} removed`);
        }
    }, [selectedSeats, onSelectionChange]);

    const clearAllSeats = useCallback(() => {
        const seatCount = selectedSeats.length;
        setSelectedSeats([]);
        onSelectionChange?.([]);

        if (seatCount > 0) {
            toast.success(`All ${seatCount} seats removed`);
        }
    }, [selectedSeats, onSelectionChange]);

    const getSeat = useCallback((seatId: string) => {
        return selectedSeats.find(seat => seat.id === seatId);
    }, [selectedSeats]);

    const getSeatsBySection = useCallback(() => {
        return selectedSeats.reduce((acc, seat) => {
            const sectionName = seat.sectionName;
            if (!acc[sectionName]) acc[sectionName] = [];
            acc[sectionName].push(seat);
            return acc;
        }, {} as Record<string, SelectedSeat[]>);
    }, [selectedSeats]);

    const validateSeatSelection = useCallback((seatId: string) => {
        const errors: string[] = [];

        if (isSeatSelected(seatId)) errors.push('Seat already selected');
        if (isSeatProcessing(seatId)) errors.push('Seat being processed');
        if (!canSelectMoreSeats) errors.push(`Maximum ${maxSeatsPerBooking} seats allowed`);
        if (selectionState !== SeatSelectionState.IDLE) errors.push('Complete current selection first');

        return { isValid: errors.length === 0, errors };
    }, [isSeatSelected, isSeatProcessing, canSelectMoreSeats, maxSeatsPerBooking, selectionState]);

    return {
        // State
        selectedSeats,
        pendingSeat,
        selectionState,
        processingSeats,

        // Computed values
        totalPrice: totalCost,
        totalSeats: seatCount,
        canSelectMoreSeats,
        isModalOpen: selectionState === SeatSelectionState.CONFIRMING,

        // Actions
        startSeatSelection,
        completeSeatSelection,
        cancelSeatSelection,
        removeSeat,
        clearAllSeats,

        // Utilities
        isSeatSelected,
        isSeatProcessing,
        getSeat,
        getSeatsBySection,
        validateSeatSelection,

        // Configuration
        maxSeatsPerBooking
    };
}