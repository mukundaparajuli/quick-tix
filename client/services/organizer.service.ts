import { $axios } from "@/lib/axios";

// Types
export interface OrganizerStats {
    events: {
        total: number;
        published: number;
        drafts: number;
    };
    bookings: {
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
    };
    earnings: {
        total: number;
    };
    recentBookings: RecentBooking[];
    upcomingEvents: UpcomingEvent[];
}

export interface RecentBooking {
    id: number;
    status: string;
    paymentStatus: string;
    totalPrice: number;
    createdAt: string;
    event: { title: string };
    attendee: {
        user: { name: string; email: string };
    };
    payment: { amount: number; status: string } | null;
}

export interface UpcomingEvent {
    id: number;
    title: string;
    date: string;
    location: string;
    isPublished: boolean;
    bookingCount: number;
    media: { url: string }[];
}

export interface OrganizerBooking {
    id: number;
    status: string;
    paymentStatus: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    event: {
        id: number;
        title: string;
        date: string;
        location: string;
    };
    attendee: {
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    seats: {
        id: number;
        label: string;
        section: { name: string };
    }[];
    payment: {
        id: number;
        amount: number;
        status: string;
        method: string;
        paidAt: string | null;
        transactionId: string | null;
    } | null;
}

export interface BookingsResponse {
    bookings: OrganizerBooking[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
}

export interface OrganizerEarnings {
    totalEarnings: number;
    totalTransactions: number;
    recentPayments: PaymentRecord[];
    earningsByEvent: EventEarning[];
    earningsByMonth: MonthlyEarning[];
}

export interface PaymentRecord {
    id: number;
    amount: number;
    status: string;
    method: string;
    paidAt: string;
    transactionId: string | null;
    booking: {
        id: number;
        event: { id: number; title: string };
        attendee: { user: { name: string; email: string } };
    };
}

export interface EventEarning {
    eventId: number;
    eventTitle: string;
    totalEarnings: number;
    totalBookings: number;
}

export interface MonthlyEarning {
    month: string;
    earnings: number;
    bookings: number;
}

export interface UpdateEventData {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    capacity?: number;
}

// API functions
export const getOrganizerStats = async (): Promise<OrganizerStats> => {
    const response = await $axios.get("/organizer/stats");
    return response.data.data;
};

export const getOrganizerEvents = async () => {
    const response = await $axios.get("/organizer/events");
    return response.data.data;
};

export const getOrganizerBookings = async (params?: {
    eventId?: number;
    status?: string;
    page?: number;
    limit?: number;
}): Promise<BookingsResponse> => {
    const response = await $axios.get("/organizer/bookings", { params });
    return response.data.data;
};

export const getOrganizerBookingDetails = async (bookingId: number) => {
    const response = await $axios.get(`/organizer/bookings/${bookingId}`);
    return response.data.data;
};

export const getOrganizerEarnings = async (params?: {
    startDate?: string;
    endDate?: string;
}): Promise<OrganizerEarnings> => {
    const response = await $axios.get("/organizer/earnings", { params });
    return response.data.data;
};

export const updateEvent = async (eventId: number, data: UpdateEventData) => {
    const response = await $axios.put(`/organizer/events/${eventId}`, data);
    return response.data.data;
};
