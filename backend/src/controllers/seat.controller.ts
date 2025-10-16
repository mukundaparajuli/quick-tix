import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiError from "../types/api-error";
import { seatService } from "../services/seat.service";
import ApiResponse from "../types/api-response";

export const createSeat = asyncHandler(async (req: Request, res: Response) => {
    const { label, sectionId, isBooked } = req.body;

    if (!label || !sectionId) {
        throw new ApiError(400, "Label and sectionId are required");
    }

    const seat = await seatService.createSeat({ label, sectionId, isBooked });
    return new ApiResponse(res, 201, "Seat created successfully", seat);
});


export const createSeats = asyncHandler(async (req: Request, res: Response) => {
    const seats = req.body;

    if (!Array.isArray(seats) || seats.length === 0) {
        throw new ApiError(400, "Seats data is required");
    }

    const createdSeats = await seatService.createSeats(seats);
    return new ApiResponse(res, 201, "Seats created successfully", createdSeats);
}); 
