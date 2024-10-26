import { Role, SeatStatus } from "@prisma/client";

export interface User {
    fullName: string;
    username: string;
    email: string;
    role: Role,
    password: string;
};

export interface Event {
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

export interface Seat {
    id: number;              // Unique identifier for the seat
    seatNumber: number;      // Number of the seat
    rowId: number;           // Foreign key referencing the row
    status: SeatStatus;      // Status of the seat (e.g., AVAILABLE, BOOKED, LOCKED)
    createdAt: Date;         // Date when the seat was created
    updatedAt: Date;         // Date when the seat was last updated
}

export interface Row {
    id: number;              // Unique identifier for the row
    name: string;            // Name of the row (e.g., Row A)
    sectionId: number;       // Foreign key referencing the section
    seats: Seat[];           // Array of seats in the row
    createdAt: Date;         // Date when the row was created
    updatedAt: Date;         // Date when the row was last updated
}

export interface Section {
    id: number;              // Unique identifier for the section
    name: string;            // Name of the section (e.g., VIP, General)
    venueId: number;         // Foreign key referencing the venue
    rows: Row[];             // Array of rows in the section
    createdAt: Date;         // Date when the section was created
    updatedAt: Date;         // Date when the section was last updated
}