"use client";

import { useQuery } from "@tanstack/react-query";
import getWithAuth from "../../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { EventDetailsPage } from "./components";

export default function EventDetail() {
    const { data: session } = useSession();
    const { id } = useParams();

    const { data, error, isLoading } = useQuery({
        queryKey: ["event-detail", id],
        queryFn: async () => {
            if (!id || !session) throw new Error("Invalid request");
            const result = await getWithAuth(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/event/${id}`,
                session
            );
            return result;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {data ? (
                <EventDetailsPage event={data} />
            ) : (
                <div>No event details available.</div>
            )}
        </div>
    );
}
