import db from "../config/db";
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
    async createSeat(data: { label: string, sectionId: number, isBooked?: boolean }) {
        const seat = await db.seat.create({
            data,
        });
        return seat;
    }

    async generateSeats(
        sectionId: number,
        startRowIndex: number,
        rowCount: number,
        columnCount: number
    ) {
        const seats = [];
        for (let j = 0; j < rowCount; j++) {
            const rowLabel = String.fromCharCode(65 + startRowIndex + j); // A, B, C...
            for (let k = 0; k < columnCount; k++) {
                seats.push({
                    label: `${rowLabel}${k + 1}`,
                    sectionId,
                });
            }
        }
        return seats;
    };

    async getSeatsBySection(sectionId: number) {
        const seats = await db.seat.findMany({
            where: { sectionId },
        });
        return seats;
    }


}

export const seatService = new SeatService();