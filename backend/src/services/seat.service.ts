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
    async createSeat(data: { label: string; sectionId: number; isBooked?: boolean }) {
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
        const section = await db.section.findFirst({ where: { id: sectionId } });
        const totalSeats = section?.capacity;
        const createdSeats = await db.seat.count({ where: { sectionId } });

        const availableSeats = (totalSeats || 0) - createdSeats;
        return availableSeats;
    }

    async getSeatById(seatId: number) {
        const seat = await db.seat.findUnique({ where: { id: seatId } });
        return seat;
    }
}

export const seatService = new SeatService();
