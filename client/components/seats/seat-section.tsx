import { Seats } from "@/types/seat";

interface SeatSectionProps {
    sectionName: string;
    seats: Seats[];
    seatSelection: any;
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
        if (isBooked) return "bg-gray-400 border-gray-500 cursor-not-allowed opacity-50";
        if (isSelected) return "bg-gray-700 border-gray-800 text-white";
        if (isProcessing) return "bg-gray-300 border-gray-400 animate-pulse cursor-wait";
        return "bg-gray-200 border-gray-300 hover:bg-gray-300 cursor-pointer";
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