"use client"

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation"
import getWithAuth from "../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { BookSeat } from "./components";

export default function Page() {
    const { id } = useParams();
    const { data: session } = useSession();
    const { data, isLoading } = useQuery({
        queryKey: ['event-info', id],
        queryFn: async () => {
            const result = await getWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/${id}`, session);
            return result;
        }
    })
    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <div>Booking for {id}</div>
            {data && data.Section && <BookSeat seatLayout={data.Section} eventId={data.eventId} />}
        </div>
    )
}