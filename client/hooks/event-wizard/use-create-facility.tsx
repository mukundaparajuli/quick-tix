import { useMutation } from "@tanstack/react-query";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import useEventStore from "@/stores/event-store";
import { createFacility } from "@/services/facility.service";

const useCreateFacility = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    console.log(successCallbackFn);
    const facilities = useEventStore((state) => state.facilities);
    const setFacilities = useEventStore((state) => state.setFacilities);


    const mutation = useMutation({
        mutationFn: createFacility,
        onSuccess: (response) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();

            setFacilities([...(facilities || []), response.data]);
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });

    return mutation;
};

export default useCreateFacility;
