import { useMutation } from "@tanstack/react-query";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import useEventStore from "@/stores/event-store";
import { createSeats } from "@/services/seat.service";

const useCreateSeats = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    console.log(successCallbackFn);
    const seats = useEventStore((state) => state.seats);
    const setSeats = useEventStore((state) => state.setSeats);

    const mutation = useMutation({
        mutationFn: createSeats,
        onSuccess: (response) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();

            setSeats([...(seats || []), response.data]);
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });

    return mutation;
};

export default useCreateSeats;
