import { Seats } from "@/types/seat";
import BookableSeatComponent from "../bookable-seat-component";

interface SeatSectionProps {
    sectionName: string;
    seats: Seats[];
    seatSelection: {
        isSeatSelected: (seatId: string) => boolean;
        isSeatProcessing: (seatId: string) => boolean;
    };
    onSeatSelect: (seatId: string, seatLabel: string) => void;
}

const groupSeatsByRow = (seats: Seats[]) => {
    const letterGroups: Record<string, Seats[]> = {};

    seats.forEach((seat) => {
        const rawLabel = seat.label ?? "";
        const first = String(rawLabel).trim().charAt(0).toUpperCase() || "#";
        const letter = /[A-Z]/.test(first) ? first : "#";
        if (!letterGroups[letter]) letterGroups[letter] = [];
        letterGroups[letter].push(seat);
    });

    return letterGroups;
};

const sortSeats = (seats: Seats[]) => {
    return seats.sort((a, b) =>
        String(a.label).localeCompare(String(b.label), undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );
};

export default function SeatSection({
    sectionName,
    seats,
    seatSelection,
    onSeatSelect
}: SeatSectionProps) {
    const letterGroups = groupSeatsByRow(seats);
    const letters = Object.keys(letterGroups).sort();

    return (
        <div className="mb-6">
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    {sectionName}
                    <span className="text-xs text-gray-500 font-normal">
                        ({seats.length} seats)
                    </span>
                </h3>
            </div>

            {letters.map((letter) => (
                <div key={letter} className="mb-3">
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {sortSeats(letterGroups[letter]).map((seat) => {
                            const isSelected = seatSelection.isSeatSelected(seat.id);
                            const isProcessing = seatSelection.isSeatProcessing(seat.id);
                            const isDisabled = isSelected || seat.isBooked || isProcessing;

                            return (
                                <BookableSeatComponent
                                    key={seat.id}
                                    seat={{
                                        id: seat.id,
                                        label: seat.label,
                                        isBooked: seat.isBooked,
                                        isSelected,
                                        isProcessing
                                    }}
                                    onSelect={() => onSeatSelect(seat.id, seat.label)}
                                    disabled={isDisabled}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}