import { Request, Response } from "express";
import ApiError from "../types/api-error";
import asyncHandler from "../utils/async-handler";
import { eventService } from "../services/event.service";
import ApiResponse from "../types/api-response";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, date, location, capacity } = req.body;

    if (!title || !date || !location || !capacity) {
        throw new ApiError(400, "Title, date, location and capacity are required");
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const organizerId = user.organizerProfile?.id;
    if (!organizerId) {
        throw new ApiError(403, "Only organizers can create events");
    }

    const event = await eventService.createEvent({
        title,
        description,
        date: new Date(date),
        location,
        capacity,
        organizerId,
    });

    return new ApiResponse(res, 201, "Event created successfully", event);
});