import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";

// add a venue
export const addVenue = asyncHandler(async (req: Request, res: Response) => {
    const { name, capacity, amenities, description, locationId } = req.body;


    // check if everything is available or not
    if (!name || !capacity || !locationId) {
        return new ApiResponse(res, 400, "All fields are required");
    }

    // check if the location is valid
    const isLocationValid = await db.location.findUnique({
        where: {
            id: locationId
        }
    })

    if (!isLocationValid) {
        return new ApiResponse(res, 400, "The location you provided is invalid please provide a valid location");
    }

    // check if venue already exists
    const venueExists = await db.venue.findFirst({
        where: { name, capacity, locationId }
    })

    if (venueExists) {
        return new ApiResponse(res, 409, "Venue already exists");
    }

    // register the venue
    const newVenue = await db.venue.create({
        data: {
            name,
            capacity,
            amenities,
            description,
            location: { connect: { id: locationId } }
        }
    })

    return new ApiResponse(res, 201, "Venue added successfully", newVenue)


})
