import useEventStore from "@/stores/event-store"
import { TicketType } from "@/types/ticket-type";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { TicketTypeForm } from "./ticket-type-form";

export default function TicketTypes() {
    const [addNew, setAddNew] = useState<boolean>(false);
    const ticketTypes = useEventStore().ticketTypes;

    useEffect(() => {
        console.log(ticketTypes);
    }, [ticketTypes])

    return (
        <div>
            {!addNew && ticketTypes && ticketTypes.length > 0 &&
                (
                    <>
                        {ticketTypes.map((ticketType: TicketType) => (
                            <div key={ticketType.id}>
                                <h1>{ticketType.name}</h1>
                                <p>{ticketType.price}</p>
                            </div>
                        ))}
                        <Button variant="default" onClick={() => setAddNew(true)}> Add Ticket Type</Button>
                    </>

                )
            }
            {
                (addNew || !ticketTypes || ticketTypes?.length === 0) &&
                <TicketTypeForm onSuccess={() => setAddNew(false)} />
            }

        </div>
    )
}