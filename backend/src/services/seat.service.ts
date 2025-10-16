import db from "../config/db";

class SeatService {
    async createSeat(data: { label: string, sectionId: number, isBooked?: boolean }) {
        const seat = await db.seat.create({
            data,
        });
        return seat;
    }

    async createSeats(seats: { label: string, sectionId: number, isBooked?: boolean }[]) {
        const createdSeats = await db.seat.createMany({
            data: seats,
        });
        return createdSeats;
    }
}

export const seatService = new SeatService();