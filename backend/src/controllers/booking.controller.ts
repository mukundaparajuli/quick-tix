import { Request, Response } from "express";
import { PaymentMethod } from "@prisma/client";
import ApiError from "../types/api-error";
import ApiResponse from "../types/api-response";
import asyncHandler from "../utils/async-handler";
import { eventService } from "../services/event.service";
import { ticketTypeService } from "../services/ticket-type.service";
import { venueService } from "../services/venue.service";
import { sectionService } from "../services/section.service";
import { seatService } from "../services/seat.service";
import { bookingService } from "../services/booking.service";
import { khaltiPaymentService } from "../services/khalti-payment.service";
import { esewaPaymentService } from "../services/esewa-payment.service";
import db from "../config/db";

type SelectedSeat = {
    id: string;
    label: string;
    ticketTypeId: string;
    ticketTypeName: string;
    price: number;
    sectionId: number;
    sectionName: string;
}

export const initializeBooking = asyncHandler(async (req: Request, res: Response) => {
    const { eventId, seatInfo, paymentMethod } = req.body as { eventId: number; seatInfo: SelectedSeat[]; paymentMethod: 'khalti' | 'esewa' } || {};
    if (!seatInfo || !paymentMethod) {
        throw new ApiError(400, "Seat information and payment method are required");
    }

    const event = await eventService.getEventDetails(eventId);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // iterate through each seat and check availability
    for (const seat of seatInfo) {
        const currSeat = await seatService.getSeatById(+seat.id);
        if (!currSeat) {
            throw new ApiError(404, `Seat ${seat.label} not found`);
        }
        if (currSeat.isBooked) {
            throw new ApiError(400, `Seat ${seat.label} is already booked`);
        }
        const ticketType = await ticketTypeService.getTicketTypeById(+seat.ticketTypeId);
        if (!ticketType) {
            throw new ApiError(404, `Ticket type ${seat.ticketTypeName} not found`);
        }

        if (ticketType.capacity !== null && ticketType.capacity <= 0) {
            throw new ApiError(400, `Ticket type ${seat.ticketTypeName} is sold out`);
        }
    }
    const venue = await venueService.getVenueByEventId(eventId);
    if (!venue) {
        throw new ApiError(404, "Venue not found for the event");
    }
    const sections = await sectionService.getSectionsByVenueId(venue.id);
    if (!sections || sections.length === 0) {
        throw new ApiError(404, "No sections found for the venue");
    }
    // check if all seats belong to valid sections
    for (const seat of seatInfo) {
        const section = sections.find((sec: any) => sec.id === seat.sectionId);
        if (!section) {
            throw new ApiError(400, `Seat ${seat.label} belongs to an invalid section`);
        }
    }

    const userId = (req as any).user?.id;
    if (!userId) {
        throw new ApiError(401, "Authentication required");
    }

    // Find attendee profile
    const attendeeProfile = await db.attendeeProfile.findUnique({
        where: { userId },
        include: {
            user: true
        }
    });

    if (!attendeeProfile) {
        throw new ApiError(404, "Attendee profile not found");
    }

    try {
        // Calculate total price
        const totalPrice = seatInfo.reduce((sum, seat) => sum + seat.price, 0);

        // Create booking with seats reserved
        const booking = await bookingService.createBooking({
            eventId,
            attendeeId: attendeeProfile.id,
            seatIds: seatInfo.map(seat => seat.id),
            totalPrice,
            paymentMethod: paymentMethod.toUpperCase() as PaymentMethod
        });

        // Initialize payment based on method
        let paymentResponse;
        const paymentData = {
            bookingId: booking.id,
            amount: totalPrice,
            eventName: event.title,
            customerName: attendeeProfile.user.name || attendeeProfile.user.email,
            customerEmail: attendeeProfile.user.email
        };

        if (paymentMethod === 'khalti') {
            const khaltiResponse = await khaltiPaymentService.initiatePayment(paymentData);

            // Update payment with Khalti details
            await bookingService.updatePaymentDetails({
                bookingId: booking.id,
                paymentUrl: khaltiResponse.payment_url,
                pidx: khaltiResponse.pidx,
                expiresAt: new Date(khaltiResponse.expires_at),
                gatewayResponse: khaltiResponse
            });

            paymentResponse = {
                bookingId: booking.id,
                paymentMethod: 'khalti',
                paymentUrl: khaltiResponse.payment_url,
                pidx: khaltiResponse.pidx,
                expiresAt: khaltiResponse.expires_at
            };
        } else if (paymentMethod === 'esewa') {
            const esewaResponse = await esewaPaymentService.initiatePayment(paymentData);

            // Update payment with eSewa details
            await bookingService.updatePaymentDetails({
                bookingId: booking.id,
                paymentUrl: esewaResponse.payment_url,
                transactionId: esewaResponse.transactionId,
                gatewayResponse: esewaResponse
            });

            paymentResponse = {
                bookingId: booking.id,
                paymentMethod: 'esewa',
                paymentUrl: esewaResponse.payment_url,
                payload: esewaResponse.payload,
                method: esewaResponse.method,
                transactionId: esewaResponse.transactionId
            };
        } else {
            throw new ApiError(400, "Invalid payment method");
        }

        res.status(200).json({
            success: true,
            message: "Booking initialized successfully",
            data: paymentResponse
        });

    } catch (error: any) {
        console.error('Booking initialization error:', error);
        throw new ApiError(500, error.message || "Failed to initialize booking");
    }
});

export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const attendeeProfile = await db.attendeeProfile.findUnique({
        where: { userId },
    });

    if (!attendeeProfile) {
        throw new ApiError(404, "Attendee profile not found");
    }

    const bookings = await bookingService.getUserBookings(attendeeProfile.id);

    return new ApiResponse(res, 200, "User bookings fetched successfully", bookings);
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const bookingId = parseInt(req.params.id);

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    if (!bookingId || isNaN(bookingId)) {
        throw new ApiError(400, "Valid booking ID is required");
    }

    const attendeeProfile = await db.attendeeProfile.findUnique({
        where: { userId },
    });

    if (!attendeeProfile) {
        throw new ApiError(404, "Attendee profile not found");
    }

    const booking = await bookingService.getBookingWithPayment(bookingId);

    // Ensure the booking belongs to the authenticated user
    if (booking.attendee.id !== attendeeProfile.id) {
        throw new ApiError(403, "Access denied. You can only view your own bookings");
    }

    return new ApiResponse(res, 200, "Booking details fetched successfully", booking);
});