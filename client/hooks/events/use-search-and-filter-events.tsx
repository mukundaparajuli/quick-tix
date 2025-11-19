import { searchAndFilterEvents } from "@/services/event.service";
import { useQuery } from "@tanstack/react-query";

export const useSearchAndFilterEvents = (filters: {
    q?: string;
    category?: string;
    date?: string;
}) => {
    return useQuery({
        queryKey: ["events", "search", filters],
        queryFn: () => searchAndFilterEvents(filters),
        enabled: !!filters.q || !!filters.category || !!filters.date,
    });
};
