import db from "../config/db";

class SectionService {
    async createSection(data: { name: string, capacity: number, venueId: number }) {
        const section = await db.section.create({
            data,
        });
        return section;
    }
}

export const sectionService = new SectionService();