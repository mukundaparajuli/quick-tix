import { Seats } from "@/types/seat";
import { SelectedSeat } from "@/hooks/use-seat-selection";

interface SeatSelectionType {
    selectedSeats: SelectedSeat[];
    startSeatSelection: (seat: { id: string; label: string; sectionId: number; sectionName: string }) => void;
    isSeatSelected: (seatId: string) => boolean;
    isSeatProcessing: (seatId: string) => boolean;
}

interface SeatSectionProps {
    sectionName: string;
    seats: Seats[];
    seatSelection: SeatSelectionType;
}

const SeatButton = ({ seat, isSelected, isProcessing, onClick }: {
    seat: Seats;
    isSelected: boolean;
    isProcessing: boolean;
    onClick: () => void;
}) => {
    const isBooked = seat.isBooked;
    const isDisabled = isBooked || isProcessing;

    const getStyles = () => {
        // Match legend colors: available=emerald, selected=indigo, processing=amber, booked=red
        if (isBooked) return "bg-red-500 border-red-600 text-white cursor-not-allowed opacity-90";
        if (isSelected) return "bg-indigo-600 border-indigo-700 text-white";
        if (isProcessing) return "bg-amber-400 border-amber-500 animate-pulse cursor-wait";
        return "bg-emerald-400 border-emerald-500 hover:bg-emerald-500 cursor-pointer text-slate-800";
    };

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`
                w-8 h-8 text-xs font-medium border rounded
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500
                ${getStyles()}
            `}
            aria-label={`Seat ${seat.label} ${isBooked ? 'unavailable' : isSelected ? 'selected' : 'available'}`}
        >
            {seat.label}
        </button>
    );
};

export default function SeatSection({ sectionName, seats, seatSelection }: SeatSectionProps) {
    const { startSeatSelection, isSeatSelected, isSeatProcessing } = seatSelection;

    const letterGroups: Record<string, Seats[]> = {};
    seats.forEach((seat) => {
        const rawLabel = seat.label ?? "";
        const first = String(rawLabel).trim().charAt(0).toUpperCase() || "#";
        const letter = /[A-Z]/.test(first) ? first : "#";
        if (!letterGroups[letter]) letterGroups[letter] = [];
        letterGroups[letter].push(seat);
    });

    const letters = Object.keys(letterGroups).sort();

    const handleSeatClick = (seat: Seats) => {
        if (seat.isBooked || isSeatProcessing(seat.id)) return;

        startSeatSelection({
            id: seat.id,
            label: seat.label,
            sectionId: seat.sectionId,
            sectionName: sectionName,
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {sectionName}
            </h3>

            {letters.map((letter) => (
                <div key={letter} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">Row {letter}</h4>
                    <div className="flex gap-2 flex-wrap">
                        {letterGroups[letter]
                            .sort((a, b) =>
                                String(a.label).localeCompare(String(b.label), undefined, {
                                    numeric: true,
                                    sensitivity: "base",
                                })
                            )
                            .map((seat) => (
                                <SeatButton
                                    key={seat.id}
                                    seat={seat}
                                    isSelected={isSeatSelected(seat.id)}
                                    isProcessing={isSeatProcessing(seat.id)}
                                    onClick={() => handleSeatClick(seat)}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}