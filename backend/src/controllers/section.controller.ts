import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { sectionService } from "../services/section.service";
import ApiResponse from "../types/api-response";

export const createSection = asyncHandler(async (req: Request, res: Response) => {
    const { name, capacity, venueId } = req.body;

    // Basic validation
    if (!name || !capacity || !venueId) {
        return res.status(400).json({ message: "Name, capacity, and venueId are required" });
    }

    const section = await sectionService.createSection({ name, capacity, venueId });
    return new ApiResponse(res, 201, "Section created successfully", section);
});