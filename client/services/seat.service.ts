import { $axios } from "@/lib/axios";
import { CreateSeat } from "@/types/seat";

export interface CapacitySummary {
    eventCapacity: number | null;
    venueCapacity: number | null;
    totalSectionCapacity: number;
    totalSeatsCreated: number;
    isFullyConfigured: boolean;
    checks: {
        venueMatchesEvent: boolean;
        sectionsMatchVenue: boolean;
        seatsMatchSections: boolean;
    };
    warnings: string[];
    info: string[];
    remainingSectionCapacity: number;
    remainingSeats: number;
    sections: {
        id: number;
        name: string;
        capacity: number | null;
        seatsCreated: number;
        remainingSlots: number;
        isFull: boolean;
        isOverCapacity: boolean;
    }[];
}

export interface SeatAvailability {
    sectionId: number;
    sectionName: string;
    capacity: number;
    createdSeats: number;
    availableSlots: number;
    canAddMore: boolean;
}

export const createSeats = async (seats: CreateSeat[]) => {
    const response = await $axios.post("/seats", seats);
    console.log("createSeats response data:", response.data);
    return response.data;
}

export const getCapacitySummary = async (venueId: number): Promise<CapacitySummary> => {
    const response = await $axios.get(`/seats/capacity/${venueId}`);
    return response.data.data;
}

export const getSeatAvailability = async (sectionId: number): Promise<SeatAvailability> => {
    const response = await $axios.get(`/seats/availability/${sectionId}`);
    return response.data.data;
}