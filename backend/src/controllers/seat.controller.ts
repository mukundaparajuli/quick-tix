// get all the available seats for the event
// lock unlock and release the seat
// get all seats in a row
// get all seats in a section

import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import db from "../config/db";
import ApiResponse from "../types/api-response";
import { SeatStatus } from "../enums";

// get all the available seats for an event
export const getEventAllSeats = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;

    const event = db.event.findUnique({
        where: {
            id: Number(eventId)
        }
    })

    if (!event) {
        return new ApiResponse(res, 404, "Event not available", null, null);
    }

    const availableSeats = await db.seat.findMany({
        where: {
            eventId: Number(eventId),
            status: 'AVAILABLE'
        }
    });

    if (!availableSeats || availableSeats.length < 1) {
        return new ApiResponse(res, 404, "No seats are availale", null, null);
    }

    return new ApiResponse(res, 200, "Available seats are here!", availableSeats, null);
})


// release a seat

export const releaseSeat = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId, seatId } = req.body;

    const booking = await db.booking.findUnique({
        where: {
            id: bookingId,
        }
    })

    // check if booking exists
    if (!booking) {
        return new ApiResponse(res, 404, "Booking not found!", null, null);
    }


    // find seat with the seat id and event id from the booking
    const seat = await db.seat.findUnique({
        where: {
            id: Number(seatId),
            eventId: booking.eventId,
        }
    });

    // check if seat is available
    if (!seat) {
        return new ApiResponse(res, 404, "No such seat is available", null, null);
    }

    // check for the seat's availability
    if (seat.status !== SeatStatus.BOOKED) {
        return new ApiResponse(res, 403, "Forbidden : Only booked seats can be cancelled");
    }

    // check if the particular seat is availble inside that booking
    // const isSeatPresent = booking?.seats.include(Number(seatId));

    // if (!isSeatPresent) {
    //     return new ApiResponse(res, 404, "Seat is not available in this booking!", null, null);
    // }

    // now the seat is present and the seat is booked by the same user  and the status is booked
    // now we can release the seat
    seat.status = SeatStatus.AVAILABLE;

    return new ApiResponse(res, 200, "Seat has now been released and can be booked now", null, null);

})