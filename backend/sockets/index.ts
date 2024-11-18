import { Server, Socket } from "socket.io"
import { lockseat } from "./lock-seat";

export const initializeSocket = (io: Server) => {
    io.on("connection", async (socket: Socket) => {
        console.log("connected!")
        lockseat(io, socket);
    })
}