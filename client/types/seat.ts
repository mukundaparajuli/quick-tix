export type Seats = {
    id: string;
    label: string;
    sectionId: number;
    bookingId?: number;
    ticketTypeId?: number;
    isBooked?: boolean
    createdAt: string;
    updatedAt: string;
}

export type CreateSeat = {
    sectionId: number;
    row: number;
    column: number;
}