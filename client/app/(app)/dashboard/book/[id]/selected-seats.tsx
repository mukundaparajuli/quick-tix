import { X } from "lucide-react"; // optional icon for remove button
import { Button } from "@/components/ui/button";

type SelectedSeat = {
    id: number;
    label: string;
    ticketTypeId: number;
    ticketTypeName: string;
};


type Props = {
    selectedSeats: SelectedSeat[];
    onRemove: (seatId: number) => void;
};

export default function FloatingSelectedSeats({ selectedSeats, onRemove }: Props) {
    return (
        <div
            className="fixed bottom-4 right-4 z-50 w-64 bg-white shadow-lg rounded-lg p-4 border border-slate-200"
        >
            <h4 className="text-sm font-semibold mb-2">Selected Seats</h4>
            {selectedSeats.length === 0 ? (
                <div className="text-xs text-slate-500">No seats selected</div>
            ) : (
                <ul className="max-h-40 overflow-y-auto space-y-1">
                    {selectedSeats.map((seat) => (
                        <li
                            key={seat.id}
                            className="flex justify-between items-center text-sm border-b border-slate-200 pb-1"
                        >
                            <span>{seat.label} (Ticket: {seat.ticketTypeName})</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-1"
                                onClick={() => onRemove(seat.id)}
                            >
                                <X size={14} />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
