import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Event } from "@/types/event";
import { Facility } from "@/types/facility";
import { Section } from "@/types/section";
import { TicketType } from "@/types/ticket-type";
import { Venue } from "@/types/venue";
import { Seats } from "@/types/seat";

interface EventStoreState {
    event: Event | null;
    ticketTypes: TicketType[] | null;
    venue: Venue | null;
    sections: Section[] | null;
    facilities: Facility[] | null;
    seats: Seats[] | null;
}

interface EventStoreActions {
    setEvent: (event: Event | null) => void;
    setTicketTypes: (
        updater: TicketType[] | null | ((prev: TicketType[] | null) => TicketType[] | null)
    ) => void;
    setVenue: (venue: Venue | null) => void;
    setSections: (sections: Section[] | null) => void;
    setFacilities: (facilities: Facility[] | null) => void;
    setSeats: (seats: Seats[] | null) => void;
    resetEvent: () => void;
}

const initialState: EventStoreState = {
    event: null,
    ticketTypes: null,
    venue: null,
    sections: null,
    facilities: null,
    seats: null
};

const useEventStore = create<EventStoreState & EventStoreActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            setEvent: (event) => set({ event }),

            setTicketTypes: (updater) =>
                set((state) => ({
                    ticketTypes:
                        typeof updater === "function"
                            ? updater(state.ticketTypes)
                            : updater,
                })),

            setVenue: (venue) => set({ venue }),
            setSections: (sections) => set({ sections }),
            setFacilities: (facilities) => set({ facilities }),
            setSeats: (seats) => set({ seats }),
            resetEvent: () => set(initialState),
        }),
        {
            name: "event-storage",
            partialize: (state) => ({
                event: state.event,
                ticketTypes: state.ticketTypes,
                venue: state.venue,
                sections: state.sections,
                facilities: state.facilities,
                seats: state.seats,
            }),
        }
    )
);

export default useEventStore;
