import db from "../config/db";
import { PaymentMethod, Role } from "../enums";
import logger from "../logger";
import ApiError from "../types/api-error";
import { Attendee, Seat } from "../types/types";
import esewaPaymentInitialization from "./esewa-payment.service";
import initiateKhaltiPayment from "./khalti-payment.service";

// Main Function
const bookSeat = async (
    eventId: number,
    seats: Seat[],
    user: Attendee,
    method: PaymentMethod
): Promise<{ booking: any; paymentUrl: string }> => {
    if (!user) throw new ApiError(404, "User not found!");
    if (user.role !== Role.ATTENDEE) throw new ApiError(403, "Unauthorized action");

    return await db.$transaction(async (tx) => {
        const event = await validateEvent(tx, eventId);
        const validSeats = await validateSeats(tx, eventId, seats);
        const booking = await createBooking(tx, event, user, validSeats);

        logger.info("Booking created, initiating payment", { bookingId: booking.id });

        const paymentUrl = await initiatePayment(tx, booking, method, user);

        return { booking, paymentUrl };
    });
};

// Helper Functions
const validateEvent = async (tx: any, eventId: number): Promise<any> => {
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(404, "Event not found!");
    return event;
};

const validateSeats = async (
    tx: any,
    eventId: number,
    seats: Seat[]
): Promise<Seat[]> => {
    const seatIds = seats.map((seat) => seat.id);
    const availableSeats = await tx.seat.findMany({
        where: {
            id: { in: seatIds },
            eventId: eventId,
            isBooked: false,
        },
    });

    if (availableSeats.length !== seats.length) {
        throw new ApiError(400, "One or more seats are invalid or already booked");
    }

    return availableSeats;
};

const createBooking = async (
    tx: any,
    event: any,
    user: Attendee,
    seats: Seat[]
): Promise<any> => {
    // Calculate total price
    const totalPrice = seats.reduce((sum, seat) => sum + seat.price, 0);

    // Create the booking record
    const booking = await tx.booking.create({
        data: {
            eventId: event.id,
            userId: user.id,
            totalPrice,
            seats: {
                connect: seats.map((seat) => ({ id: seat.id })),
            },
        },
    });

    // Mark the seats as booked
    await tx.seat.updateMany({
        where: { id: { in: seats.map((seat) => seat.id) } },
        data: { isBooked: true },
    });

    return booking;
};

const initiatePayment = async (
    tx: any,
    booking: any,
    method: PaymentMethod,
    user: Attendee
): Promise<string> => {
    switch (method) {
        case PaymentMethod.KHALTI:
            return initiateKhaltiPayment(tx, booking.id, user);
        case PaymentMethod.ESEWA:
            return esewaPaymentInitialization({
                amount: booking.totalPrice,
                transactionUuid: booking.id,
            });
        default:
            throw new ApiError(400, "Invalid payment method");
    }
};



