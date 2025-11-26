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
        images?: string[];
    }) {
        const { images, ...eventData } = data;

        const event = await db.event.create({
            data: eventData,
        });

        // Create media records if images are provided
        if (images && images.length > 0) {
            await db.media.createMany({
                data: images.map(url => ({
                    url,
                    type: 'IMAGE' as const,
                    uploadedBy: eventData.organizerId,
                    eventMedia: {
                        connect: { id: event.id }
                    }
                }))
            });
        }

        // Return event with media
        return db.event.findUnique({
            where: { id: event.id },
            include: { media: true }
        });
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
        const eventDetails = await db.event.findFirst({
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
                },
                media: true
            }

        });
        return eventDetails;
    }
    async searchAndFilterEvents(filters: {
        q?: string;
        date?: string;
        category?: string;
    }) {
        const whereClause: any = {
            isPublished: false
        };

        if (filters.q) {
            whereClause.OR = [
                { title: { contains: filters.q, mode: "insensitive" } },
                { description: { contains: filters.q, mode: "insensitive" } },
                { location: { contains: filters.q, mode: "insensitive" } },
            ];
        }

        if (filters.date) {
            const filterDate = new Date(filters.date);
            whereClause.date = filterDate;
        }

        // if (filters.category) {
        //     whereClause.category = filters.category;
        // }

        const events = await db.event.findMany({
            where: whereClause,
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
}

export const eventService = new EventService();

