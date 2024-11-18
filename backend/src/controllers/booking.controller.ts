import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import { Role, BookingStatus, SeatStatus } from "../enums";
import logger from "../logger";
import { initiateKhaltiPayment } from "../services";


// Create a booking
export const RegisterBooking = asyncHandler(async (req: Request, res: Response) => {
    const { eventId, ticketCounts, seatIds, rowId, sectionId } = req.body;

    return await db.$transaction(async (tx) => {
        const user = req.user;

        if (!user) {
            return new ApiResponse(res, 404, "User not found!", null, null);
        }

        const userId: number = user.id;

        if (user.role !== Role.ATTENDEE) {
            return new ApiResponse(res, 403, "Only attendees can book an event", null, null);
        }

        const event = await tx.event.findUnique({
            where: { id: Number(eventId) },
        });

        if (!event) {
            return new ApiResponse(res, 404, "Event does not exist", null, null);
        }

        if (ticketCounts < 1 || ticketCounts > event.availableTickets) {
            return new ApiResponse(res, 400, "Invalid Ticket Count", null, null);
        }

        if (!seatIds || seatIds.length !== ticketCounts) {
            return new ApiResponse(res, 400, "Seat numbers do not match ticket count.", null, null);
        }

        const section = await tx.section.findUnique({
            where: { id: Number(sectionId) },
            include: { rows: true },
        });

        if (!section || !section.rows.some(row => row.id === Number(rowId))) {
            return new ApiResponse(res, 400, "Invalid section or row", null, null);
        }

        // Check availability for all seats in one query
        const seats = await tx.seat.findMany({
            where: { id: { in: seatIds }, rowId: rowId, status: SeatStatus.AVAILABLE },
        });

        if (seats.length !== seatIds.length) {
            return new ApiResponse(res, 400, "Some seats are not available or do not belong to the specified row.");
        }

        for (let seatId of seatIds) {
            await tx.seat.update({
                where: { id: seatId },
                data: { status: SeatStatus.LOCKED },
            });
        }

        const totalPrice = ticketCounts * event.price;
        logger.info("Booking is about to be made");

        const booking = await tx.booking.create({
            data: {
                eventId: event.id,
                userId: userId,
                ticketCounts: ticketCounts,
                totalPrice: totalPrice,
                status: BookingStatus.PENDING,
                seats: {
                    connect: seatIds.map((seatId: number) => ({ id: seatId })),
                },
            },
            include: {
                event: { select: { id: true, title: true, description: true, category: true } },
                user: { select: { id: true, username: true, email: true, fullName: true } },
                seats: { select: { id: true, seatNumber: true } },
            },
        });

        if (!booking) {
            return new ApiResponse(res, 500, "Error while creating a booking", null, null);
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




// Cancel a booking
export const CancelBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
        return new ApiResponse(res, 404, "User not found", null, null);
    }

    // Check if the booking exists
    const booking = await db.booking.findUnique({
        where: { id: Number(id) },
    });

    if (!booking) {
        return new ApiResponse(res, 404, "Booking not found", null, null);
    }

    // Check if the user is authorized to cancel the booking
    if (user.role !== Role.ORGANIZER && booking.userId !== user.id) {
        return new ApiResponse(res, 403, "You are not authorized to cancel this booking", null, null);
    }

    // Delete the booking
    await db.booking.delete({
        where: { id: Number(id) },
    });

    return new ApiResponse(res, 200, "Booking canceled successfully", null, null);
});

// Get all the bookings for an event
export const GetAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const user = req.user;

    if (!user) {
        return new ApiResponse(res, 404, "User not found!", null, null);
    }

    const userId = user.id;

    // Check if event exists
    const event = await db.event.findUnique({
        where: {
            id: Number(eventId)
        }
    });

    if (!event) {
        return new ApiResponse(res, 404, "Event not found!", null, null);
    }

    // Check if the user is an organizer of the event
    if (user.role !== Role.ORGANIZER || userId !== event.organizerId) {
        return new ApiResponse(res, 403, "You are not authorized for this", null, null);
    }

    // Retrieve all bookings for the event
    const bookings = await db.booking.findMany({
        where: {
            eventId: Number(eventId)
        }
    });

    return new ApiResponse(res, 200, "All the bookings are here for the event", bookings, null);
});

// Get all the bookings for a particular user
export const GetBookingsForAUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    // Check if user exists
    if (!user) {
        return new ApiResponse(res, 404, "User not found", null, null);
    }

    const userId = user.id;

    // Check if user is an attendee
    if (user.role !== Role.ATTENDEE) {
        return new ApiResponse(res, 400, "Only attendees can have bookings", null, null);
    }

    const bookings = await db.booking.findMany({
        where: {
            userId,
        }
    });

    return new ApiResponse(res, 200, "Your bookings are here", bookings, null);
});

// Get a specific booking with booking id
export const GetABookingById = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const user = req.user;

    // Check if user exists
    if (!user) {
        return new ApiResponse(res, 404, "User not found!", null, null);
    }

    // Check if bookingId exists
    if (!bookingId) {
        return new ApiResponse(res, 404, "Booking Id not found", null, null);
    }

    // Check if user is actually the one who booked
    const booking = await db.booking.findUnique({
        where: {
            id: Number(bookingId)
        }, include: {
            seats: {
                include: {
                    row: {
                        include: {
                            section: true,
                        },
                    },
                },
            },

        }
    })

    if (!booking) {
        return new ApiResponse(res, 404, "Booking not found", null, null);
    }

    // User should match booking userId for security
    if (booking.userId !== user.id && user.role !== Role.ORGANIZER) {
        return new ApiResponse(res, 401, "You cannot view this booking", null, null);
    }

    return new ApiResponse(res, 200, "Your booking is here", booking, null);
});



