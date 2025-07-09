import db from "../config/db";
import ApiError from "../types/api-error";

type Venue = {
    name: string;
    capacity: number;
    amenities: string[];
    locationId: number;
}

export class VenueService {

    // create venue
    async createVenue(venue: Venue) {
        const { name, capacity, amenities, locationId } = venue;
        if (!name || !capacity || !amenities || !locationId) {
            throw new ApiError(400, "Please provide the valid fields to create a venue");
        }

        if (!venue) {
            throw new ApiError(404, "Please provide venue info");
        }

        const createdVenue = await db.venue.create({
            data: venue,
        })

        if (!createdVenue) {
            throw new ApiError(500, "Error occured while creating an event")
        }
    }


}