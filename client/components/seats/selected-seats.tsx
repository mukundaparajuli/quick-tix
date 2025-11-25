import { SelectedSeat } from "@/hooks/use-seat-selection";
import { X } from "lucide-react";

interface SelectedSeatsProps {
    seats: SelectedSeat[];
    seatsBySection: Record<string, SelectedSeat[]>;
    onRemove: (seatId: string) => void;
    onClear: () => void;
    totalPrice: number;
}

export default function SelectedSeats({
    seats,
    seatsBySection,
    onRemove,
    onClear,
    totalPrice
}: SelectedSeatsProps) {
    if (seats.length === 0) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-700 text-white rounded-t-lg">
                    <h3 className="font-semibold">Selected Seats ({seats.length})</h3>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                        <button
                            onClick={onClear}
                            className="p-1 hover:bg-gray-600 rounded"
                            aria-label="Clear all seats"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="p-4 max-h-48 overflow-y-auto">
                    {Object.entries(seatsBySection).map(([sectionName, sectionSeats]) => (
                        <div key={sectionName} className="mb-3 last:mb-0">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">{sectionName}</h4>
                            <div className="space-y-1">
                                {sectionSeats.map((seat) => (
                                    <div key={seat.id} className="flex items-center justify-between py-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{seat.label}</span>
                                            <span className="text-xs text-gray-500">
                                                {seat.ticketTypeName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">
                                                ${seat.price.toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => onRemove(seat.id)}
                                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                aria-label={`Remove seat ${seat.label}`}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}