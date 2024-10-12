import { Role } from "@prisma/client";

export type User = {
    fullName: string;
    username: string;
    email: string;
    role: Role,
    password: string;
};

export type Event = {
    title: string;
    description: string,
    date: Date;
    location: string;
    price: number;
    totalTickets: number;
    availableTickets: number;
    organizer: User;
    bookings: []
}