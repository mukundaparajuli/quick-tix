import { Server, Socket } from "socket.io";
import { Attendee, Seat } from "../types/types";
import { bookSeat } from "../services";
import db from "../config/db";
import ApiError from "../types/api-error";

export const bookseat = async (io: Server, socket: Socket) => {
    socket.on("book-seat", async (eventid: number, seats: Seat[], userid: number) => {
        try {
            // Validate input
            if (!userid) {
                socket.emit("error", { message: "User ID is unavailable" });
                return;
            }

            const user = await db.user.findUnique({ where: { id: userid } });

            if (!user) {
                socket.emit("error", { message: "User not found" });
                return;
            }

            // Book the seat
            const paymentResult = await bookSeat(eventid, seats, user as Attendee);
            console.log("seat=", paymentResult);
            const number = io.to(`event_${eventid}`).emit("payment-page", { paymentResult });
            console.log(number);



        } catch (error) {
            console.error("Error booking seat:", error);

            // Emit error to the client
            socket.emit("error", { message: "Failed to book the seat" });
        }
    });
};
