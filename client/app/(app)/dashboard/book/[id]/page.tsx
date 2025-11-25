"use client"

import useGetEventDetails from "@/hooks/events/use-get-event-details";
import { normalizeEvent } from "@/utils/normalize-event-details";
import { useParams } from "next/navigation";
import DisplaySeats from "./display-seats";
import { TicketTypeModal } from "./ticket-type-modal";

export default function BookEventPage() {
    const { id } = useParams();
    if (!id) return <div className="text-slate-500 text-center mt-10">No event ID provided</div>;

    const { data: eventDetails, isFetching } = useGetEventDetails({ eventId: +id });
    console.log("Fetched event details:", eventDetails);
    if (isFetching) {
        return <div className="text-slate-500 text-center mt-10">Loading event details...</div>;
    }

    const { sections, seats, ticketTypes } = normalizeEvent(eventDetails?.data);

    return (
        <div className="text-slate-500 text-center mt-10">
            Booking page is under construction.
            <DisplaySeats seats={seats} sections={sections} ticketTypes={ticketTypes} />

        </div>
    );
}