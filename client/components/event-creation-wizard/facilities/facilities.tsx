import useEventStore from "@/stores/event-store"
import { Facility } from "@/types/facility";
import { useState } from "react";
import { FacilityForm } from "./facility-form";
import { Button } from "../../ui/button";

export default function Facilities() {
    const [addFacility, setAddFacility] = useState<boolean>(false);
    const ticketTypes = useEventStore().ticketTypes;
    const facilities = useEventStore().facilities;

    if (!ticketTypes) {
        return <div>Please create a ticket type to create a facility</div>
    }

    return (
        <div>
            {!addFacility && ticketTypes.length > 0 &&
                <>
                    {ticketTypes.map((ticketType) => (
                        <div key={ticketType.id} className="text-left">
                            <h3 className="font-bold text-lg">{ticketType.name}</h3>
                            <ul>
                                {facilities && facilities.filter((facility: Facility) => facility.ticketTypeId === +ticketType.id).map((facility) => (
                                    <li key={facility.id}> - {facility.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <Button onClick={() => setAddFacility(true)} >Add new facility</Button>
                </>
            }
            {
                addFacility && <FacilityForm onSuccess={() => setAddFacility(false)} />
            }

        </div >
    )
}