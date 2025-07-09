import { Request } from "express";
import ApiError from "../types/api-error";
import { EventCategory, Role } from "@prisma/client";
import db from "../config/db";
import { locationService } from "./location.service";
import { venueService } from "./venue.service";
import { agendasService } from "./agendas.service";
import { sponsorService } from "./sponsor.service";
import { ticketService } from "./ticket.service";
import { promocodeService } from "./promocode.service";

export class EventServices {
    // create an event
    async createEvent(req: Request) {
        const { title, description, category, tags, date, agendas, venue, location, ticketTypes, sponsors, promocodes } = req.body;

        if (!title || !description || !category || !tags || !date || !agendas || !location || !ticketTypes || !sponsors) {
            throw new ApiError(400, "Please fill all the necessary fields");
        }

        //check if the user is verified and has the organizer profile
        const user = req.user;
        if (!user || user.role === Role.ORGANIZER) {
            throw new ApiError(401, "Unauthorized you are not authorized to create an event");
        }

        let agendaId, venueId, locationId;

        const createdLocation = await locationService.createLocation(location);
        locationId = createdLocation.id;

        const createdVenue = await venueService.createVenue({ ...venue, locationId })
        venueId = createdVenue.id;


        const event = await db.event.create({
            data: {
                title,
                description,
                category,
                tags,
                date,
                agendaId,
                organizerProfileId: user.organizerProfile.id,
                venueId,
                locationId,
            }
        })

        await agendasService.createAgenda(event.id, agendas);
        await sponsorService.createSponsors(event.id, sponsors);
        await ticketService.createTicketTypes(event.id, ticketTypes);
        await promocodeService.createPromocode(event.id, promocodes);

        //return the event
        return event;
    }

    // update an event
    async updateEvent(req: Request) {
        const { title, description, category, tags, date, agendas, location, ticketTypes, sponsors } = req.body;
        const { eventId } = req.params;
        const eventUpdateData = {
            title,
            description,
            category,
            tags,
            date
        }

        if (!eventId) {
            throw new ApiError(400, "Please provide the event id to update an event");
        }

        //lets find the event now
        const event = await db.event.findFirst({
            where: { id: +eventId }
        });

        if (!event) {
            throw new ApiError(404, "No event was found for this event id, please provide a valid event id");
        }

        // check if the person updating it is a valid user and organizer or not
        const user = req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized, you ar not authorized to update the event")
        }

        // lets find the organizer
        const organizer = await db.organizerProfile.findFirst({
            where: {
                userId: user.id,
            }
        })

        if (!user || user.role !== Role.ORGANIZER || !organizer || event.organizerProfileId !== organizer.id) {
            throw new ApiError(401, "Unauthorized, you are not authorized to update the event")
        }

        //update the event now
        const updatedEvent = await db.event.update({
            where: {
                id: event.id
            },
            data: eventUpdateData
        })

        // if agendas, location, ticketTypes, sponsors are present update them with the respective services
    }

    // delete an event
    async deleteEvent(req: Request) {
        const { eventId } = req.params;

        if (!eventId) {
            throw new ApiError(400, "Please provide an event id to delete the event");
        }

        //find event with the event id
        const event = await db.event.findFirst({
            where: {
                id: +eventId,
                deletedAt: null
            }
        })

        if (!event) {
            throw new ApiError(404, "Please provide a valid event id to delete an event");
        }

        // check if the user is authorized to delete the event
        const user = req.user;

        if (!user) {
            throw new ApiError(403, "Unauthorized you are not authorized to delete the event")
        }
        const organizer = await db.organizerProfile.findFirst({
            where: {
                userId: user.id,
                deletedAt: null
            }
        })

        if (!organizer || event.organizerProfileId !== organizer.id) {
            throw new ApiError(403, "Unauthorized you are not authorized to delete the event");
        }

        //soft delete now
        const deletedEvent = await db.event.update({
            where: {
                id: event.id,
            },
            data: {
                deletedAt: new Date(Date.now())
            }
        })
        return deletedEvent;
    }

    // get all events
    async getAllEvents(req: Request) {
        const events = await db.event.findMany();
        if (!events) {
            throw new ApiError(404, "No events found")
        }
        return events;
    }

    // get event by id
    async getEventById(req: Request) {
        const { eventId } = req.query;

        if (!eventId) {
            throw new ApiError(400, "Please provide a valid event id")
        }

        const event = await db.event.findFirst({
            where: {
                id: +eventId
            }
        })

        if (!event) {
            throw new ApiError(400, "Please provide a valid event id");
        }

        return event;
    }

    // get events by an organizer
    async getEventsForAnOrganizer(req: Request) {
        const { organizerId } = req.params;

        if (!organizerId) {
            throw new ApiError(400, "Please provide a valid organizer id to get the events");
        }

        //get all the events
        const events = await db.event.findMany({
            where: {
                organizerProfileId: +organizerId
            }
        })

        if (!events) {
            throw new ApiError(404, "No events were found for the organizer id");
        }

        return events;
    }

    // get event by category 
    async getEventsByCategory(req: Request) {
        const { category } = req.params;

        if (!category) {
            throw new ApiError(400, "Please provide a valid category")
        }

        // Normalize input: trim spaces and convert to uppercase for comparison
        const normalizedCategory = (category as string).trim().toUpperCase();
        const matchedCategory = Object.values(EventCategory).find(
            (cat) => cat.toUpperCase() === normalizedCategory
        );
        if (!matchedCategory) {
            throw new ApiError(400, "Invalid category provided");
        }
        const events = await db.event.findMany({
            where: {
                category: matchedCategory as EventCategory
            }
        });

        if (!events) {
            throw new ApiError(404, "No events found for this category")
        }
    }

    // search event
    async searchEvents(req: Request) {
        const { searchTerm, category, from, to } = req.query;

        // Initialize an empty filter object
        const filter: any = {};

        // Add filters dynamically based on query parameters
        if (searchTerm && searchTerm !== 'null') {
            filter.title = { contains: searchTerm, mode: 'insensitive' };
        }

        if (category && category !== 'null') {
            filter.category = category;
        }

        if (from && to) {
            filter.date = { gte: new Date(from as string), lte: new Date(to as string) }; // Ensures "date" matches the range
        }

        // Fetch events matching the filter
        const events = await db.event.findMany({
            where: filter,
            include: {
                location: true,
                venue: true,
            }
        });

        return events;
    };
}