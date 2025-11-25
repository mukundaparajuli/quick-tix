'use client';

import { useMemo } from 'react';
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
        const availableSeats: Seats[] = seats ?? [];

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
    }, [seats, sections]);

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
