import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SeatData {
    id: string;
    label: string;
    isBooked?: boolean;
    isSelected: boolean;
    isProcessing: boolean;
}

interface BookableSeatProps {
    seat: SeatData;
    onSelect: () => void;
    disabled: boolean;
}

const getSeatStyles = (seat: SeatData) => {
    if (seat.isBooked) return "bg-gray-400 text-white cursor-not-allowed";
    if (seat.isSelected) return "bg-gray-700 text-white ring-2 ring-gray-500";
    if (seat.isProcessing) return "bg-gray-500 text-white animate-pulse";
    return "bg-gray-200 hover:bg-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer text-gray-800";
};

const getAriaLabel = (label: string, seat: SeatData) => {
    const status = seat.isBooked ? 'booked' : seat.isSelected ? 'selected' : 'available';
    return `Seat ${label} (${status})`;
};

const handleKeyPress = (event: React.KeyboardEvent, onSelect: () => void, canSelect: boolean) => {
    if ((event.key === 'Enter' || event.key === ' ') && canSelect) {
        event.preventDefault();
        onSelect();
    }
};

export default function BookableSeatComponent({ seat, onSelect, disabled }: BookableSeatProps) {
    const { label, isBooked, isSelected, isProcessing } = seat;
    const canSelect = !disabled && !isBooked && !isProcessing;

    return (
        <div
            className={cn(
                "h-12 w-12 flex items-center justify-center rounded-sm relative",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1",
                getSeatStyles(seat),
                !canSelect && "opacity-60"
            )}
            onClick={canSelect ? onSelect : undefined}
            onKeyDown={(e) => handleKeyPress(e, onSelect, canSelect)}
            tabIndex={canSelect ? 0 : -1}
            role="button"
            aria-label={getAriaLabel(label, seat)}
            aria-pressed={isSelected}
            aria-disabled={disabled || isBooked}
        >
            {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
                <span className="text-xs font-medium truncate px-1">{label}</span>
            )}

            {isSelected && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gray-800 rounded-full border-2 border-white" />
            )}
        </div>
    );
}
