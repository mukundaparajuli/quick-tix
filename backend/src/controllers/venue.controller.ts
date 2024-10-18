import { Request, Response } from "express";
import db from "../config/db";
import asyncHandler from "../utils/async-handler";
import { Section } from "../types/types";
import ApiResponse from "../types/api-response";

// Create Venue with Sections
export const createVenue = asyncHandler(async (req: Request, res: Response) => {
    const { name, address, sections } = req.body;

    if (!name || !address || !sections) {
        return new ApiResponse(res, 400, "Incomplete Input!");
    }

    try {
        const newVenue = await db.venue.create({
            data: {
                name,
                address,
                sections: {
                    create: sections.map((section: Section) => ({
                        name: section.name,
                        rows: {
                            create: section.rows.map(row => ({
                                name: row.name,
                                seats: {
                                    create: row.seats.map(seat => ({
                                        seatNumber: seat.seatNumber,
                                    })),
                                },
                            })),
                        },
                    })),
                },
            },
        });

        return new ApiResponse(res, 201, "Venue added successfully", newVenue, null);
    } catch (error) {
        return new ApiResponse(res, 500, "Failed to create venue", null, error);
    }
});

// Get All Venues
export const getAllVenues = asyncHandler(async (req: Request, res: Response) => {
    const venues = await db.venue.findMany({
        include: {
            events: true,
            sections: {
                include: {
                    rows: {
                        include: {
                            seats: true,
                        },
                    },
                },
            },
        },
    });
    return new ApiResponse(res, 200, "Venues fetched successfully", venues, null);
});

// Get Single Venue by ID
export const getVenueById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const venue = await db.venue.findUnique({
        where: { id: Number(id) },
        include: {
            events: true,
            sections: {
                include: {
                    rows: {
                        include: {
                            seats: true,
                        },
                    },
                },
            },
        },
    });

    if (!venue) {
        return new ApiResponse(res, 404, "Venue not found", null, null);
    }
    return new ApiResponse(res, 200, "Venue fetched successfully", venue, null);
});

// Update Venue
export const updateVenue = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, address } = req.body;

    if (!name && !address) {
        return new ApiResponse(res, 400, "No updates provided");
    }

    const updatedVenue = await db.venue.update({
        where: { id: Number(id) },
        data: {
            name,
            address,
        },
    });
    return new ApiResponse(res, 200, "Venue updated successfully", updatedVenue, null);
});

// Delete Venue
export const deleteVenue = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await db.venue.delete({
        where: { id: Number(id) },
    });
    return new ApiResponse(res, 204, "Venue deleted successfully", null, null);
});

// Get Events for a Venue
export const getEventsByVenueId = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const events = await db.event.findMany({
        where: { venueId: Number(id) },
    });
    return new ApiResponse(res, 200, "Events fetched successfully", events, null);
});

