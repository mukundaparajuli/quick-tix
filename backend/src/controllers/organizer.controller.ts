import { Request, Response } from "express";
import ApiError from "../types/api-error";
import ApiResponse from "../types/api-response";
import asyncHandler from "../utils/async-handler";
import { organizerService } from "../services/organizer.service";

// Get all events created by the organizer
export const getOrganizerEvents = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const organizerId = user.organizerProfile?.id;
    if (!organizerId) {
        throw new ApiError(403, "Only organizers can access this resource");
    }

    const events = await organizerService.getOrganizerEvents(organizerId);
    return new ApiResponse(res, 200, "Organizer events fetched successfully", events);
});

// Get all bookings for organizer's events
export const getOrganizerBookings = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const organizerId = user.organizerProfile?.id;
    if (!organizerId) {
        throw new ApiError(403, "Only organizers can access this resource");
    }

    const { eventId, status, page = 1, limit = 10 } = req.query;

    const bookings = await organizerService.getOrganizerBookings({
        organizerId,
        eventId: eventId ? parseInt(eventId as string) : undefined,
        status: status as string | undefined,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
    });

    return new ApiResponse(res, 200, "Organizer bookings fetched successfully", bookings);
});

// Get organizer dashboard stats
export const getOrganizerStats = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const organizerId = user.organizerProfile?.id;
    if (!organizerId) {
        throw new ApiError(403, "Only organizers can access this resource");
    }

    const stats = await organizerService.getOrganizerStats(organizerId);
    return new ApiResponse(res, 200, "Organizer stats fetched successfully", stats);
});

// Get organizer earnings/wallet info
export const getOrganizerEarnings = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const organizerId = user.organizerProfile?.id;
    if (!organizerId) {
        throw new ApiError(403, "Only organizers can access this resource");
    }

    const { startDate, endDate } = req.query;

    const earnings = await organizerService.getOrganizerEarnings({
        organizerId,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
    });

    return new ApiResponse(res, 200, "Organizer earnings fetched successfully", earnings);
});

// Update event
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const organizerId = user.organizerProfile?.id;
    if (!organizerId) {
        throw new ApiError(403, "Only organizers can update events");
    }

    const { eventId } = req.params;
    if (!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const updateData = req.body;
    const updatedEvent = await organizerService.updateEvent(parseInt(eventId), organizerId, updateData);

    return new ApiResponse(res, 200, "Event updated successfully", updatedEvent);
});

// Get booking details for organizer
export const getBookingDetails = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const organizerId = user.organizerProfile?.id;
    if (!organizerId) {
        throw new ApiError(403, "Only organizers can access this resource");
    }

    const { bookingId } = req.params;
    if (!bookingId) {
        throw new ApiError(400, "Booking ID is required");
    }

    const booking = await organizerService.getBookingDetails(parseInt(bookingId), organizerId);
    return new ApiResponse(res, 200, "Booking details fetched successfully", booking);
});
