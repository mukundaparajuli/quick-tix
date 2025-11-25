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

type Props = {
    ticketTypes: TicketType[] | null;
    onSelect: (ticketTypeId: number, ticketTypeName: string) => void;
};

export const TicketTypeModal = ({ ticketTypes, onSelect }: Props) => {
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useTicketTypeModal();
    const [selectedTicketType, setSelectedTicketType] = useState<number | null>(null);

    useEffect(() => setIsClient(true), []);

    if (!isClient) return null;

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold">Select Ticket Type</DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Select the ticket type for your seats to proceed with booking.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex w-full justify-center mt-4 mb-6">
                    <Select
                        onValueChange={(value) =>
                            setSelectedTicketType(Number(value))
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Ticket Type" />
                        </SelectTrigger>

                        <SelectContent>
                            {ticketTypes?.map((type) => (
                                <SelectItem key={type.id} value={String(type.id)}>
                                    {type.name} - ${type.price.toFixed(2)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                if (selectedTicketType !== null) {
                                    const selectedType = ticketTypes?.find(type => +type.id === selectedTicketType);
                                    if (selectedType) {
                                        onSelect(selectedTicketType, selectedType.name);
                                    }
                                    close();
                                }
                            }}
                            disabled={selectedTicketType === null}
                        >
                            Proceed to Book
                        </Button>

                        <Button
                            variant="primaryOutline"
                            className="w-full"
                            size="lg"
                            onClick={close}
                        >
                            No Thanks
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
