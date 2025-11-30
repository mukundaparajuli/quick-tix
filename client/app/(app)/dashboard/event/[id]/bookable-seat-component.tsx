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
    if (seat.isBooked) return "bg-red-500 text-white cursor-not-allowed border border-red-600";
    if (seat.isSelected) return "bg-indigo-600 text-white ring-2 ring-indigo-700";
    if (seat.isProcessing) return "bg-amber-400 text-slate-800 animate-pulse border border-amber-500";
    return "bg-emerald-400 text-slate-900 hover:bg-emerald-500 hover:shadow-sm transition-all duration-200 cursor-pointer border border-emerald-500";
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
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
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
                // For processing state, use a darker icon so it shows on amber background
                <Loader2 className={`h-4 w-4 animate-spin ${seat.isProcessing ? 'text-slate-800' : 'text-white'}`} />
            ) : (
                <span className="text-xs font-medium truncate px-1">{label}</span>
            )}

            {isSelected && (
                // Small indicator for selection; use a white dot with indigo border so it contrasts on indigo background
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-indigo-700" />
            )}
        </div>
    );
}
