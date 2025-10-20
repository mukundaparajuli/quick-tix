import { Button } from "@/components/ui/button"
import SeatsForm from "./seats-form"
import DisplaySeats from "@/components/seats/display-seats"
import { useState } from "react"

export const Seats = () => {
    const [addSeats, setAddSeats] = useState(false)
    return (
        <>
            <DisplaySeats />
            {addSeats && <SeatsForm />}
            <Button onClick={() => setAddSeats(true)}>Add Seats</Button>
        </>
    )
}