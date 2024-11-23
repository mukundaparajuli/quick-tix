import db from "../config/db"
import ApiError from "../types/api-error"

const LockSeat = async (seatid: number, eventid: number, userid: number) => {
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
        },
    });

    console.log("seat has been locked");
    return lockedSeat;
}

export default LockSeat;