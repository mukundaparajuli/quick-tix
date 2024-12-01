import db from "../config/db";
import { BookingStatus, Role } from "../enums";
import logger from "../logger";
import ApiError from "../types/api-error";
import { Attendee, Seat } from "../types/types";
import initiateKhaltiPayment from "./khalti-payment.service";

// Validate seats for the specific event
const validateSeats = async (
    tx: any,
    eventId: number,
    seats: Seat[]
): Promise<Seat[]> => {

    console.log("seats xa ta=", seats);
    // Check if seats exist and belong to the correct event
    const validSeats = await tx.seat.findMany({
        where: {
            id: { in: seats.map(seat => seat.id) },
            eventId: eventId,
            booking: null // Ensure seats are not already booked
        }
    });

    // Validate number of seats
    if (validSeats.length !== seats.length) {
        throw new ApiError(400, "Some selected seats are invalid or already booked");
    }

    return validSeats;
};

// Create booking record
const createBooking = async (
    tx: any,
    event: any,
    user: Attendee,
    seats: Seat[]
): Promise<any> => {
    const totalPrice = seats.length * event.price;

    // Create booking record
    const booking = await tx.booking.create({
        data: {
            eventId: event.id,
            userId: user.id,
            ticketCounts: seats.length,
            totalPrice: totalPrice,
            status: BookingStatus.PENDING,
            seats: {
                connect: seats.map((seat) => ({ id: seat.id })),
            },
        },
        include: {
            event: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true
                }
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true
                }
            },
            seats: {
                select: {
                    id: true,
                    seatId: true
                }
            },
        },
    });

    console.log(booking);

    // Log booking details
    logger.info(`Booking created successfully`, {
        bookingId: booking.id,
        eventId: event.id,
        userId: user.id,
        seatCount: seats.length,
        totalPrice
    });

    return booking;
};

// Main seat booking service function
const bookSeat = async (
    eventId: number,
    seats: Seat[],
    user: Attendee
): Promise<{
    booking: any,
    paymentUrl: string
}> => {


    console.log("seats=", seats);

    // Validate input
    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    // Check user authorization
    if (user.role !== Role.ATTENDEE) {
        throw new ApiError(403, "You are not authorized to perform this action");
    }

    // Use database transaction for atomic operations
    return await db.$transaction(async (tx) => {
        // Find the event
        const event = await tx.event.findUnique({
            where: { id: Number(eventId) },
            include: {
                location: true,
                organizer: true,
                bookings: true
            }
        });

        // Validate event existence
        if (!event) {
            throw new ApiError(404, "Event not found!");
        }

        // Validate seat count
        if (seats.length < 1) {
            throw new ApiError(400, "At least one seat must be selected");
        }

        if (seats.length >= event.availableTickets) {
            throw new ApiError(403, "Not enough available tickets");
        }

        // Validate and get seats
        const validSeats = await tx.seat.findMany({
            where: {
                id: { in: seats.map(seat => seat?.seatId) },
                eventId: eventId,
                bookings: null // Ensure seats are not already booked
            }
        });

        console.log(validSeats);
        // Create booking record
        const booking = await createBooking(tx, event, user, validSeats);

        console.log("now we will initiate payment")

        // Initiate payment process
        const paymentResult = await initiateKhaltiPayment(tx, booking.id, user);

        return paymentResult;
    }, {
        maxWait: 5000, // 5 seconds max wait to connect to prisma
        timeout: 20000, // 20 seconds
    });
};

export default bookSeat;