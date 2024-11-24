
import { Socket, Server } from "socket.io";
import { lockSeat, UnlockSeat } from "../src/services";
import db from "../src/config/db";
import { SeatStatus } from "../src/enums";

export const lockseat = async (io: any, socket: Socket) => {

    const LOCK_TIMEOUT: number = Number(process.env.LOCK_TIMEOUT);

    socket.on("join-event", async (eventid) => {
        console.log("Event with " + eventid + " joined the event!");
        await socket.join(`event_${eventid}`)

        const sections = await db.section.findMany({
            where: {
                eventId: eventid
            },
            include: {
                rows: {
                    include: {
                        seats: true
                    }
                }
            }
        })

        socket.emit("seat-data", sections);
    })


    // LOCK THE SEAT
    socket.on("lock-seat", async (seatid, userid, eventid) => {
        const seat = await lockSeat(seatid, userid, eventid);

        setTimeout(() => {
            console.log("timeout")
        }, 5000)

        socket.emit('seat-updated', {
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

                io.to(`event_${eventid}`).emit('seat-updated', {
                    eventid,
                    seatid,
                    status: SeatStatus.AVAILABLE
                });
            }
        }, LOCK_TIMEOUT * 1000);

    })



    // UNLOCK THE SEAT
    socket.on("unlock-seat", async (seatid, userid, eventid) => {
        const unlockedseat = await UnlockSeat(seatid, userid, eventid);

        socket.emit('seat-updated', {
            eventid,
            seatid,
            status: unlockedseat.status
        });

    })
}