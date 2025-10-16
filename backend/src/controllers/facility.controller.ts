import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { facilityService } from "../services/facility.service";
import ApiResponse from "../types/api-response";

export const createFacility = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, ticketTypeId } = req.body;

    // Basic validation
    if (!name || !ticketTypeId) {
        return res.status(400).json({ message: "Name and ticketTypeId are required" });
    }

    const facility = await facilityService.createFacility(name, description, ticketTypeId);
    return new ApiResponse(res, 201, "Facility created successfully", facility);
});

export const createFacilities = asyncHandler(async (req: Request, res: Response) => {
    const facilities = req.body;

    // Basic validation
    if (!Array.isArray(facilities) || facilities.length === 0) {
        return res.status(400).json({ message: "Facilities data is required" });
    }

    const createdFacilities = await facilityService.createFacilities(facilities);
    return new ApiResponse(res, 201, "Facilities created successfully", createdFacilities);
});