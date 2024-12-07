"use client";
import { dummyEventData } from "@/constants/dummy-event-data";
import { popularEventMenu } from "@/constants/events-menu";
import { useState } from "react";
import EventCard from "./EventCard";
import { EventType } from "../../../../../types/eventType";
import { useQuery } from "@tanstack/react-query";

export default function PopularEvents() {
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const { data: fetchedEvents, isLoading, isError } = useQuery({
        queryKey: ["popular-events"],
        queryFn: async () => {
            const res = await fetch(`${baseUrl}/api/event/popular-events`, { method: "GET" });
            const data = await res.json();
            if (!res.ok || !data) {
                throw new Error("Failed to fetch popular events");
            }
            return data;
        },
    });

    // Derive the events to display, falling back to dummyEventData if needed
    const eventsToDisplay =
        Array.isArray(fetchedEvents?.data) && fetchedEvents.data.length > 0
            ? fetchedEvents.data
            : dummyEventData;

    return (
        <div className="p-5 bg-white dark:bg-gray-800 flex flex-col gap-4">
            <div>
                <h1 className="font-bold text-2xl text-black dark:text-white">Popular Events</h1>
                <p className="text-md text-gray-400">Find Popular Events</p>
            </div>

            {/* Options to filter popular events */}
            <div className="overflow-x-auto flex gap-2">
                {popularEventMenu.map((i) => (
                    <div
                        key={i.name}
                        onClick={() => setSelectedEvent(i.name)}
                        className={`px-4 border-2 border-slate-300 rounded-full p-2 text-center dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer transition-all duration-300 whitespace-nowrap ${selectedEvent === i.name
                            ? "dark:bg-white dark:text-black bg-black text-white"
                            : ""
                            }`}
                    >
                        {i.name}
                    </div>
                ))}
            </div>

            {isLoading && <p className="text-gray-500">Loading...</p>}
            {isError && (
                <p className="text-red-500">Error loading popular events. Please try again later.</p>
            )}

            {/* Display popular events in the form of cards */}
            <div className="flex flex-col overflow-x-clip flex-wrap gap-4 p-4 max-h-[400vh] overflow-y-auto">
                {Array.isArray(eventsToDisplay) && eventsToDisplay.map((event: EventType) => (
                    <div className="flex-3 basis-[calc(50%_-_1rem)] md:basis-[calc(25%_-_1rem)]" key={event.id}>
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
}
