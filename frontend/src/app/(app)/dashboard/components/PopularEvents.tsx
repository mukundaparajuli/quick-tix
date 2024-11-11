"use client"
import { dummyEventData } from "@/constants/dummy-event-data";
import { popularEventMenu } from "@/constants/events-menu";
import { useState } from "react";
import EventCard from "./EventCard";

export default function PopularEvents() {
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    return (
        <div className="p-5 bg-white dark:bg-black flex flex-col gap-4">
            {/* popular events text */}
            <div>
                <h1 className="font-bold text-2xl text-black dark:text-white">Popular Events</h1>
                <p className="text-md text-gray-400">Find Popular Events</p>
            </div>
            {/* find popular events by these options */}
            <div className="overflow-x-auto flex gap-2 ">
                {
                    popularEventMenu.map((i) => (
                        <div
                            key={i.name}
                            onClick={() => setSelectedEvent(i.name)}
                            className={`px-4 border-2 border-slate-300 rounded-full p-2 text-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer transition-all duration-300 whitespace-nowrap ${selectedEvent === i.name ? 'dark:bg-white dark:text-black bg-black text-white' : ''}`}
                        >
                            {i.name}
                        </div>
                    ))
                }
            </div>

            {/* display popular events in the form of card */}
            <div className="flex gap-4 p-4 overflow-x-auto ">
                {dummyEventData.map((event) => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
        </div>
    )
}
