import { FC } from "react";
import { Button } from "@/components/ui/button";
import { FacilityForm } from "./facility-form";
import { TicketType } from "@/types/ticket-type";
import { Facility } from "@/types/facility";


interface DisplayFacilitiesProps {
    addFacility: boolean;
    setAddFacility: (value: boolean) => void;
    ticketTypes: TicketType[];
    facilities: Facility[] | null;
}

const DisplayFacilities: FC<DisplayFacilitiesProps> = ({
    addFacility,
    setAddFacility,
    ticketTypes,
    facilities,
}) => {
    if (addFacility) {
        return <FacilityForm onSuccess={() => setAddFacility(false)} />;
    }

    if (ticketTypes.length === 0) {
        return <p className="text-gray-600">No ticket types available.</p>;
    }

    return (
        <div className="space-y-6 text-left">
            {ticketTypes.map((ticketType) => {
                const relatedFacilities = facilities?.filter(
                    (facility) => facility.ticketTypeId === Number(ticketType.id)
                );

                return (
                    <div
                        key={ticketType.id}
                        className="p-4 bg-white space-y-3 text-left"
                    >
                        <h3 className="font-bold text-lg text-gray-900">
                            {ticketType.name}
                        </h3>

                        {relatedFacilities && relatedFacilities.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {relatedFacilities.map((facility) => (
                                    <li key={facility.id}>{facility.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">No facilities added yet.</p>
                        )}
                    </div>
                );
            })}

            <Button onClick={() => setAddFacility(true)}>Add new facility</Button>
        </div>
    );
};

export default DisplayFacilities;
