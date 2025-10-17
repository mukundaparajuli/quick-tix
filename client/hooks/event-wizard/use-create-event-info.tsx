import { createEvent } from "@/services/event.service";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useRegister from "../auth/use-register";
import useEventStore from "@/stores/event-store";


const useCreateEventInfo = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    const event = useEventStore((state) => state);
    const mutation = useMutation({
        mutationFn: createEvent,
        onSuccess: (response, formData) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();

            event.setEvent(response.data);
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });
    return mutation;
};
export default useCreateEventInfo;
