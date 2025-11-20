import { Button } from "@/components/ui/button"
import SeatsForm from "./seats-form"
import DisplaySeats from "@/components/seats/display-seats"
import { useState, useEffect } from "react"
import useEventStore from "@/stores/event-store"

export const Seats = () => {
    const [addSeats, setAddSeats] = useState(false);
    const seats = useEventStore((state) => state.seats);
    const sections = useEventStore((state) => state.sections);

    useEffect(() => {
        if (!addSeats) return;
        setAddSeats(false);
    }, [seats]);
    return (
        <>
            <DisplaySeats seats={seats} sections={sections} />
            <Button onClick={() => setAddSeats(true)}>Add Seats</Button>
            {addSeats && <SeatsForm />}
        </>
    )
}
