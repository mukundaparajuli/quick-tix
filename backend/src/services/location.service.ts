import db from "../config/db";
import ApiError from "../types/api-error";

type Location = {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
}

export class LocationService {
    async createLocation(location: Location) {
        const { address, city, state, country, latitude, longitude } = location;

        if (!address || !city || !state || !country) {
            throw new ApiError(400, "Please provide valid fields to create a location");
        }

        const createdLocation = await db.location.create({
            data: location
        })

        return createdLocation;
    }

    async updateLocation(id: number, location: Partial<Location>) {
        if (!id) {
            throw new ApiError(400, "Location ID is required for update");
        }
        if (!location || Object.keys(location).length === 0) {
            throw new ApiError(400, "At least one field must be provided to update the location");
        }

        const updatedLocation = await db.location.update({
            where: { id },
            data: location,
        });

        if (!updatedLocation) {
            throw new ApiError(500, "Error occurred while updating the venue");
        }

        return updatedLocation;
    }
}