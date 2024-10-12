import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import { Event } from "../types/types";


// create event
export const RegisterEvent = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, date, location, price, totalTickets, availableTickets, organizerId } = await req.body;

    // check if required data are available or not
    if (!title || !description || !date || !location || !price || !totalTickets || !availableTickets) {
        return new ApiResponse(res, 403, "All fields are mandatory to be filled", null, null);
    }

    // Validate date and number fields
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
        return new ApiResponse(res, 400, "Invalid or past event date.", null, null);
    }

    if (price <= 0 || totalTickets <= 0 || availableTickets < 0) {
        return new ApiResponse(res, 400, "Invalid values for price or tickets.", null, null);
    }


    // get organizer info
    const organizer = await db.user.findUnique({
        where: {
            id: organizerId,
        }
    })

    // check if organizer exists
    if (!organizer) {
        return new ApiResponse(res, 404, "Organizer doesn't exist", null, null);
    }

    // check if the organizer is actually an organizer or an attendee
    if (organizer.role !== 'ORGANIZER') {
        return new ApiResponse(res, 401, "You are not authorized to organize this event", null, null)
    }



    // now we can register the event

    const newEvent = await db.event.create({
        data: {
            title,
            description,
            date,
            location,
            price,
            totalTickets,
            availableTickets,
            organizer: {
                connect: { id: organizerId },
            },
        }, include: {
            organizer: {
                select: {
                    id: true,
                    fullName: true,
                    username: true,
                    email: true,
                    role: true,
                }
            },
        }
    });

    console.log("event created successfully");

    return new ApiResponse(res, 200, "Event Registered Successfully", newEvent, null);
})



// get all events
export const GetAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await db.event.findMany();

    if (!events || events.length === 0) {
        return new ApiResponse(res, 404, "No events were found!", null, null)
    }

    return new ApiResponse(res, 200, "all the events are here", events, null);
})


// get a event by id
export const GetAnEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;

    if (!eventId) {
        return new ApiResponse(res, 404, "event id was not found", null, null);
    }

    const event = await db.event.findUnique({
        where: {
            id: Number(eventId)
        }
    })

    // check if event exists
    if (!event) {
        return new ApiResponse(res, 404, "event does not exist", null, null);
    }

    // now the event exists so return the event

    return new ApiResponse(res, 200, "event is here", event, null);
})


// delete an event

export const DeleteAnEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const user = req.user;

    if (!eventId) {
        return new ApiResponse(res, 404, "event id was not found", null, null);
    }

    const event = await db.event.findUnique({
        where: {
            id: Number(eventId)
        }
    })

    // check if event exists
    if (!event) {
        return new ApiResponse(res, 404, "event does not exist", null, null);
    }


    // check if user exists
    if (!user) {
        return new ApiResponse(res, 404, "user not found", null, null);
    }

    // the event exists now we will check if the user is an organizer or not
    if (user.role !== 'ORGANIZER') {
        return new ApiResponse(res, 403, "you are not authorized to delete this event", null, null);
    }

    // check if the user is the organizer of this particular event or not
    if (user.id !== event.organizerId) {
        return new ApiResponse(res, 403, "you are not authorized to delete this event", null, null);
    }

    // the event exists and the user is an organizer as well
    const deletedEvent = await db.event.delete({
        where: {
            id: Number(eventId)
        }
    })

    return new ApiResponse(res, 200, "event deleted successfully", deletedEvent, null);
})