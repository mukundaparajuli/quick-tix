"use client";

import { useMemo, useEffect, useState } from 'react';
import { Seats } from "@/types/seat";
import { Section } from "@/types/section";
import { TicketType } from "@/types/ticket-type";
import { SelectedSeat } from "@/hooks/use-seat-selection";
import { useSeatSelection } from "@/hooks/use-seat-selection";
import SeatMapHeader from "./seat-map-header";
import SeatMapLegend from "./seat-map-legend";
import SeatSection from "./seat-section";
import SelectedSeats from "./selected-seats";
import TicketTypeModal from "./ticket-type-modal";

interface DisplaySeatsProps {
    seats: Seats[] | null;
    sections?: Section[] | null;
    ticketTypes?: TicketType[] | null;
    onSelectionChange?: (seats: SelectedSeat[]) => void;
}

export default function DisplaySeats({
    seats,
    sections,
    ticketTypes,
    onSelectionChange
}: DisplaySeatsProps) {
    // local copy of seats so we can update real-time state (reserved/booked/available)
    const [localSeats, setLocalSeats] = useState<Seats[]>(seats ?? []);
    // join socket room if event id present in route
    try {
        // lazy import socket to avoid SSR issues
    } catch (err) {
        // ignore
    }

    useEffect(() => {
        setLocalSeats(seats ?? []);
    }, [seats]);

    // Subscribe to socket updates if running in browser and route param present
    // We attempt to import getSocket dynamically to avoid SSR import errors
    useEffect(() => {
        let socket: any;
        try {
            const { useParams } = require('next/navigation');
            const params = useParams();
            const eventId = params?.id ? Number(params.id) : null;
            if (!eventId) return;
            const { getSocket } = require('@/lib/socket');
            socket = getSocket(eventId);
            const handler = (payload: any) => {
                const { seatIds, status } = payload || {};
                if (!seatIds || !Array.isArray(seatIds)) return;
                setLocalSeats((prev) => prev.map(s => {
                    if (seatIds.includes(Number(s.id))) {
                        if (status === 'RESERVED') return { ...s, isProcessing: true } as Seats;
                        if (status === 'BOOKED') return { ...s, isBooked: true, isProcessing: false } as Seats;
                        if (status === 'AVAILABLE') return { ...s, isBooked: false, isProcessing: false } as Seats;
                    }
                    return s;
                }));
            };
            socket.on('seatStatusUpdate', handler);
            return () => {
                socket.off('seatStatusUpdate', handler);
            };
        } catch (err) {
            // ignore in non-browser/SSR
        }
    }, []);
    const seatSelection = useSeatSelection({
        maxSeatsPerBooking: 8,
        onSelectionChange
    });

    const {
        selectedSeats,
        pendingSeat,
        isModalOpen,
        totalPrice,
        totalSeats,
        startSeatSelection,
        completeSeatSelection,
        cancelSeatSelection,
        removeSeat,
        clearAllSeats,
        getSeatsBySection
    } = seatSelection;

    const { processedData } = useMemo(() => {
        const availableSeats: Seats[] = localSeats ?? [];

        const sectionNameMap: Record<string, string> = {};
        (sections ?? []).forEach((sec) => {
            if (!sec) return;
            sectionNameMap[String(sec.id)] = sec.name || `Section ${sec.id}`;
        });

        const groupedSeats: Record<string, Seats[]> = {};
        availableSeats.forEach((seat) => {
            const secKey = String(seat.sectionId ?? "unknown");
            const sectionName = sectionNameMap[secKey] ?? `Section ${secKey}`;
            if (!groupedSeats[sectionName]) groupedSeats[sectionName] = [];
            groupedSeats[sectionName].push(seat);
        });

        return {
            processedData: {
                groupedSeats,
                sectionKeys: Object.keys(groupedSeats).sort(),
                availableSeats
            }
        };
    }, [localSeats, sections]);

    if (!processedData.availableSeats.length) {
        return (
            <div className="p-4 text-center text-gray-500">
                No seats available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SeatMapHeader
                totalSeats={totalSeats}
                totalPrice={totalPrice}
            />

            <SeatMapLegend />

            <div className="space-y-6">
                {processedData.sectionKeys.map((sectionName) => (
                    <SeatSection
                        key={sectionName}
                        sectionName={sectionName}
                        seats={processedData.groupedSeats[sectionName]}
                        seatSelection={seatSelection}
                    />
                ))}
            </div>

            {selectedSeats.length > 0 && (
                <SelectedSeats
                    seats={selectedSeats}
                    seatsBySection={getSeatsBySection()}
                    onRemove={removeSeat}
                    onClear={clearAllSeats}
                    totalPrice={totalPrice}
                />
            )}

            <TicketTypeModal
                isOpen={isModalOpen}
                pendingSeat={pendingSeat}
                ticketTypes={ticketTypes}
                onComplete={completeSeatSelection}
                onCancel={cancelSeatSelection}
            />
        </div>
    );
}
