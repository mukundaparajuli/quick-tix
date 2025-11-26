"use client";

import EventCard from "./event-card";
import { Event } from "@/types/event";

interface EventSectionProps {
    title: string;
    events: (Event & { media: { url: string }[] })[];
}

export default function EventSection({ title, events }: EventSectionProps) {
    return (
        <div className="my-6">
            <h2 className="text-xl text-start md:text-2xl font-semibold mb-4">{title}</h2>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {events.map((event) => (
                    <div key={event.id} className="flex gap-4">
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
}
