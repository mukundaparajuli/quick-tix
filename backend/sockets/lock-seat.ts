
import { Socket, Server } from "socket.io";

export const lockSeat = async (io: any, socket: Socket) => {
    return socket.on("lock-seat", async (seatNumber) => {
        console.log("seat number " + seatNumber + "has been locked!")
    })
}