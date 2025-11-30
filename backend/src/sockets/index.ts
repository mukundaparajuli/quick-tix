import { Server, Socket } from "socket.io"

// A simple broadcaster object that will be populated when sockets are initialized.
// Controllers/services can import this object and call broadcastSeatStatus without
// creating circular dependencies on the top-level `io` export.
export const broadcaster: {
    broadcastSeatStatus?: (eventId: number, seatIds: number[], status: "RESERVED" | "BOOKED" | "AVAILABLE") => void;
} = {};

export const initializeSocket = (io: Server) => {
    io.on("connection", async (socket: Socket) => {
        socket.on('joinEvent', (eventId: number) => {
            socket.join(`event:${eventId}`);
            console.log(`Client joined the event: ${eventId}`)
        })
    });

    function broadcastSeatStatus(eventId: number, seatIds: number[], status: "RESERVED" | "BOOKED" | "AVAILABLE") {
        io.to(`event:${eventId}`).emit("seatStatusUpdate", { seatIds, status });
    }

    broadcaster.broadcastSeatStatus = broadcastSeatStatus;

    return { broadcastSeatStatus };
}