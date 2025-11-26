"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTicketTypeModal } from "@/stores/select-tickettype-store";
import { TicketType } from "@/types/ticket-type";
import { useEffect, useState } from "react";
import { MapPin, Users, DollarSign } from "lucide-react";

interface PendingSeat {
    id: string;
    label: string;
    sectionId: number;
    sectionName: string;
}

interface TicketTypeModalProps {
    ticketTypes: TicketType[] | null;
    onSelect: (ticketTypeId: string, ticketTypeName: string) => void;
    onClose?: () => void;
    pendingSeat?: PendingSeat | null;
}

const getAvailableTickets = (type: TicketType) => {
    return (type.capacity || Infinity) - type.sold;
};

const isSoldOut = (type: TicketType) => {
    return type.capacity ? type.sold >= type.capacity : false;
};

export const TicketTypeModal = ({
    ticketTypes,
    onSelect,
    onClose,
    pendingSeat
}: TicketTypeModalProps) => {
    const [isClient, setIsClient] = useState(false);
    const { isOpen } = useTicketTypeModal();
    const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (isOpen) setSelectedTicketType(null);
    }, [isOpen]);

    const handleClose = () => {
        setSelectedTicketType(null);
        onClose?.();
    };

    const handleConfirm = () => {
        if (!selectedTicketType) return;

        const selectedType = ticketTypes?.find(type => type.id === selectedTicketType);
        if (selectedType) {
            onSelect(selectedTicketType, selectedType.name);
        }
    };

    const selectedTicketTypeData = ticketTypes?.find(type => type.id === selectedTicketType);

    if (!isClient) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-xl text-gray-900">
                        Select Ticket Type
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-gray-600">
                        Choose the ticket type for your selected seat.
                    </DialogDescription>
                </DialogHeader>

                {pendingSeat && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Selected Seat</span>
                        </div>
                        <div className="mt-1 text-gray-900">
                            <span className="font-bold">{pendingSeat.label}</span> in {pendingSeat.sectionName}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Available Ticket Types
                        </label>
                        <Select
                            onValueChange={setSelectedTicketType}
                            value={selectedTicketType || undefined}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a ticket type" />
                            </SelectTrigger>

                            <SelectContent>
                                {ticketTypes?.map((type) => {
                                    const available = getAvailableTickets(type);
                                    const soldOut = isSoldOut(type);

                                    return (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id}
                                            disabled={soldOut}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{type.name}</span>
                                                    {type.description && (
                                                        <span className="text-xs text-gray-500">{type.description}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <span className="font-bold">${type.price.toFixed(2)}</span>
                                                    {type.capacity && (
                                                        <span className="text-xs text-gray-500">
                                                            ({available} left)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedTicketTypeData && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">Selected Ticket</h4>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-600" />
                                    <span>Price: <strong>${selectedTicketTypeData.price.toFixed(2)}</strong></span>
                                </div>
                                {selectedTicketTypeData.capacity && (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-gray-600" />
                                        <span>
                                            Available: <strong>
                                                {getAvailableTickets(selectedTicketTypeData)}
                                            </strong> of {selectedTicketTypeData.capacity}
                                        </span>
                                    </div>
                                )}
                                {selectedTicketTypeData.description && (
                                    <p className="text-gray-600 italic">{selectedTicketTypeData.description}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <div className="flex flex-col gap-y-3 w-full">
                        <Button
                            variant="default"
                            className="w-full"
                            size="lg"
                            onClick={handleConfirm}
                            disabled={!selectedTicketType}
                        >
                            {selectedTicketTypeData
                                ? `Confirm - $${selectedTicketTypeData.price.toFixed(2)}`
                                : "Select a ticket type"
                            }
                        </Button>

                        <Button
                            variant="primaryOutline"
                            className="w-full"
                            size="lg"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
