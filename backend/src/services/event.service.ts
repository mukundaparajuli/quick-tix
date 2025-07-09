import { Request } from "express";
import ApiError from "../types/api-error";
import { Role } from "@prisma/client";
import db from "../config/db";

export class EventServices {
    async createEvent(req: Request) {
        const { title, description, category, tags, date, agendas, location, ticketTypes, sponsors } = req.body;

        if (!title || !description || !category || !tags || !date || !agendas || !location || !ticketTypes || !sponsors) {
            throw new ApiError(400, "Please fill all the necessary fields");
        }

        //check if the user is verified and has the organizer profile
        const user = req.user;
        if (!user || user.role === Role.ORGANIZER) {
            throw new ApiError(401, "Unauthorized you are not authorized to create an event");
        }

        let agendaId, venueId, locationId;
        // use agneda service, venue service and location service to create and return their respective ids


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

        //provide the event id while creating sponsors and tickettypes
        // ticketservice and sponsors service will create the respective data

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
}