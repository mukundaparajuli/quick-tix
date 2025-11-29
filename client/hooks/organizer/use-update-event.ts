"use client";

import { updateEvent, UpdateEventData } from "@/services/organizer.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, data }: { eventId: number; data: UpdateEventData }) =>
            updateEvent(eventId, data),
        onSuccess: () => {
            toast.success("Event updated successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["organizer-stats"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update event");
        },
    });
};

export default useUpdateEvent;
