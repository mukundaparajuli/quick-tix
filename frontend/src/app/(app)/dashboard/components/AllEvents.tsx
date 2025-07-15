"use client";
import { useState } from "react";
import EventCard from "./EventCard";
import { useEvents } from "@/hooks/useEvents";

export default function AllEvents() {
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

    const { allEvents, isAllEventsError, isAllEventsPending } = useEvents();
    const eventsToDisplay = allEvents?.data;
    console.log(allEvents);
    return (
        <div className="p-5 bg-white dark:bg-gray-800 flex flex-col gap-4 h-full">
            <div>
                <h1 className="font-bold text-2xl text-black dark:text-white">All Events</h1>
                <p className="text-md text-gray-400">Find All Events</p>
            </div>



            {isAllEventsPending && <p className="text-gray-500">Loading...</p>}
            {isAllEventsError && (
                <p className="text-red-500">Error loading popular events. Please try again later.</p>
            )}

            {/* Display popular events in the form of cards */}
            <div className="flex overflow-x-scroll hide-scrollbar gap-8 h-full w-full">
                {Array.isArray(eventsToDisplay) && eventsToDisplay.map((event: any) => (
                    <div className="" key={event.id}>
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
}
