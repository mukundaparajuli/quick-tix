import { Button } from "@/components/ui/button"
import SeatsForm from "./seats-form"
import DisplaySeats from "@/components/seats/display-seats"
import { useState, useEffect } from "react"
import useEventStore from "@/stores/event-store"

export const Seats = () => {
    const [addSeats, setAddSeats] = useState(false);
    const seats = useEventStore((state) => state.seats);

    useEffect(() => {
        if (!addSeats) return;
        setAddSeats(false);
    }, [seats]);
    return (
        <>
            <DisplaySeats seats={seats} />
            <Button onClick={() => setAddSeats(true)}>Add Seats</Button>
            {addSeats && <SeatsForm />}
        </>
    )
}
