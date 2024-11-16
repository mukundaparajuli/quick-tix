"use client"

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation"
import getWithAuth from "../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { BookSeat } from "./components";

export default function Page() {
    const { id } = useParams();
    const { data: session } = useSession();
    const { data } = useQuery({
        queryKey: ['event-info', id],
        queryFn: async () => {
            const result = await getWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event/${id}`, session);
            return result;
        }
    })
    console.log(data);
    return (
        <div>
            <div>Booking for {id}</div>
            {data && data.Section && <BookSeat seatLayout={data.Section} />}
        </div>
    )
}