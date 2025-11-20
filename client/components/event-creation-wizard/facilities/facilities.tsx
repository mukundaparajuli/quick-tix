import useEventStore from "@/stores/event-store"
import { Facility } from "@/types/facility";
import { useState } from "react";
import { FacilityForm } from "./facility-form";
import { Button } from "../../ui/button";
import DisplayFacilities from "./display-facilities";

export default function Facilities() {
    const [addFacility, setAddFacility] = useState<boolean>(false);
    const ticketTypes = useEventStore().ticketTypes;
    const facilities = useEventStore().facilities;

    if (!ticketTypes) {
        return <div>Please create a ticket type to create a facility</div>
    }

    return (
        <DisplayFacilities
            addFacility={addFacility}
            setAddFacility={setAddFacility}
            ticketTypes={ticketTypes}
            facilities={facilities}
        />
    )
}