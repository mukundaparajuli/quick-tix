"use client";

import { getOrganizerEvents } from "@/services/organizer.service";
import { useQuery } from "@tanstack/react-query";

const useOrganizerEvents = () => {
    return useQuery({
        queryKey: ["organizer-events"],
        queryFn: getOrganizerEvents,
        staleTime: 60 * 1000, // 1 minute
    });
};

export default useOrganizerEvents;
