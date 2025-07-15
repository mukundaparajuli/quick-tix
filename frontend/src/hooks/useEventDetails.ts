import { getEventById } from "@/api/services/events";
import { useQuery } from "@tanstack/react-query"

export const useEventDetails = (id: string) => {
    const { data: eventDetails, isPending, isError, error } = useQuery({
        queryKey: ['event', id],
        queryFn: () => getEventById(id),
        enabled: !!id,
    });

    return {
        eventDetails,
        isPending,
        isError,
        error
    }
}