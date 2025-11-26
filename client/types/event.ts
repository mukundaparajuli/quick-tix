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
    media?: Media[];
}

export type Media = {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    size?: number;
    altText?: string;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
}