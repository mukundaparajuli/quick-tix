import db from "../config/db";

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
}

export const eventService = new EventService();