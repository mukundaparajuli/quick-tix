import db from "../config/db";
import ApiError from "../types/api-error";

type TicketType = {
    name: string;
    price: number;
    totalQuantity: number;
    availableQuantity: number;
    features: Record<string, any>;
}

export class TicketService {
    async createTicketTypes(eventId: number, ticketTypes: TicketType[]) {
        if (!eventId) {
            throw new ApiError(400, "Event id is required to create ticket types");
        }

        let createdTicketTypes = [];

        for (const ticketType of ticketTypes) {
            let { name, price, totalQuantity, availableQuantity, features } = ticketType;

            if (!name || !price || !totalQuantity || !features) {
                throw new ApiError(400, "Please provide the necessary fields to create a ticket type.", { name, price, totalQuantity, features });
            }

            if (!availableQuantity) {
                availableQuantity = totalQuantity;
            }

            const createdTicketType = await db.ticketType.create({
                data: {
                    name: ticketType.name,
                    price: ticketType.price,
                    totalQuantity: ticketType.totalQuantity,
                    availableQuantity: ticketType.availableQuantity,
                    features: ticketType.features,
                    eventId: eventId
                }
            })

            createdTicketTypes.push(createdTicketType);
        }
        return createdTicketTypes;
    }
}

export const ticketService = new TicketService();