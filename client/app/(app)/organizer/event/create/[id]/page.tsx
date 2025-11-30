"use client";

import { MultiStepEventForm } from "@/components/event-creation-wizard/multi-step-form";
import useGetEventDetails from "@/hooks/events/use-get-event-details";
import useEventStore from "@/stores/event-store";
import { normalizeEvent } from "@/utils/normalize-event-details";
import { useParams } from "next/navigation";

export default function CreateEventPage() {
    const { id } = useParams();
    const eventId = id ? +id : 0;
    const { data: eventDetails, isFetching } = useGetEventDetails({ eventId });

    if (!id) return null;

    if (isFetching) {
        return <div>Loading event details...</div>;
    }
    console.log(eventDetails);
    const { event, ticketTypes, facilities, venue, sections } = normalizeEvent(eventDetails?.data);
    console.log(eventDetails?.data);
    const store = useEventStore.getState();

    store.setEvent(event);
    store.setTicketTypes(ticketTypes);
    store.setFacilities(facilities);
    store.setVenue(venue);
    store.setSections(sections);
    return (
        <div className="p-4 text-center w-3xl max-w-screen mx-auto">
            <MultiStepEventForm />
        </div>
    );
}
