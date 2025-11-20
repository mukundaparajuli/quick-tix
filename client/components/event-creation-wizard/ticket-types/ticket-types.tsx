import useEventStore from "@/stores/event-store"
import { TicketType } from "@/types/ticket-type";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { TicketTypeForm } from "./ticket-type-form";
import DisplayTicketTypes from "./display-ticket-types";

export default function TicketTypes() {
    const [addNew, setAddNew] = useState<boolean>(false);
    const ticketTypes = useEventStore().ticketTypes;

    useEffect(() => {
        console.log(ticketTypes);
    }, [ticketTypes])

    return <DisplayTicketTypes
        addNew={addNew}
        setAddNew={setAddNew}
        ticketTypes={ticketTypes || []}
    />
}