"use client";

import useGetAllEvents from "@/hooks/events/use-get-all-events";
import EventSection from "./event-cat";
import ExploreCTA from "./explore-cta";
import { Event } from "@/types/event";

export default function EventsSection() {
    const { data, isFetching, isError } = useGetAllEvents();
    const events: (Event & { media: { url: string }[] })[] = data?.data || [];

    if (isFetching)
        return (
            <div className="flex justify-center items-center min-h-[40vh] text-slate-500">
                Loading events...
            </div>
        );

    if (isError)
        return (
            <div className="flex justify-center items-center min-h-[40vh] text-red-500">
                Error loading events
            </div>
        );
    return (
        <div className="border-1 my-2 rounded-sm p-2">
            <ExploreCTA />
            <EventSection title="Popular Events" events={events} />
            <EventSection title="Recently Added" events={events} />
            <EventSection title="Events Near You" events={events} />

        </div>
    )
}