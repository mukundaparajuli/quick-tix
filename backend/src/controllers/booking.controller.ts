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