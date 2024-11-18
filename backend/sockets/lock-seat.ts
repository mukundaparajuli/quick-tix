
import { Socket, Server } from "socket.io";
import { lockSeat } from "../src/services";
import db from "../src/config/db";
import { SeatStatus } from "../src/enums";

export const lockseat = async (io: any, socket: Socket) => {

    const LOCK_TIMEOUT: number = Number(process.env.LOCK_TIMEOUT);

    socket.on("join-event", async (eventid) => {
        socket.join(`event_${eventid}`)

        const seats = await db.seat.findMany({
            where: {
                eventId: eventid
            }
        })

        socket.emit("seat-data", seats);
    })
    socket.on("lock-seat", async (seatid, eventid, userid) => {
        const seat = await lockSeat(seatid, eventid, userid);

        io.to(`event_${eventid}`).emit('seatUpdated', {
            eventid,
            seatid,
            status: SeatStatus.LOCKED
        });


        // release the seat after the lock time
        setTimeout(async () => {

            const lockedSeat = await db.seat.findFirst({
                where: {
                    id: seatid,
                    status: SeatStatus.LOCKED,
                    locked_by: userid
                }
            })

            // if seat has been locked then
            if (lockedSeat) {
                await db.seat.update({
                    where: { id: seatid },
                    data: {
                        status: SeatStatus.AVAILABLE,
                        locked_by: null,
                        locked_at: null
                    }
                });

                io.to(`event_${eventid}`).emit('seatUpdated', {
                    eventid,
                    seatid,
                    status: SeatStatus.AVAILABLE
                });
            }
        }, LOCK_TIMEOUT * 1000);

    })
}