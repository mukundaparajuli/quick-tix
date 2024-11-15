export type Location = {
    address: string;
    city: string;
    country: string;
    state: string;
};

export type Venue = {
    name: string;
    description: string;
    capacity: number;
    amenities: string[];
};

export type EventType = {
    id: number;
    title: string;
    description: string;
    date: string; // ISO 8601 format
    totalTickets: number;
    availableTickets: number;
    price: number;
    organizerName: string;
    organizerEmail: string;
    category: string; // Can be a union of predefined categories like 'THEATER_PERFORMANCES' | 'CONCERTS', etc.
    location: Location;
    venue: Venue;
};
