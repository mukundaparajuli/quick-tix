import db from "../config/db";

class VenueService {

    async createVenue(name: string, location: string, capacity: number) {
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
        const event = await db.event.update({
            where: { id: eventId },
            data: { venueId },
        });
        return event;
    }

    async getVenueByEventId(eventId: number) {
        const venue = await db.venue.findFirst({
            where: { events: { some: { id: eventId } } },
        });
        return venue;
    }
}

export const venueService = new VenueService();
