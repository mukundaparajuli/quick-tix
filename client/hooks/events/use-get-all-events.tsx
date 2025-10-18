"use client";

import { getAllEvents } from "@/services/event.service";
import { ApiErrorInterface } from "@/types/api-error";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetAllEvents = () => {
    const query = useQuery({
        queryKey: ["events"],
        queryFn: getAllEvents,
        onSuccess: (response) => {
            handleApiSuccessResponse(response);
        },
        onError: (error: AxiosError<ApiErrorInterface>) => {
            handleApiErrorResponse(error);
        },
    });
    return query;
};

export default useGetAllEvents;

