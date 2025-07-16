'use client'

import { useParams, useRouter } from "next/navigation";
import SeatLayout from "../components/seat-layout";
import { useEventDetails } from "@/hooks/useEventDetails";


export default function BookASeat() {
    const { id } = useParams();
    const router = useRouter();
    const { eventDetails, isPending, isError, error }: {
        eventDetails: any,
        isPending: Boolean,
        isError: Boolean,
        error: any
    } = useEventDetails(id as string);


    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;
    const eventData = eventDetails.data;


    const onProceedToPayment = () => {
        router.push(`/dashboard/event/${id}/payment`)
    }

    return (
        <div>
            <SeatLayout eventId={eventData.id} ticketTypes={eventData.ticketTypes} venueId={eventData.venueId} onProceedToPayment={onProceedToPayment} />
        </div>
    )
}