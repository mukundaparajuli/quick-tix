import db from "../config/db";

export class SectionService {
    async createSection(data: { name: string, capacity: number, venueId: number }) {
        const section = await db.section.create({
            data,
        });
        return section;
    }

    async getSectionsByVenueId(venueId: number) {
        const sections = await db.section.findMany({
            where: { venueId },
        });
        return sections;
    }
}

export const sectionService = new SectionService();