"use client";

import useGetAllEvents from "@/hooks/events/use-get-all-events";
import { Event } from "@/types/event";
import EventCard from "./event-card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/dist/client/link";

export const AllEvents = () => {
    const { data, isFetching, isError } = useGetAllEvents();
    const events: Event[] = data?.data || [];

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
        <section className="w-full px-4 py-10 relative">
            <div className="text-start mb-8">
                <h1 className="text-3xl font-bold text-slate-700">All Events</h1>
                <p className="text-slate-500 text-sm mt-2">
                    Discover all upcoming and ongoing events
                </p>
            </div>

            <Link href="/organizer/event/create" className="absolute top-10 right-8">
                <Button>+ Create Event</Button>
            </Link>

            <div className="flex flex-col gap-y-6 w-full">
                {events.length > 0 ? (
                    events.map((event: Event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="flex justify-center items-center text-slate-500 py-10">
                        No events found
                    </div>
                )}
            </div>
        </section>
    );
};
