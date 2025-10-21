import { Button } from "@/components/ui/button"
import SeatsForm from "./seats-form"
import DisplaySeats from "@/components/seats/display-seats"
import { useState } from "react"
import useEventStore from "@/stores/event-store"

export const Seats = () => {
    const [addSeats, setAddSeats] = useState(false)
    const seats = useEventStore((state) => state.seats);
    console.log("Seats Component Rendered", seats);
    return (
        <>
            {/* {!addSeats && ( */}
            <>
                <DisplaySeats seats={seats && seats.length > 0 ? seats : null} />
                <Button onClick={() => setAddSeats(true)}>Add Seats</Button>
            </>
            {/* )} */}
            {addSeats && <SeatsForm />}

        </>
    )
}