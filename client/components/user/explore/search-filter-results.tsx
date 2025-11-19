"use client";

import { useSearchParams } from "next/navigation";
import { useSearchAndFilterEvents } from "@/hooks/events/use-search-and-filter-events";
import EventCard from "../event-card";

export default function SearchFilterResults() {
    const params = useSearchParams();

    const q = params.get("q") || "";
    const category = params.get("category") || "";
    const date = params.get("date") || "";

    const { data, isFetching, isError } = useSearchAndFilterEvents({
        q,
        category,
        date,
    });

    console.log("SearchFilterResults data:", data);

    if (!q && !category && !date) {
        return <p className="text-slate-500">Apply a filter to see results.</p>;
    }

    if (isFetching)
        return <p className="text-slate-400">Loading events...</p>;

    if (isError)
        return <p className="text-red-500">Failed to load events</p>;

    if (!data?.data?.length) {
        console.log("No data found for the given filters:", { q, category, date });
        return <p className="text-gray-500">No events found.</p>;
    }

    return (
        <div className="w-full mt-6">
            <h1 className="text-lg text-gray-600 italic font-semibold">Search Results</h1>
            <div className="flex gap-y-6 flex-wrap justify-center md:justify-start mt-4 w-full gap-x-4">
                {data.data.map((event: any) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}
