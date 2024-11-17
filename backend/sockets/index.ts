import { Server, Socket } from "socket.io"
import { lockSeat } from "./lock-seat";

export const initializeSocket = (io: any) => {
    return io.on("connection", async (socket: Socket) => {
        lockSeat(io, socket);
    })
}