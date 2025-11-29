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
        const availableSeats = await seatService.checkSeatAvailability(sectionId);
        const seatsToCreate = row * column;

        if (availableSeats < seatsToCreate) {
            throw new ApiError(
                400,
                `Not enough available seats in section ${sectionId}. Available: ${availableSeats}, Requested: ${seatsToCreate}`
            );
        }

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

    await db.seat.createMany({
        data: allSeatsToCreate,
        skipDuplicates: true,
    });

    // -----------------------------------------
    // 🔥 Fetch the eventId from the first section
    // -----------------------------------------
    const section = await db.section.findUnique({
        where: { id: seats[0].sectionId },
        select: {
            venueId: true,
            venue: {
                select: {
                    events: {
                        select: { id: true }
                    }
                }
            }
        }
    });

    if (!section) {
        throw new ApiError(404, "Section not found");
    }

    const eventId = section.venue.events[0]?.id;

    if (!eventId) {
        throw new ApiError(404, "Event not found for this section");
    }

    // -----------------------------------------
    // 🔥 Get ALL seats for the entire event
    // seat.section.venue.events.some(eventId)
    // -----------------------------------------
    const allSeats = await db.seat.findMany({
        where: {
            section: {
                venue: {
                    events: {
                        some: {
                            id: eventId
                        }
                    }
                }
            }
        },
        orderBy: { id: "asc" },
    });

    return new ApiResponse(res, 201, "Seats created successfully", allSeats);
});

export const getCapacitySummary = asyncHandler(async (req: Request, res: Response) => {
    const { venueId } = req.params;

    if (!venueId) {
        throw new ApiError(400, "Venue ID is required");
    }

    const summary = await seatService.getCapacitySummary(parseInt(venueId));
    return new ApiResponse(res, 200, "Capacity summary retrieved", summary);
});

export const checkSeatAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { sectionId } = req.params;

    if (!sectionId) {
        throw new ApiError(400, "Section ID is required");
    }

    const availability = await seatService.checkSeatAvailability(parseInt(sectionId));
    return new ApiResponse(res, 200, "Seat availability retrieved", availability);
});

