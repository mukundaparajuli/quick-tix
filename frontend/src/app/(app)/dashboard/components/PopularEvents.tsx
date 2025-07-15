"use client";
import { useState } from "react";
import EventCard from "./EventCard";
import { useEvents } from "@/hooks/useEvents";

export default function PopularEvents() {
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

    const { isPopularLoading, isPopularError, popularEvents } = useEvents();

    return (
        <div className="p-5 bg-white dark:bg-gray-800 flex flex-col gap-4 h-full">
            <div>
                <h1 className="font-bold text-2xl text-black dark:text-white">Popular Events</h1>
                <p className="text-md text-gray-400">Find Popular Events</p>
            </div>

            {/* Options to filter popular events */}
            <div className="overflow-x-auto flex gap-2">
                {popularEvents && Array.isArray(popularEvents) && popularEvents.map((i: any) => (
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

            {isPopularLoading && <p className="text-gray-500">Loading...</p>}
            {isPopularError && (
                <p className="text-red-500">Error loading popular events. Please try again later.</p>
            )}

            {/* Display popular events in the form of cards */}
            <div className="flex overflow-x-scroll hide-scrollbar gap-8 h-full w-full">
                {Array.isArray(popularEvents) && popularEvents.map((event: any) => (
                    <div className="" key={event.id}>
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
}
