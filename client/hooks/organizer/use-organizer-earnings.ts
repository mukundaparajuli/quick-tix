"use client";

import { getOrganizerEarnings } from "@/services/organizer.service";
import { useQuery } from "@tanstack/react-query";

interface UseOrganizerEarningsParams {
    startDate?: string;
    endDate?: string;
}

const useOrganizerEarnings = (params?: UseOrganizerEarningsParams) => {
    return useQuery({
        queryKey: ["organizer-earnings", params],
        queryFn: () => getOrganizerEarnings(params),
        staleTime: 60 * 1000, // 1 minute
    });
};

export default useOrganizerEarnings;
