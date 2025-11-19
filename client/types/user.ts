export type User = {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    role: "ATTENDEE" | "ORGANIZER" | "ADMIN";
    attendeeProfile?: attendeeProfile | null;
    organizerProfile?: organizerProfile | null;
}

type attendeeProfile = {
    id: string;
    userId: string;
    bio?: string;
    phone?: string;
    avatarId?: number;
    eventId: string;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
}

type organizerProfile = {
    id: string;
    userId: string;
    organizationName: string;
    bio?: string;
    website?: string;
    contactEmail: string;
    phone?: string;
    kycVerified: boolean;
    avatarId?: number;
    coverId?: number;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
}