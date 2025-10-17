import { useMutation } from "@tanstack/react-query";
import { createTicketType } from "@/services/ticket-type.service";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import useEventStore from "@/stores/event-store";

const useCreateTicketType = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    const ticketTypes = useEventStore((state) => state.ticketTypes);
    const setTicketTypes = useEventStore((state) => state.setTicketTypes);


    const mutation = useMutation({
        mutationFn: createTicketType,
        onSuccess: (response) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();

            setTicketTypes([...(ticketTypes || []), response.data]);
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });

    return mutation;
};

export default useCreateTicketType;
