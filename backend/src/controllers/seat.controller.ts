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




// lock a seat 
export const lockASeat = asyncHandler(async (req: Request, res: Response) => {
    const { eventId, seatId } = req.body;

    // check if event id and seat id are provided
    if (!eventId || !seatId) {
        return new ApiResponse(res, 400, "Event Id and Seat Id are not provided", null, null)
    }

    // if event id and seat id are provided
    // find the event and the seat

    // check if event is available
    const event = await db.event.findUnique({
        where: {
            id: Number(eventId)
        }
    })

    // if event not available
    if (!event) {
        return new ApiResponse(res, 404, "Event not found", null, null);
    }

    // check if the status of seat is available or not
    // find that seat from that event
    const seat = await db.seat.findUnique({
        where: {
            id: Number(seatId),
            eventId: Number(eventId)
        }
    })

    // if not seat there is no such seat for that event
    if (!seat) {
        return new ApiResponse(res, 404, "No such seat available for the event", null, null);
    }

    // now if the seat exists then check its availability
    // only the seats with availble status can be locked

    if (seat.status !== SeatStatus.AVAILABLE) {
        return new ApiResponse(res, 403, "Only available seats can be locked", null, null);
    }

    // now if the seat status was available then convert it to locked
    seat.status = SeatStatus.LOCKED;

    return new ApiResponse(res, 200, 'Seat Locked!', null, null);
})


// release a seat
// we will take the booking id and seat no
// check if booking id is present
// check if seat is provided
// check if the particular seat is availale inside the booking id
// check the status of the seat
// find the seat by id and look for the status
// if the status !== BOOKED we can release only the booked seat
// release the booked seat
// update the booking

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
    const isSeatPresent = booking?.seats.include(Number(seatId));

    if (!isSeatPresent) {
        return new ApiResponse(res, 404, "Seat is not available in this booking!", null, null);
    }

    // now the seat is present and the seat is booked by the same user  and the status is booked
    // now we can release the seat
    seat.status = SeatStatus.AVAILABLE;

    return new ApiResponse(res, 200, "Seat has now been released and can be booked now", null, null);

})