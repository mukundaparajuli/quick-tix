import { Socket } from "socket.io";
import { lockSeat, UnlockSeat } from "../services";
import db from "../config/db";
import { SeatStatus } from "../enums";

export const lockseat = async (io: any, socket: Socket) => {
    const LOCK_TIMEOUT: number = Number(process.env.LOCK_TIMEOUT);

    // Lock the seat
    socket.on("lock-seat", async (seatid: number, userid: number, eventid: number) => {
        try {
            const seat = await lockSeat(seatid, userid, eventid);

            // Emit lock confirmation to the specific user
            socket.emit("lock-confirmed", true, seatid);


            console.log("seat-updated is about to be emitted...")
            // Notify all users about the seat being locked
            io.to(`event_${eventid}`).emit("seat-updated", {
                seatid,
                userid,
                status: SeatStatus.LOCKED
            });
            console.log("seat-updated has been emitted...")

            // Automatically release the seat after the timeout
            setTimeout(async () => {
                const lockedSeat = await db.seat.findFirst({
                    where: {
                        id: seatid,
                        status: SeatStatus.LOCKED,
                        locked_by: userid
                    }
                });

                if (lockedSeat) {
                    await db.seat.update({
                        where: { id: seatid },
                        data: {
                            status: SeatStatus.AVAILABLE,
                            locked_by: null,
                            locked_at: null
                        }
                    });

                    io.to(`event_${eventid}`).emit("seat-unlocked", {
                        seatid,
                        userid,
                        status: SeatStatus.AVAILABLE
                    });
                }
            }, LOCK_TIMEOUT * 1000);
        } catch (error) {
            console.error("Error locking seat:", error);
            socket.emit("lock-confirmed", { success: false, seatId: seatid });
        }
    });


    // Unlock the seat
    socket.on("unlock-seat", async (seatid: number, userid: number, eventid: number) => {
        try {
            const unlockedSeat = await UnlockSeat(seatid, userid, eventid);

            // Notify all users about the seat being unlocked
            io.to(`event_${eventid}`).emit("seat-updated", {
                seatid,
                userid,
                status: unlockedSeat.status
            });
        } catch (error) {
            console.error("Error unlocking seat:", error);
        }
    });
};
