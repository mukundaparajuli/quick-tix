import db from "../config/db";
import ApiError from "../types/api-error";

type CreateSeatRequest = {
    sectionId: number;
    row: number;
    column: number;
};

type CreateSeat = {
    label: string;
    sectionId: number;
};

class SeatService {
    async createSeat(data: { label: string; sectionId: number; isBooked?: boolean }) {
        // Validate against section capacity
        const section = await db.section.findUnique({
            where: { id: data.sectionId },
            include: {
                _count: {
                    select: { seats: true }
                }
            }
        });

        if (!section) {
            throw new ApiError(404, "Section not found");
        }

        if (section.capacity && section._count.seats >= section.capacity) {
            throw new ApiError(400,
                `Section "${section.name}" has reached its capacity of ${section.capacity} seats`
            );
        }

        const seat = await db.seat.create({ data });
        return seat;
    }

    private getRowLabel(rowIndex: number): string {
        let label = "";
        let n = rowIndex + 1;
        while (n > 0) {
            n--;
            label = String.fromCharCode((n % 26) + 65) + label;
            n = Math.floor(n / 26);
        }
        return label;
    }

    async generateSeats(
        sectionId: number,
        startRowIndex: number,
        rowCount: number,
        columnCount: number
    ) {
        // Validate capacity before generating seats
        const section = await db.section.findUnique({
            where: { id: sectionId },
            include: {
                _count: {
                    select: { seats: true }
                },
                venue: true
            }
        });

        if (!section) {
            throw new ApiError(404, "Section not found");
        }

        const seatsToCreate = rowCount * columnCount;
        const currentSeats = section._count.seats;
        const totalSeatsAfterCreation = currentSeats + seatsToCreate;

        // Check section capacity
        if (section.capacity && totalSeatsAfterCreation > section.capacity) {
            const remainingCapacity = section.capacity - currentSeats;
            throw new ApiError(400,
                `Cannot create ${seatsToCreate} seats. Section "${section.name}" has capacity for ${section.capacity} seats. ` +
                `Currently ${currentSeats} seats exist. You can only add ${remainingCapacity} more seats.`
            );
        }

        // Also validate against venue capacity
        if (section.venue) {
            const venueWithSections = await db.venue.findUnique({
                where: { id: section.venue.id },
                include: {
                    sections: {
                        include: {
                            _count: {
                                select: { seats: true }
                            }
                        }
                    }
                }
            });

            if (venueWithSections && venueWithSections.capacity) {
                const totalSeatsInVenue = venueWithSections.sections.reduce(
                    (acc, s) => acc + s._count.seats, 0
                );
                const totalAfterCreation = totalSeatsInVenue + seatsToCreate;

                if (totalAfterCreation > venueWithSections.capacity) {
                    const remainingVenueCapacity = venueWithSections.capacity - totalSeatsInVenue;
                    throw new ApiError(400,
                        `Cannot create ${seatsToCreate} seats. Venue "${venueWithSections.name}" has capacity for ${venueWithSections.capacity} total seats. ` +
                        `Currently ${totalSeatsInVenue} seats exist across all sections. You can only add ${remainingVenueCapacity} more seats.`
                    );
                }
            }
        }

        const seats = [];
        for (let j = 0; j < rowCount; j++) {
            const rowLabel = this.getRowLabel(startRowIndex + j);
            for (let k = 0; k < columnCount; k++) {
                seats.push({
                    label: `${rowLabel}${k + 1}`,
                    sectionId,
                });
            }
        }
        return seats;
    }

    async getSeatsBySection(sectionId: number) {
        const seats = await db.seat.findMany({ where: { sectionId } });
        return seats;
    }

    async checkSeatAvailability(sectionId: number) {
        const section = await db.section.findFirst({
            where: { id: sectionId },
            include: {
                _count: {
                    select: { seats: true }
                }
            }
        });

        const totalCapacity = section?.capacity || 0;
        const createdSeats = section?._count?.seats || 0;
        const availableSlots = totalCapacity - createdSeats;

        return {
            sectionId,
            sectionName: section?.name,
            capacity: totalCapacity,
            createdSeats,
            availableSlots,
            canAddMore: availableSlots > 0
        };
    }

    async getSeatById(seatId: number) {
        const seat = await db.seat.findUnique({ where: { id: seatId } });
        return seat;
    }

    async getCapacitySummary(venueId: number) {
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
        const venueCapacity = venue.capacity;
        const totalSectionCapacity = venue.sections.reduce((acc, s) => acc + (s.capacity || 0), 0);
        const totalSeatsCreated = venue.sections.reduce((acc, s) => acc + s._count.seats, 0);

        // Calculate consistency checks
        const venueMatchesEvent = !eventCapacity || !venueCapacity || venueCapacity === eventCapacity;
        const sectionsMatchVenue = !venueCapacity || totalSectionCapacity === venueCapacity;
        const seatsMatchSections = venue.sections.every(s => !s.capacity || s._count.seats === s.capacity);
        const isFullyConfigured = venueMatchesEvent && sectionsMatchVenue && seatsMatchSections;

        // Generate warnings/info messages
        const warnings: string[] = [];
        const info: string[] = [];

        // Check venue vs event capacity
        if (eventCapacity && venueCapacity && venueCapacity !== eventCapacity) {
            warnings.push(`Venue capacity (${venueCapacity}) must equal event capacity (${eventCapacity})`);
        }

        // Check sections vs venue capacity
        if (venueCapacity) {
            if (totalSectionCapacity < venueCapacity) {
                const remaining = venueCapacity - totalSectionCapacity;
                info.push(`${remaining} more seats need to be allocated to sections`);
            } else if (totalSectionCapacity > venueCapacity) {
                warnings.push(`Total section capacity (${totalSectionCapacity}) exceeds venue capacity (${venueCapacity})`);
            }
        }

        // Check seats vs section capacity
        venue.sections.forEach(s => {
            if (s.capacity) {
                if (s._count.seats < s.capacity) {
                    const remaining = s.capacity - s._count.seats;
                    info.push(`Section "${s.name}": ${remaining} more seats to create`);
                } else if (s._count.seats > s.capacity) {
                    warnings.push(`Section "${s.name}" has ${s._count.seats} seats but capacity is ${s.capacity}`);
                }
            }
        });

        return {
            eventCapacity,
            venueCapacity,
            totalSectionCapacity,
            totalSeatsCreated,
            isFullyConfigured,
            checks: {
                venueMatchesEvent,
                sectionsMatchVenue,
                seatsMatchSections
            },
            warnings,
            info,
            remainingSectionCapacity: (venueCapacity || 0) - totalSectionCapacity,
            remainingSeats: totalSectionCapacity - totalSeatsCreated,
            sections: venue.sections.map(s => ({
                id: s.id,
                name: s.name,
                capacity: s.capacity,
                seatsCreated: s._count.seats,
                remainingSlots: (s.capacity || 0) - s._count.seats,
                isFull: s.capacity ? s._count.seats === s.capacity : false,
                isOverCapacity: s.capacity ? s._count.seats > s.capacity : false
            }))
        };
    }
}

export const seatService = new SeatService();
