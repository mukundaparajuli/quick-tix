interface Location {
    id: number;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface OrganizerProfile {
    id: number;
    businessName: string;
    isKycVerified: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface Venue {
    id: number;
    name: string;
    capacity: number;
    amenities: string[];
    description: string | null;
    locationId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface Sponsor {
    id: number;
    name: string;
    website: string | null;
    eventId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface Agendas {
    id: number;
    createdAt: string;
    updatedAt: string;
}

interface TicketType {
    id: number;
    eventId: number;
    name: string;
    price: number;
    totalQuantity: number;
    availableQuantity: number;
    features: Record<string, any> | null; // JSON object, adjust based on actual structure
    availability: 'AVAILABLE' | 'SOLD_OUT';
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    category: string;
    images: string[];
    tags: string[];
    date: string;
    agendasId: number | null;
    organizerProfileId: number | null;
    venueId: number;
    locationId: number | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    location: Location | null;
    organizerProfile: OrganizerProfile | null;
    venue: Venue | null;
    sponsors: Sponsor[];
    agendas: Agendas | null;
    ticketTypes: TicketType[];
}