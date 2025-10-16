import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiError from "../types/api-error";
import { venueService } from "../services/venue.service";
import ApiResponse from "../types/api-response";

export const createVenue = asyncHandler(async (req: Request, res: Response) => {
    const { name, location, capacity, eventId } = req.body;

    // Basic validation
    if (!name || !location || !capacity || !eventId) {
        throw new ApiError(400, "Name, location, capacity, and eventId are required");
    }

    const venue = await venueService.createVenue(name, location, capacity);


    // Optionally associate the venue with an event
    if (eventId) {
        const updatedEvent = await venueService.associateVenueWithEvent(venue.id, eventId);
        console.log("Updated Event with Venue:", updatedEvent);
    }

    return new ApiResponse(res, 201, "Venue created successfully", venue);
});