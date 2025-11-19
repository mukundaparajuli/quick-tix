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

export const markAsPublished = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.body;

    if (!eventId) {
        throw new ApiError(400, "Event id not found")
    }

    const publishedEvent = eventService.markEventAsPublished(eventId);

    return new ApiResponse(res, 200, "Event published successfully", publishedEvent);
})

export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await eventService.getAllEvents();
    return new ApiResponse(res, 200, "Events retrieved successfully", events);
});

export const getEventDetails = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    if (!eventId) {
        throw new ApiError(400, "Event id is required");
    }

    const eventDetails = await eventService.getEventDetails(parseInt(eventId));
    console.log(eventDetails);
    return new ApiResponse(res, 200, "Event details retrieved successfully", eventDetails);
});

export const searchAndFilterEvents = asyncHandler(async (req: Request, res: Response) => {
    console.log("Search request received:", req.query);

    const { q, date, category } = req.query;

    const filters: {
        q?: string;
        date?: string;
        category?: string;
    } = {};

    if (q && typeof q === "string") {
        filters.q = q.trim();
    }

    if (date && typeof date === "string" && !isNaN(Date.parse(date))) {
        filters.date = date;
    }

    if (category && typeof category === "string") {
        filters.category = category.toLowerCase();
    }

    const events = await eventService.searchAndFilterEvents(filters);

    return new ApiResponse(res, 200, "Events retrieved successfully", events);
});
