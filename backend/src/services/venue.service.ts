import db from "../config/db";
import ApiError from "../types/api-error";

class VenueService {

    async createVenue(name: string, location: string, capacity: number, eventId?: number) {
        if (eventId) {
            const event = await db.event.findUnique({
                where: { id: eventId }
            });

            if (!event) {
                throw new ApiError(404, "Event not found");
            }

            if (event.capacity && capacity !== event.capacity) {
                throw new ApiError(400,
                    `Venue capacity (${capacity}) must equal event capacity (${event.capacity}). ` +
                    `Total seats in the venue should match the event's total ticket count.`
                );
            }
        }

        const venue = await db.venue.create({
            data: {
                name,
                location,
                capacity,
            },
        });
        return venue;
    }

    async associateVenueWithEvent(venueId: number, eventId: number) {
        const [venue, event] = await Promise.all([
            db.venue.findUnique({ where: { id: venueId } }),
            db.event.findUnique({ where: { id: eventId } })
        ]);

        if (!venue) {
            throw new ApiError(404, "Venue not found");
        }

        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        // Venue capacity must equal event capacity
        if (event.capacity && venue.capacity && venue.capacity !== event.capacity) {
            throw new ApiError(400,
                `Venue capacity (${venue.capacity}) must equal event capacity (${event.capacity}). ` +
                `Total seats in the venue should match the event's total ticket count.`
            );
        }

        const updatedEvent = await db.event.update({
            where: { id: eventId },
            data: { venueId },
        });
        return updatedEvent;
    }

    async getVenueByEventId(eventId: number) {
        const venue = await db.venue.findFirst({
            where: { events: { some: { id: eventId } } },
        });
        return venue;
    }

    async getVenueCapacityInfo(venueId: number) {
        const venue = await db.venue.findUnique({
            where: { id: venueId },
            include: {
                sections: {
                    include: {
                        _count: {
                            select: { seats: true }
                        }
                    }
                },
                events: {
                    take: 1,
                    select: { capacity: true }
                }
            }
        });

        if (!venue) {
            throw new ApiError(404, "Venue not found");
        }

        const eventCapacity = venue.events[0]?.capacity || null;
        const totalSectionCapacity = venue.sections.reduce((acc, section) => acc + (section.capacity || 0), 0);
        const totalSeatsCreated = venue.sections.reduce((acc, section) => acc + section._count.seats, 0);

        // Calculate consistency status
        const isConsistent =
            (!eventCapacity || venue.capacity === eventCapacity) &&
            (!venue.capacity || totalSectionCapacity === venue.capacity) &&
            venue.sections.every(s => !s.capacity || s._count.seats === s.capacity);

        return {
            eventCapacity,
            venueCapacity: venue.capacity,
            totalSectionCapacity,
            totalSeatsCreated,
            isConsistent,
            remainingSectionCapacity: (venue.capacity || 0) - totalSectionCapacity,
            sectionsInfo: venue.sections.map(section => ({
                id: section.id,
                name: section.name,
                capacity: section.capacity,
                seatsCreated: section._count.seats,
                remainingSeats: (section.capacity || 0) - section._count.seats,
                isFull: section.capacity ? section._count.seats === section.capacity : false
            }))
        };
    }
}

export const venueService = new VenueService();
