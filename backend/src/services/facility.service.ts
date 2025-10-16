import db from "../config/db";

class FacilityService {
    async createFacility(name: string, description: string, ticketTypeId: number) {
        const facility = await db.facility.create({
            data: {
                name,
                description,
                ticketTypeId,
            },
        });
        return facility;
    }

    async createFacilities(facilities: { name: string; description?: string; ticketTypeId: number }[]) {
        const createdFacilities = await db.facility.createMany({
            data: facilities,
        });
        return createdFacilities;
    }
}

export const facilityService = new FacilityService();