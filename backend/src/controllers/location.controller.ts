// add a location
// has no relation with anyone

import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";

// add location
export const addLocation = asyncHandler(async (req: Request, res: Response) => {
    const { address, city, state, country } = req.body;

    if (!address || !city || !state || !country) {
        return new ApiResponse(res, 409, "All fields are mandatory");
    }

    // check if location already exsits
    const locationExists = await db.location.findFirst({
        where: {
            address, city, state, country
        }
    })

    if (locationExists) {
        return new ApiResponse(res, 401, "Location already exists");
    }

    // register the location
    const newLocation = await db.location.create({
        data: {
            address,
            city,
            state,
            country
        }
    })

    return new ApiResponse(res, 201, "Location created successfully", newLocation);
})
