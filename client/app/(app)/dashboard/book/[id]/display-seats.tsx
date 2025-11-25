import { useState } from "react";
import { Seats } from "@/types/seat";
import { Section } from "@/types/section";
import BookableSeatComponent from "./bookable-seat-component";
import { TicketType } from "@/types/ticket-type";
import { useTicketTypeModal } from "@/stores/select-tickettype-store";
import { TicketTypeModal } from "./ticket-type-modal";
import FloatingSelectedSeats from "./selected-seats";

type Props = {
    seats: Seats[] | null;
    sections?: Section[] | null;
    ticketTypes: TicketType[] | null;
};

type SelectedSeat = {
    id: number;
    label: string;
    ticketTypeId: number;
    ticketTypeName: string;
};

export default function DisplaySeats({ seats, sections, ticketTypes }: Props) {
    const { isOpen, open, close } = useTicketTypeModal();
    const availableSeats: Seats[] = seats ?? [];

    // State for selected seats
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

    // Temporarily store the seat being selected while waiting for ticket type
    const [currentSeat, setCurrentSeat] = useState<{ id: number; label: string } | null>(null);

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

    const sectionKeys = Object.keys(groupedSeats).sort();

    // When a seat is clicked, open modal and store the seat temporarily
    const handleSelect = (seatId: number, seatLabel: string) => {
        setCurrentSeat({ id: seatId, label: seatLabel });
        open();
    };

    // When ticket type is selected, finalize seat selection
    const handleTicketTypeSelect = (ticketTypeId: number, ticketTypeName: string) => {
        if (!currentSeat) return;

        setSelectedSeats((prev) => [
            ...prev,
            {
                id: currentSeat.id,
                label: currentSeat.label,
                ticketTypeId,
                ticketTypeName,
            },
        ]);

        setCurrentSeat(null);
        close();
    };

    const handleRemoveSeat = (seatId: number) => {
        setSelectedSeats((prev) => prev.filter((seat) => seat.id !== seatId));
    };

    return (
        <div>
            <h2 className="text-lg font-medium mb-3">Available Seats</h2>
            {sectionKeys.length === 0 && (
                <div className="text-sm text-slate-500">No seats available</div>
            )}

            {sectionKeys.map((sectionName) => {
                const letterGroups: Record<string, Seats[]> = {};
                groupedSeats[sectionName].forEach((seat) => {
                    const rawLabel = seat.label ?? "";
                    const first = String(rawLabel).trim().charAt(0).toUpperCase() || "#";
                    const letter = /[A-Z]/.test(first) ? first : "#";
                    if (!letterGroups[letter]) letterGroups[letter] = [];
                    letterGroups[letter].push(seat);
                });

                const letters = Object.keys(letterGroups).sort();

                return (
                    <div key={sectionName} className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">{sectionName}</h3>

                        {letters.map((letter) => (
                            <div key={letter} className="mb-3">
                                <div className="flex gap-2 mb-2 flex-nowrap overflow-x-auto">
                                    {letterGroups[letter]
                                        .sort((a, b) =>
                                            String(a.label).localeCompare(String(b.label), undefined, {
                                                numeric: true,
                                                sensitivity: "base",
                                            })
                                        )
                                        .map((seat) => (
                                            <BookableSeatComponent
                                                key={seat.id}
                                                label={seat.label}
                                                onSelect={() => handleSelect(+seat.id, seat.label)}
                                            />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}

            {/* Ticket Type Modal */}
            <TicketTypeModal ticketTypes={ticketTypes} onSelect={handleTicketTypeSelect} />

            <FloatingSelectedSeats selectedSeats={selectedSeats} onRemove={handleRemoveSeat} />
        </div>
    );
}
