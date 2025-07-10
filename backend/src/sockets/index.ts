import { Server, Socket } from "socket.io"

export const initializeSocket = (io: Server) => {
    io.on("connection", async (socket: Socket) => {
        socket.on('joinEvent', (eventId: number) => {
            socket.join(`event-${eventId}`);
            console.log(`Client joined the event: ${eventId}`)
        })
    });

    async function broadcastSeatStatus(eventId: number, seatIds: number[], status: "RESERVED" | "BOOKED" | "AVAILABLE") {
        io.to(`event:${eventId}`).emit("seatStatusUpdate", { seatIds, status });
    }
}