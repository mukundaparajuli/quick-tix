// services/venueService.ts

import db from "../config/db";


export const addVenue = async (venueData: { name: string, capacity: number, amenities: string[], description: string, locId: number }) => {
    const { name, capacity, amenities, description, locId } = venueData;

    const isLocationValid = await db.location.findUnique({
        where: { id: locId },
    });

    if (!isLocationValid) {
        throw new Error("The location you provided is invalid. Please provide a valid location.");
    }

    const venueExists = await db.venue.findFirst({
        where: { name, capacity, locationId: locId },
    });

    if (venueExists) {
        return venueExists;
    }


    const newVenue = await db.venue.create({
        data: {
            name,
            capacity,
            amenities,
            description,
            location: { connect: { id: locId } },
        },
    });

    return newVenue;
};

export default addVenue;