"use client";

import { getOrganizerStats } from "@/services/organizer.service";
import { useQuery } from "@tanstack/react-query";

const useOrganizerStats = () => {
    return useQuery({
        queryKey: ["organizer-stats"],
        queryFn: getOrganizerStats,
        staleTime: 60 * 1000, // 1 minute
    });
};

export default useOrganizerStats;
