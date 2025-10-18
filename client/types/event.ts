export type Event = {
    id: string;
    title: string;
    description?: string;
    date: string;
    location: string;
    capacity?: number;
    venueId?: string;
    isPublished: boolean;
    organizerId: string;
    createdAt: string;
    updatedAt: string;
}