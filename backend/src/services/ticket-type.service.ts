import { TicketAvailability } from "@prisma/client";
import db from "../config/db";

interface TicketType {
    type: String;
    price: Float32Array;
    currency: String;
    ticketAvailability: TicketAvailability;
}

export default async function addTicketType({ ticketType }: { ticketType: TicketType }) {
    const addTicket = await db.ticketType.create({
        data: ticketType
    })
}