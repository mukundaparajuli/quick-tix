import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiError from "../types/api-error";
import { seatService } from "../services/seat.service";
import ApiResponse from "../types/api-response";
import db from "../config/db";

export const createSeat = asyncHandler(async (req: Request, res: Response) => {
    const { label, sectionId, isBooked = false } = req.body;

    if (!label || !sectionId) {
        throw new ApiError(400, "Label and sectionId are required");
    }

    const seat = await seatService.createSeat({ label, sectionId, isBooked });
    return new ApiResponse(res, 201, "Seat created successfully", seat);
});



export const createSeats = asyncHandler(async (req: Request, res: Response) => {
    const seats = req.body;
    const allSeatsToCreate: { label: string; sectionId: number }[] = [];

    for (const { sectionId, row, column } of seats) {
        const existingSeats = await db.seat.findMany({
            where: { sectionId },
            orderBy: { label: "asc" },
        });

        let lastRowIndex = -1;
        if (existingSeats.length > 0) {
            const lastSeat = existingSeats[existingSeats.length - 1];
            const lastRowChar = lastSeat.label[0];
            lastRowIndex = lastRowChar.charCodeAt(0) - 65;
        }

        const newSeats = await seatService.generateSeats(
            sectionId,
            lastRowIndex + 1,
            row,
            column
        );

        allSeatsToCreate.push(...newSeats);
    }

    const createdSeats = await db.seat.createMany({
        data: allSeatsToCreate,
        skipDuplicates: true,
    });

    const allSeats = await db.seat.findMany({
        where: {
            sectionId: {
                in: allSeatsToCreate.map(s => s.sectionId),
            },
        },
        orderBy: { id: "asc" },
    });

    return new ApiResponse(res, 201, "Seats created successfully", allSeats);
});

