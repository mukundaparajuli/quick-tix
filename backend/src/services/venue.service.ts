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
}

export const venueService = new VenueService();
