import { SeatStatus } from "@prisma/client";
import db from "../config/db";

type SeatByTicketType = {
    ticketTypeId: number;
    sections: string[];
    rowsPerSection: string[];
    seatsPerRow: number;
}

export class SeatService {

    //for one ticket type
    async createSeatForATicketType(venueId: number, ticketTypeId: number, sections: string[], rowsPerSection: string[], seatsPerRow: number) {
        const seats = [];
        for (const section of sections) {
            for (const row of rowsPerSection) {
                for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
                    seats.push({
                        venueId,
                        ticketTypeId,
                        seatNumber: `${seatNum}`,
                        row,
                        section,
                        status: SeatStatus.AVAILABLE,
                    });
                }
            }
        }
        return await db.seat.createMany({ data: seats });
    }

    // for multiple ticket types
    async createSeatsForVenue(venueId: number, seats: SeatByTicketType[]) {
        let createdSeatsForAVenue = [];
        for (const seat of seats) {
            // here each seat has different ticket types
            const createdSeats = await this.createSeatForATicketType(
                venueId,
                seat.ticketTypeId,
                seat.sections,
                seat.rowsPerSection,
                seat.seatsPerRow
            )

            // here each createdSeats differ by ticket types
            createdSeatsForAVenue.push(createdSeats);
        }

        return createdSeatsForAVenue;
    }
}

export const seatService = new SeatService();