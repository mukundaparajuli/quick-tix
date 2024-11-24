import db from "../config/db"
import ApiError from "../types/api-error"

const LockSeat = async (seatid: number, userid: number, eventid: number) => {
    const seat = await db.seat.findUnique({
        where: {
            id: seatid,
            eventId: eventid,
            status: 'AVAILABLE'
        }
    })

    // if seat is not available throw error
    if (!seat) {
        return new ApiError(404, "Seat is not available for booking!");
    }

    const lockedSeat = await db.seat.update({
        where: { id: seatid },
        data: {
            status: "LOCKED",
            locked_by: userid
        },
    });

    console.log("seat has been locked", lockedSeat);
    return lockedSeat;
}

export default LockSeat;