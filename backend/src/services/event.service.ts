import db from "../config/db";
import ApiError from "../types/api-error";

class EventService {
    async createEvent(data: {
        title: string;
        description?: string;
        date: Date;
        location: string;
        capacity: number;
        organizerId: number;
    }) {
        const event = await db.event.create({
            data,
        });
        return event;
    }

    async markEventAsPublished(eventId: number) {
        const event = await db.event.findFirst({
            where: {
                id: eventId
            }
        })

        if (!event) {
            throw new ApiError(404, "No event found for this event id.")
        }

        const publishedEvent = await db.event.update({
            where: {
                id: eventId
            },
            data: {
                isPublished: true
            }
        })

        return publishedEvent;
    }

    async getAllEvents() {
        const events = await db.event.findMany({
            include: {
                media: {
                    take: 1
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return events;
    }

    async getEventDetails(eventId: number) {
        const eventDetails = await db.event.findUnique({
            where: {
                id: eventId
            },
            include: {
                organizer: true,
                venue: {
                    include: {
                        sections: {
                            include: {
                                seats: true
                            }
                        }
                    }
                },
                ticketTypes: {
                    include: {
                        facilities: true
                    }
                }
            }

        });
        return eventDetails;
    }
}

export const eventService = new EventService();

