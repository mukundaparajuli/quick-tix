import { useMutation } from "@tanstack/react-query";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import useEventStore from "@/stores/event-store";
import { createFacility } from "@/services/facility.service";
import { createVenue } from "@/services/venue.service";

const useCreateVenue = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    console.log(successCallbackFn);
    const setVenue = useEventStore((state) => state.setVenue);

    const mutation = useMutation({
        mutationFn: createVenue,
        onSuccess: (response) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();

            setVenue(response.data);
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });

    return mutation;
};

export default useCreateVenue;
