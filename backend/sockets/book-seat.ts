import { Socket } from "socket.io";

export const bookSeat = async (io: any, socket: Socket) => {
    socket.on('book-seat')
}