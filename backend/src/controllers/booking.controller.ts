import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import { Role, BookingStatus, SeatStatus } from "../enums";
import logger from "../logger";
import { initiateKhaltiPayment } from "../services";


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
            user: true

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



