"use client";

import { getEventDetails } from "@/services/event.service";
import { useQuery } from "@tanstack/react-query";

const useGetEventDetails = ({ eventId }: { eventId: number }) => {
    const query = useQuery({
        queryKey: [
            "events",
            eventId
        ],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId,
    });
    return query;
};

export default useGetEventDetails;

