"use client";

import { useQuery } from "@tanstack/react-query";
import getWithAuth from "../../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { EventDetailsPage } from "./components";
import { useEventDetails } from "@/hooks/useEventDetails";
import { Event } from "./types";

export default function EventDetail() {
    const { id } = useParams();
    const { eventDetails, isPending, isError, error }: {
        eventDetails: any,
        isPending: Boolean,
        isError: Boolean,
        error: any
    } = useEventDetails(id as string);


    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;
    const eventData = eventDetails.data;
    return (
        <div>
            {eventDetails ? (
                <EventDetailsPage event={eventData} />
            ) : (
                <div>No event details available.</div>
            )}
        </div>
    );
}
