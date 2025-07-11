import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { eventService } from "../services/event.service";
import ApiResponse from "../types/api-response";

export const CreateEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.createEvent(req);
    return new ApiResponse(res, 200, "Event was created successfully", event);
})

export const UpdateEvent = asyncHandler(async (req: Request, res: Response) => {
    const updatedEvent = await eventService.updateEvent(req);
    return new ApiResponse(res, 200, "Event was updated successfully", updatedEvent);
})

export const DeleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const deletedEvent = await eventService.deleteEvent(req);
    return new ApiResponse(res, 204, "Event was deleted successfully", deletedEvent);
})

export const GetEventById = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.getEventById(req);
    return new ApiResponse(res, 200, "Event fetched successfully", event);
});

export const GetEventsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const events = await eventService.getEventsByCategory(req);
    return new ApiResponse(res, 200, "Events for the given category was fetched successfully", events);
})

export const GetAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await eventService.getAllEvents(req);
    return new ApiResponse(res, 200, "All events are fetched successfully", events);
})

export const GetEventsForAnOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const events = await eventService.getEventsForAnOrganizer(req);
    return new ApiResponse(res, 200, "Events by the organizer was fetched successfully", events);
})

export const SearchEvent = asyncHandler(async (req: Request, res: Response) => {
    const events = await eventService.searchEvents(req);
    return new ApiResponse(res, 200, "Searched events are fetched successfully", events);
})

export const GetPopularEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await eventService.getPopularEvents(req);
    return new ApiResponse(res, 200, "Popular events are fetched successfully", events);
})