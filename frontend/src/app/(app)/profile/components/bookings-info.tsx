import { useEffect, useState } from "react"
import getWithAuth from "../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import BookingInfoCard from "./booking-info-card";

export default function BookingsInfo() {
    const [bookings, setBookings] = useState<any[] | null>(null);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { data: session } = useSession();



    const getBookings = async () => {
        const response = await getWithAuth(`${BACKEND_URL}/api/booking`, session);
        if (response) {
            setBookings(response);
            console.log("booking info=", response[0])
        }
    }


    useEffect(() => {
        toast.promise(getBookings, {
            loading: 'Loading...',
            success: 'Your bookings are here!',
            error: 'Error',
        });
    }, [])


    return (
        <div className="w-full content-center">
            {bookings && bookings.map((booking) => (
                <BookingInfoCard booking={booking} key={booking.id} />
            ))}
        </div>
    )
}