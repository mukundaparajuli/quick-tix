import { FC } from "react";
import { Button } from "@/components/ui/button";
import { TicketTypeForm } from "./ticket-type-form";
import { TicketType } from "@/types/ticket-type";


interface DisplayTicketTypesProps {
    addNew: boolean;
    setAddNew: (value: boolean) => void;
    ticketTypes: TicketType[];
}

const DisplayTicketTypes: FC<DisplayTicketTypesProps> = ({
    addNew,
    setAddNew,
    ticketTypes,
}) => {
    if (addNew || !ticketTypes || ticketTypes.length === 0) {
        return <TicketTypeForm onSuccess={() => setAddNew(false)} />;
    }

    return (
        <div className="space-y-6 w-full max-w-xl">
            {ticketTypes.map((ticketType) => (
                <div
                    key={ticketType.id}
                    className=" rounded-xl p-4 bg-white flex justify-between items-center"
                >
                    <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {ticketType.name}
                        </h3>
                        <div className="pt-3 border-t text-sm text-gray-500 space-y-1">
                            <p className="text-gray-700">Price: ${ticketType.price}</p>
                        </div>
                    </div>
                </div>
            ))}

            <Button variant="default" onClick={() => setAddNew(true)}>
                Add Ticket Type
            </Button>
        </div>
    );
};

export default DisplayTicketTypes;
