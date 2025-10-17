export type TicketType = {
    id: string;
    name: string;
    description?: string;
    price: number;
    capacity?: number;
    sold: number;
    eventId: string;
    createdAt: string;
    updatedAt: string;
}