'use client';
import { getAllEvents, getEventsNearMe, getPopularEvents } from '@/api/services/events';
import { useQuery } from '@tanstack/react-query';

export const useEvents = () => {
    const {
        data: popularEvents,
        isPending: isPopularLoading,
        isError: isPopularError,
    } = useQuery({
        queryKey: ['popular-events'],
        queryFn: getPopularEvents,
    });

    const {
        data: eventsNearMe,
        isPending: isNearMeLoading,
        isError: isNearMeError,
    } = useQuery({
        queryKey: ['events-nearme'],
        queryFn: getEventsNearMe,
    });

    const {
        data: allEvents,
        isPending: isAllEventsPending,
        isError: isAllEventsError
    } = useQuery({
        queryKey: ['all-events'],
        queryFn: getAllEvents,
    })

    return {
        popularEvents,
        isPopularLoading,
        isPopularError,
        eventsNearMe,
        isNearMeLoading,
        isNearMeError,
        allEvents,
        isAllEventsPending,
        isAllEventsError
    };
};
