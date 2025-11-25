"use client";

import { redirect, useParams } from "next/navigation";
import useGetEventDetails from "@/hooks/events/use-get-event-details";
import { normalizeEvent } from "@/utils/normalize-event-details";

import EventInfo from "@/components/events/event-info";
import TicketTypesList from "@/components/events/ticket-types-list";
import FacilitiesList from "@/components/events/facilities-list";
import VenueDetails from "@/components/events/venue-details";
import SectionsList from "@/components/events/sections-list";
import DisplaySeats from "@/components/seats/display-seats";
import { Button } from "@/components/ui/button";

export default function EventDetailsPage() {
    const { id } = useParams();
    if (!id) return <div className="text-slate-500 text-center mt-10">No event ID provided</div>;

    const { data: eventDetails, isFetching } = useGetEventDetails({ eventId: +id });
    console.log("Fetched event details:", eventDetails);
    if (isFetching) {
        return <div className="text-slate-500 text-center mt-10">Loading event details...</div>;
    }

    const { event, ticketTypes, facilities, venue, sections, seats } = normalizeEvent(eventDetails?.data);

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
            <h1 className="text-3xl font-semibold text-slate-800 mb-6">Event Details</h1>

            <EventInfo event={event} />
            <Button variant={"primary"} onClick={() => redirect("/dashboard/book/" + event.id)}>Buy Tickets</Button>
            <TicketTypesList ticketTypes={ticketTypes} />
            <FacilitiesList facilities={facilities} />
            <VenueDetails venue={venue} />
            <SectionsList sections={sections} />
            <DisplaySeats seats={seats} sections={sections} />
        </div>
    );
}
