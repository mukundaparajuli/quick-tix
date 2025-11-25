import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PendingSeat } from "@/hooks/use-seat-selection";
import { TicketType } from "@/types/ticket-type";
import { useState } from "react";

interface TicketTypeModalProps {
    isOpen: boolean;
    pendingSeat: PendingSeat | null;
    ticketTypes?: TicketType[] | null;
    onComplete: (ticketTypeId: string, ticketTypeName: string, price: number) => void;
    onCancel: () => void;
}

export default function TicketTypeModal({
    isOpen,
    pendingSeat,
    ticketTypes,
    onComplete,
    onCancel
}: TicketTypeModalProps) {
    const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);

    const availableTicketTypes = ticketTypes?.filter(tt =>
        !tt.capacity || tt.sold < tt.capacity
    ) || [];

    const handleComplete = () => {
        if (!selectedTicketType) return;

        onComplete(
            String(selectedTicketType.id),
            selectedTicketType.name,
            selectedTicketType.price
        );
        setSelectedTicketType(null);
    };

    const handleCancel = () => {
        setSelectedTicketType(null);
        onCancel();
    };

    if (!pendingSeat) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-gray-900">
                        Select Ticket Type for Seat {pendingSeat.label}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        Section: {pendingSeat.sectionName}
                    </div>

                    {availableTicketTypes.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            No ticket types available
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {availableTicketTypes.map((ticketType) => (
                                <button
                                    key={ticketType.id}
                                    onClick={() => setSelectedTicketType(ticketType)}
                                    className={`
                                        w-full p-3 text-left border rounded-lg transition-colors
                                        ${selectedTicketType?.id === ticketType.id
                                            ? 'border-gray-600 bg-gray-100'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {ticketType.name}
                                            </div>
                                            {ticketType.description && (
                                                <div className="text-sm text-gray-600">
                                                    {ticketType.description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-semibold text-gray-900">
                                            ${ticketType.price.toFixed(2)}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleComplete}
                            disabled={!selectedTicketType}
                            className="flex-1"
                        >
                            Select Seat
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}