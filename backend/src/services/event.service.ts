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

        // Create media records first if images are provided
        let mediaIds: number[] = [];
        if (images && images.length > 0) {
            const mediaRecords = await Promise.all(
                images.map(url =>
                    db.media.create({
                        data: {
                            url,
                            type: 'IMAGE',
                            uploadedBy: eventData.organizerId,
                        }
                    })
                )
            );
            mediaIds = mediaRecords.map(m => m.id);
        }

        // Create event and connect media
        const event = await db.event.create({
            data: {
                ...eventData,
                media: mediaIds.length > 0 ? {
                    connect: mediaIds.map(id => ({ id }))
                } : undefined
            },
            include: { media: true }
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

    async deleteEvent(eventId: number, organizerId: number) {
        const event = await db.event.findFirst({
            where: {
                id: eventId,
                organizerId: organizerId
            }
        });

        if (!event) {
            throw new ApiError(404, "Event not found or you don't have permission to delete it.");
        }

        // Check if there are any bookings for this event
        const bookingsCount = await db.booking.count({
            where: {
                eventId: eventId
            }
        });

        if (bookingsCount > 0) {
            throw new ApiError(400, "Cannot delete event with existing bookings. Please cancel all bookings first.");
        }

        // Delete the event (cascades will handle related records based on schema)
        await db.event.delete({
            where: {
                id: eventId
            }
        });

        return { message: "Event deleted successfully" };
    }
}

export const eventService = new EventService();

