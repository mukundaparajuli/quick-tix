import { useMemo, useCallback } from "react";
import { Seats } from "@/types/seat";
import { Section } from "@/types/section";
import { TicketType } from "@/types/ticket-type";
import { toast } from "sonner";
import { useTicketTypeModal } from "@/stores/select-tickettype-store";

import { useSeatSelection, type SelectedSeat, type PendingSeat } from "@/hooks/use-seat-selection";
import { TicketTypeModal } from "./ticket-type-modal";
import SeatSection from "./components/seat-section";
import SeatMapLegend from "./components/seat-map-legend";
import SeatMapHeader from "./components/seat-map-header";
import SelectedSeatsWithPayment from "@/components/seats/selected-seats-with-payment";
import PaymentModal from "@/components/payment/payment-modal";
import { useParams } from "next/navigation";

export type { SelectedSeat } from "@/hooks/use-seat-selection";

interface DisplaySeatsProps {
    seats: Seats[] | null;
    sections?: Section[] | null;
    ticketTypes: TicketType[] | null;
    maxSeatsPerBooking?: number;
    onSelectionChange?: (selectedSeats: SelectedSeat[]) => void;
}

const useSeatData = (seats: Seats[] | null, sections: Section[] | null) => {
    const allSeats = useMemo(() =>
        seats ?? [], [seats]
    );

    const sectionNameMap = useMemo(() => {
        const map: Record<string, string> = {};
        (sections ?? []).forEach((sec) => {
            if (sec) {
                map[String(sec.id)] = sec.name || `Section ${sec.id}`;
            }
        });
        return map;
    }, [sections]);

    const groupedSeats = useMemo(() => {
        const grouped: Record<string, Seats[]> = {};
        allSeats.forEach((seat) => {
            const secKey = String(seat.sectionId ?? "unknown");
            const sectionName = sectionNameMap[secKey] ?? `Section ${secKey}`;
            if (!grouped[sectionName]) grouped[sectionName] = [];
            grouped[sectionName].push(seat);
        });
        return grouped;
    }, [allSeats, sectionNameMap]);

    return { allSeats, sectionNameMap, groupedSeats };
};

export default function DisplaySeats({
    seats,
    sections,
    ticketTypes,
    maxSeatsPerBooking = 10,
    onSelectionChange
}: DisplaySeatsProps) {
    const { id } = useParams();
    const { open, close } = useTicketTypeModal();
    const seatSelection = useSeatSelection({ maxSeatsPerBooking, onSelectionChange });
    const { allSeats, sectionNameMap, groupedSeats } = useSeatData(seats, sections ?? null);
    const sectionKeys = useMemo(() => Object.keys(groupedSeats).sort(), [groupedSeats]);

    const createPendingSeat = useCallback((seatId: string, seatLabel: string): PendingSeat | null => {
        const seat = allSeats.find((s: Seats) => s.id === seatId);
        if (!seat) return null;

        return {
            id: seatId,
            label: seatLabel,
            sectionId: seat.sectionId,
            sectionName: sectionNameMap[String(seat.sectionId)] || `Section ${seat.sectionId}`
        };
    }, [allSeats, sectionNameMap]);

    const handleSelect = useCallback((seatId: string, seatLabel: string) => {
        if (!ticketTypes?.length) {
            toast.error("No ticket types available");
            return;
        }

        const pendingSeat = createPendingSeat(seatId, seatLabel);
        if (!pendingSeat) {
            toast.error("Seat not found");
            return;
        }

        if (seatSelection.startSeatSelection(pendingSeat)) {
            open();
        }
    }, [ticketTypes, createPendingSeat, seatSelection, open]);

    const handleTicketTypeSelect = useCallback((ticketTypeId: string, ticketTypeName: string) => {
        if (!seatSelection.pendingSeat) {
            toast.error("No seat selected");
            return;
        }

        const ticketType = ticketTypes?.find(type => type.id === ticketTypeId);
        if (!ticketType) {
            toast.error("Ticket type not found");
            seatSelection.cancelSeatSelection();
            close();
            return;
        }

        if (ticketType.capacity && ticketType.sold >= ticketType.capacity) {
            toast.error("This ticket type is sold out");
            seatSelection.cancelSeatSelection();
            close();
            return;
        }

        if (seatSelection.completeSeatSelection(ticketTypeId, ticketTypeName, ticketType.price)) {
            close();
        }
    }, [seatSelection, ticketTypes, close]);

    const handleModalClose = useCallback(() => {
        seatSelection.cancelSeatSelection();
        close();
    }, [seatSelection, close]);

    // Get seat data grouped by section for the payment component
    const seatsBySection = useMemo(() => {
        return seatSelection.selectedSeats.reduce((acc, seat) => {
            if (!acc[seat.sectionName]) {
                acc[seat.sectionName] = [];
            }
            acc[seat.sectionName].push(seat);
            return acc;
        }, {} as Record<string, SelectedSeat[]>);
    }, [seatSelection.selectedSeats]); const renderSeatSections = () => {
        if (!sectionKeys.length) {
            return (
                <div className="text-center py-8">
                    <div className="text-sm text-gray-500">No seats available for this event</div>
                </div>
            );
        }

        return sectionKeys.map(sectionName => (
            <SeatSection
                key={sectionName}
                sectionName={sectionName}
                seats={groupedSeats[sectionName]}
                seatSelection={seatSelection}
                onSeatSelect={handleSelect}
            />
        ));
    };

    return (
        <div className="relative">
            <SeatMapHeader
                seatCount={seatSelection.totalSeats}
                maxSeats={maxSeatsPerBooking}
                totalCost={seatSelection.totalPrice}
            />

            {renderSeatSections()}

            <SeatMapLegend visible={sectionKeys.length > 0} />

            <TicketTypeModal
                ticketTypes={ticketTypes}
                onSelect={handleTicketTypeSelect}
                onClose={handleModalClose}
                pendingSeat={seatSelection.pendingSeat}
            />

            <SelectedSeatsWithPayment
                seats={seatSelection.selectedSeats}
                seatsBySection={seatsBySection}
                onRemove={seatSelection.removeSeat}
                onClear={seatSelection.clearAllSeats}
                totalPrice={seatSelection.totalPrice}
                eventId={Number(id)}
            />

            <PaymentModal />
        </div>
    );
}
