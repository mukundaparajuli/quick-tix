import { X, MapPin, Ticket, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentModal } from "@/stores/payment-store";

interface SelectedSeat {
    id: string;
    label: string;
    ticketTypeId: string;
    ticketTypeName: string;
    price: number;
    sectionId: number;
    sectionName: string;
}

interface FloatingSelectedSeatsProps {
    selectedSeats: SelectedSeat[];
    onRemove: (seatId: string) => void;
    totalCost: number;
    maxSeats: number;
}

const groupSeatsBySection = (seats: SelectedSeat[]) => {
    return seats.reduce((acc, seat) => {
        if (!acc[seat.sectionName]) {
            acc[seat.sectionName] = [];
        }
        acc[seat.sectionName].push(seat);
        return acc;
    }, {} as Record<string, SelectedSeat[]>);
};




export default function FloatingSelectedSeats({
    selectedSeats,
    onRemove,
    totalCost,
    maxSeats
}: FloatingSelectedSeatsProps) {
    if (!selectedSeats.length) return null;
    const { isOpen, open, close } = usePaymentModal();

    const groupedBySection = groupSeatsBySection(selectedSeats);
    const handleBooking = (selectedSeats: SelectedSeat[]) => {
        open();
        console.log("Booking seats:", selectedSeats);
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-700 text-white p-4">
                <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="h-5 w-5" />
                    <h4 className="font-semibold">Selected Seats</h4>
                </div>
                <div className="text-gray-300 text-sm">
                    {selectedSeats.length} of {maxSeats} seats selected
                </div>
            </div>

            <div className="p-4">
                <div className="max-h-60 overflow-y-auto space-y-3">
                    {Object.entries(groupedBySection).map(([sectionName, sectionSeats]) => (
                        <div key={sectionName}>
                            <div className="flex items-center gap-1 mb-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">{sectionName}</span>
                            </div>

                            <div className="space-y-2 ml-5">
                                {sectionSeats.map((seat) => (
                                    <div
                                        key={seat.id}
                                        className="flex items-center justify-between bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Ticket className="h-3 w-3 text-gray-500" />
                                                <span className="font-medium text-sm">{seat.label}</span>
                                            </div>
                                            <div className="text-xs text-gray-600 truncate">
                                                {seat.ticketTypeName}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-2">
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium text-sm">${seat.price.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 hover:bg-gray-200 hover:text-gray-800"
                                                onClick={() => onRemove(seat.id)}
                                                title={`Remove seat ${seat.label}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-800">${totalCost.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="primaryOutline"
                        size="sm"
                        className="flex-1"
                        onClick={() => selectedSeats.forEach(seat => onRemove(seat.id))}
                    >
                        Clear All
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleBooking(selectedSeats)}
                    >
                        Proceed
                    </Button>
                </div>
            </div>
        </div>
    );
}
