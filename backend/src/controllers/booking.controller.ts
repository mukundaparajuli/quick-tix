import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { bookingService } from "../services/booking.service";
import ApiResponse from "../types/api-response";

export const InitializeBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.reserveSeat(req);
    return new ApiResponse(res, 200, "Booking has been initialized", booking)
})

export const ConfirmBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.confirmBooking(req);
    return new ApiResponse(res, 200, "Booking has been confirmed", booking)
})

export const GetBookingsForAnEvent = asyncHandler(async (req: Request, res: Response) => {
    const bookings = await bookingService.getBookingsForAnEvent(req);
    return new ApiResponse(res, 200, "Booking for the event is here", bookings);
})

export const GetBookingsForAnUser = asyncHandler(async (req: Request, res: Response) => {
    const bookings = await bookingService.getBookingsForAnUser(req);
    return new ApiResponse(res, 200, "Bookings for the user is here", bookings);
})

export const GetBookingById = asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.getBookingById(req);
    return new ApiResponse(res, 200, "Booking details are fetched successfully", booking);
})
