import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import { Role, BookingStatus } from "../enums";
import logger from "../logger";


// Create a booking
export const RegisterBooking = asyncHandler(async (req: Request, res: Response) => {
    const { eventId, ticketCounts, seatIds } = req.body;
    const user = req.user;

    if (!user) {
        return new ApiResponse(res, 404, "User not found!", null, null);
    }

    const userId: number = user.id;

    if (user.role !== Role.ATTENDEE) {
        return new ApiResponse(res, 403, "Only attendees can book an event", null, null);
    }

    const event = await db.event.findUnique({
        where: {
            id: Number(eventId),
        },
    });

    if (!event) {
        return new ApiResponse(res, 404, "Event does not exist", null, null);
    }


    if (ticketCounts < 1 || ticketCounts > event.availableTickets) {
        return new ApiResponse(res, 400, "Invalid Ticket Count", null, null);
    }

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length !== Number(ticketCounts)) {
        return new ApiResponse(res, 400, "Seat numbers do not match ticket count.", null, null);
    }

    const totalPrice = ticketCounts * event.price;

    logger.info("Booking is about to be made");

    const booking = await db.booking.create({
        data: {
            eventId: event.id,
            userId: userId,
            ticketCounts: ticketCounts,
            totalPrice: totalPrice,
            status: BookingStatus.PENDING,
            seats: {
                connect: seatIds.map((seatId: number) => ({ id: seatId })), // Connect multiple seats
            },
        },
        include: {
            event: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                },
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                },
            },
            seats: {
                select: {
                    id: true,
                    seatNumber: true,
                },
            },
        },
    });



    if (!booking) {
        return new ApiResponse(res, 500, "error while creating a booking", null, null)
    }


    return new ApiResponse(res, 200, "booking made now you can proceed to make payment", booking, null)

    // logger.info("booking made.. now its payments turn")

    // const LIVE_SECRET_KEY = process.env.LIVE_SECRET_KEY;

    // logger.info(LIVE_SECRET_KEY);

    // const initiateKhaltiPayment = async (bookingId: number, amount: number, user: any) => {
    //     const payload = {
    //         "return_url": "https://example.com/payment/",
    //         "website_url": "https://example.com/",
    //         "amount": amount * 100,
    //         "purchase_order_id": bookingId.toString(),
    //         "purchase_order_name": `Booking for event id : ${bookingId}`,
    //         "customer_info": {
    //             "name": user.fullName,
    //             "email": user.email,
    //         },
    //     }


    //     try {
    //         const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
    //             headers: {
    //                 'Authorization': `Key ${LIVE_SECRET_KEY}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             method: 'POST',
    //             body: JSON.stringify(payload)
    //         });

    //         if (!response.ok) {
    //             console.log(response);
    //             throw new Error('Failed to initiate payment');
    //         }

    //         const paymentResponse = await response.json();
    //         console.log({ paymentResponse });

    //         if (paymentResponse && paymentResponse.payment_url) {
    //             updateBookingStatus(bookingId, BookingStatus.SUCCESSFUL)
    //             return new ApiResponse(res, 200, "Booking made successfully. Proceed to payment.", { booking, paymentUrl: paymentResponse.payment_url }, null);
    //         } else {
    //             throw new Error('Payment URL not returned');
    //         }
    //     } catch (error) {
    //         await db.booking.delete({ where: { id: bookingId } });
    //         logger.error(error);
    //         return new ApiResponse(res, 500, "Booking created but payment initiation failed", null, error);
    //     }
    // };

    // await initiateKhaltiPayment(booking.id, totalPrice, user);
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
        }
    });

    if (!booking) {
        return new ApiResponse(res, 404, "Booking not found", null, null);
    }

    // User should match booking userId for security
    if (booking.userId !== user.id && user.role !== Role.ORGANIZER) {
        return new ApiResponse(res, 401, "You cannot view this booking", null, null);
    }

    return new ApiResponse(res, 200, "Your booking is here", booking, null);
});



// SUCCESS 
export const success = asyncHandler(async (req, res) => {
    res.send("Payment Successful")
})

// FAILURE
export const failure = asyncHandler(async (req, res) => {
    res.send("Payment Failed")
})