"use client";

import { getOrganizerBookings } from "@/services/organizer.service";
import { useQuery } from "@tanstack/react-query";

interface UseOrganizerBookingsParams {
    eventId?: number;
    status?: string;
    page?: number;
    limit?: number;
}

const useOrganizerBookings = (params?: UseOrganizerBookingsParams) => {
    return useQuery({
        queryKey: ["organizer-bookings", params],
        queryFn: () => getOrganizerBookings(params),
        staleTime: 30 * 1000, // 30 seconds
    });
};

export default useOrganizerBookings;
