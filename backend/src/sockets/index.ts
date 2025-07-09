import { Server, Socket } from "socket.io"
import db from "../config/db";

export const initializeSocket = (io: Server) => {
    io.on("connection", async (socket: Socket) => {
    })
}