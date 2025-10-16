import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { ticketTypeService } from "../services/ticket-type.service";
import ApiResponse from "../types/api-response";

export const createTicketType = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, quantity, eventId, capacity } = req.body;

    // Basic validation
    if (!name || !price || !quantity || !eventId) {
        return res.status(400).json({ message: "Name, price, quantity, and eventId are required" });
    }

    // Ensure the user is an organizer
    const user = req.user;
    if (!user || !user.organizerProfile) {
        return res.status(403).json({ message: "Only organizers can create ticket types" });
    }

    const ticketType = await ticketTypeService.createTicketType(eventId, name, description, price, capacity);
    return new ApiResponse(res, 201, "Ticket type created successfully", ticketType);
});