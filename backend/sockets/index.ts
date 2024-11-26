import { Server, Socket } from "socket.io"
import { lockseat } from "./lock-seat";
import db from "../src/config/db";

export const initializeSocket = (io: Server) => {
    io.on("connection", async (socket: Socket) => {
        console.log("connected!");

        // join event
        socket.on("join-event", async (eventid) => {
            console.log(`Event ${eventid} joined!`);
            await socket.join(`event_${eventid}`);
            const sections = await db.section.findMany({
                where: { eventId: eventid },
                include: {
                    rows: { include: { seats: true } }
                }
            });

            socket.emit("seat-data", sections);
        });


        lockseat(io, socket);
    })
}