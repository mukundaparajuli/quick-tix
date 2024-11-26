import db from "../config/db";
import { BookingStatus, Role } from "../enums";
import logger from "../logger";
import ApiError from "../types/api-error";
import ApiResponse from "../types/api-response";
import { Attendee, Seat, User } from "../types/types";
import initiateKhaltiPayment from "./khalti-payment.service";


const bookSeat = (eventId: number, seats: Seat[], user: Attendee) => {



    return await db.$transaction(async (tx) => {


        if (!user) {
            throw new ApiError(404, "User not found!");
        }

        const userId: number = user.id;

        if (user.role !== Role.ATTENDEE) {
            throw new ApiError(403, "You are not authorized to perform this action");
        }


        const event = await tx.event.findUnique({
            where: { id: Number(eventId) },
        });

        if (!event) {
            return new ApiError(404, "Event not found!");
        }


        if (seats.length < 1) {
            throw new ApiError(400, "At least one seat must be selected");
        }

        if (seats.length >= event.availableTickets) {
            throw new ApiError(403, "Not enough available tickets");
        }

        const totalPrice = seats.length * event.price;
        logger.info("Booking is about to be made");

        const booking = await tx.booking.create({
            data: {
                eventId: event.id,
                userId: userId,
                ticketCounts: seats.length,
                totalPrice: totalPrice,
                status: BookingStatus.PENDING,
                seats: {
                    connect: seats.map((seat) => ({ id: seat.id })),
                },
            },
            include: {
                event: { select: { id: true, title: true, description: true, category: true } },
                user: { select: { id: true, username: true, email: true, fullName: true } },
                seats: { select: { id: true, seatId: true } },
            },
        });

        if (!booking) {
            throw new ApiError(500, "Booking Unsuccessful!");
        }

        const result = await initiateKhaltiPayment(booking.id, user);

        return new ApiResponse(
            res,
            200,
            "Payment initiated successfully",
            {
                booking: result.booking,
                paymentUrl: result.paymentUrl,
            },
            null
        );
    });
});

}

export default bookSeat;
