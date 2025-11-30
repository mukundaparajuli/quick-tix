import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiError from "../types/api-error";
import { seatService } from "../services/seat.service";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import { broadcaster } from "../sockets";

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

        if ((availableSeats as any).availableSlots < seatsToCreate) {
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

export const reserveSeat = asyncHandler(async (req: Request, res: Response) => {
    const { seatId, eventId, ttlSeconds = 300 } = req.body;
    const user = (req as any).user;

    if (!seatId || !eventId) {
        throw new ApiError(400, "seatId and eventId are required");
    }

    const seat = await db.seat.findUnique({ where: { id: parseInt(seatId) } });
    if (!seat) throw new ApiError(404, "Seat not found");
    if (seat.isBooked) throw new ApiError(400, "Seat is already booked");

    // check existing reservation
    const existing = await db.seatReservation.findUnique({ where: { seatId: parseInt(seatId) } });
    const now = new Date();
    if (existing) {
        if (existing.expiresAt > now && existing.userId !== user.id) {
            throw new ApiError(409, "Seat is currently reserved by another user");
        }
        // expired or same user: delete and recreate
        await db.seatReservation.delete({ where: { id: existing.id } });
    }

    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    const reservation = await db.seatReservation.create({
        data: {
            seatId: parseInt(seatId),
            userId: user.id,
            eventId: parseInt(eventId),
            expiresAt
        }
    });

    // Broadcast reserved status
    try {
        broadcaster.broadcastSeatStatus?.(parseInt(eventId), [parseInt(seatId)], "RESERVED");
    } catch (err) {
        console.warn("broadcast failed", err);
    }

    return new ApiResponse(res, 201, "Seat reserved", reservation);
});

export const releaseSeat = asyncHandler(async (req: Request, res: Response) => {
    const { seatId } = req.params;
    const user = (req as any).user;

    if (!seatId) throw new ApiError(400, "seatId is required");

    const existing = await db.seatReservation.findUnique({ where: { seatId: parseInt(seatId) } });
    if (!existing) return new ApiResponse(res, 200, "No active reservation");

    // allow owner or admin to release
    if (existing.userId !== user.id) {
        // You may want admins to force release; for now disallow
        throw new ApiError(403, "Not authorized to release this reservation");
    }

    await db.seatReservation.delete({ where: { id: existing.id } });

    // Broadcast available status to event room
    try {
        broadcaster.broadcastSeatStatus?.(existing.eventId, [existing.seatId], "AVAILABLE");
    } catch (err) {
        console.warn("broadcast failed", err);
    }

    return new ApiResponse(res, 200, "Reservation released");
});

