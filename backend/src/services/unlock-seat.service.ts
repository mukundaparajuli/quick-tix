import db from "../config/db"
import ApiError from "../types/api-error"

const UnlockSeat = async (seatid: number, userid: number, eventid: number) => {
    console.log("seat id= ", seatid)
    const seat = await db.seat.findUnique({
        where: {
            id: seatid,
            eventId: eventid
        }
    })
    console.log(seat);
    console.log("userid=", userid)
    console.log("seat was locked by= ", seat?.locked_by)
    if (!(seat?.locked_by === userid)) {
        throw new ApiError(403, "Seat was locked by a different user")
    }

    if (!(seat?.status === 'LOCKED')) {
        throw new ApiError(400, "Seat was not locked")
    }


    // update the status to be AVAILABLE if the seat was locked and was locked by the same user
    const unlockedSeat = await db.seat.update({
        where: {
            id: seatid,
        },
        data: {
            status: 'AVAILABLE',
            locked_by: null
        }
    })

    return unlockedSeat;
}

export default UnlockSeat;