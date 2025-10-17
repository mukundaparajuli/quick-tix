import { create } from "zustand";

interface EventWizardState {
    eventId: number | null;
    eventData: {
        title?: string;
        description?: string;
        date?: Date;
        location?: string;
        capacity?: number;
    };
    ticketTypes: any[];
    sections: any[];
    seats: any[];
    setEventId: (id: number) => void;
    setEventData: (data: Partial<EventWizardState["eventData"]>) => void;
    addTicketType: (ticket: any) => void;
    addSection: (section: any) => void;
    addSeats: (seats: any[]) => void;
    resetWizard: () => void;
}

export const useEventStore = create<EventWizardState>((set) => ({
    eventId: null,
    eventData: {},
    ticketTypes: [],
    sections: [],
    seats: [],
    setEventId: (id) => set({ eventId: id }),
    setEventData: (data) =>
        set((state) => ({ eventData: { ...state.eventData, ...data } })),
    addTicketType: (ticket) =>
        set((state) => ({ ticketTypes: [...state.ticketTypes, ticket] })),
    addSection: (section) =>
        set((state) => ({ sections: [...state.sections, section] })),
    addSeats: (seats) =>
        set((state) => ({ seats: [...state.seats, ...seats] })),
    resetWizard: () =>
        set({ eventId: null, eventData: {}, ticketTypes: [], sections: [], seats: [] }),
}));
