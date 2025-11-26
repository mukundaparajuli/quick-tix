import db from "../config/db";

class TicketTypeService {
    async createTicketType(eventId: number, name: string, description: string, price: number, capacity: number) {
        const ticketType = await db.ticketType.create({
            data: {
                eventId,
                name,
                description,
                price,
                capacity,
            },
        });
        return ticketType;
    }

    async getTicketTypeById(ticketTypeId: number) {
        const ticketType = await db.ticketType.findUnique({
            where: { id: ticketTypeId },
        });
        return ticketType;
    }
}

export const ticketTypeService = new TicketTypeService();