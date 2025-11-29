import db from "../config/db";
import ApiError from "../types/api-error";

export class SectionService {
    async createSection(data: { name: string, capacity: number, venueId: number }) {
        // Get venue and existing sections
        const venue = await db.venue.findUnique({
            where: { id: data.venueId },
            include: {
                sections: true
            }
        });

        if (!venue) {
            throw new ApiError(404, "Venue not found");
        }

        // Calculate total existing section capacity
        const existingSectionCapacity = venue.sections.reduce((acc, section) => acc + (section.capacity || 0), 0);
        const newTotalCapacity = existingSectionCapacity + data.capacity;

        // Section capacities must not exceed venue capacity (and ultimately must equal it)
        if (venue.capacity && newTotalCapacity > venue.capacity) {
            const remainingCapacity = venue.capacity - existingSectionCapacity;
            throw new ApiError(400,
                `Section capacity (${data.capacity}) would exceed venue capacity. ` +
                `Venue capacity: ${venue.capacity}, Already allocated: ${existingSectionCapacity}, ` +
                `Remaining to allocate: ${remainingCapacity}. ` +
                `Total section capacities must equal venue capacity.`
            );
        }

        const section = await db.section.create({
            data,
        });

        // Return section with info about remaining capacity to allocate
        const remainingToAllocate = (venue.capacity || 0) - newTotalCapacity;
        return {
            ...section,
            capacityInfo: {
                venueCapacity: venue.capacity,
                totalAllocated: newTotalCapacity,
                remainingToAllocate,
                isFullyAllocated: remainingToAllocate === 0
            }
        };
    }

    async getSectionsByVenueId(venueId: number) {
        const sections = await db.section.findMany({
            where: { venueId },
        });
        return sections;
    }

    async getSectionCapacityInfo(sectionId: number) {
        const section = await db.section.findUnique({
            where: { id: sectionId },
            include: {
                _count: {
                    select: { seats: true }
                }
            }
        });

        if (!section) {
            throw new ApiError(404, "Section not found");
        }

        return {
            sectionId: section.id,
            sectionName: section.name,
            capacity: section.capacity,
            seatsCreated: section._count.seats,
            remainingSeats: (section.capacity || 0) - section._count.seats,
            isFull: section.capacity ? section._count.seats === section.capacity : false
        };
    }

    async validateSectionCapacity(venueId: number) {
        const venue = await db.venue.findUnique({
            where: { id: venueId },
            include: {
                sections: {
                    include: {
                        _count: {
                            select: { seats: true }
                        }
                    }
                },
                events: {
                    take: 1,
                    select: { capacity: true }
                }
            }
        });

        if (!venue) {
            throw new ApiError(404, "Venue not found");
        }

        const eventCapacity = venue.events[0]?.capacity || null;
        const totalSectionCapacity = venue.sections.reduce((acc, s) => acc + (s.capacity || 0), 0);
        const totalSeatsCreated = venue.sections.reduce((acc, s) => acc + s._count.seats, 0);

        // Check all consistency rules
        const venueMatchesEvent = !eventCapacity || venue.capacity === eventCapacity;
        const sectionsMatchVenue = !venue.capacity || totalSectionCapacity === venue.capacity;
        const seatsMatchSections = venue.sections.every(s => !s.capacity || s._count.seats === s.capacity);

        return {
            isValid: venueMatchesEvent && sectionsMatchVenue && seatsMatchSections,
            eventCapacity,
            venueCapacity: venue.capacity,
            totalSectionCapacity,
            totalSeatsCreated,
            checks: {
                venueMatchesEvent,
                sectionsMatchVenue,
                seatsMatchSections
            },
            remainingToAllocate: (venue.capacity || 0) - totalSectionCapacity,
            sections: venue.sections.map(s => ({
                id: s.id,
                name: s.name,
                capacity: s.capacity,
                seatsCreated: s._count.seats,
                remainingSeats: (s.capacity || 0) - s._count.seats,
                isFull: s.capacity ? s._count.seats === s.capacity : false,
                isOverCapacity: s.capacity ? s._count.seats > s.capacity : false
            }))
        };
    }
}

export const sectionService = new SectionService();