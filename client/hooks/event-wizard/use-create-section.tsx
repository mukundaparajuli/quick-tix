import { useMutation } from "@tanstack/react-query";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import useEventStore from "@/stores/event-store";
import { createSection } from "@/services/section.service";

const useCreateSection = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    console.log(successCallbackFn);
    const sections = useEventStore((state) => state.sections);
    const setSections = useEventStore((state) => state.setSections);

    const mutation = useMutation({
        mutationFn: createSection,
        onSuccess: (response) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();

            setSections(sections ? [...sections, response.data] : [response.data]);
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });

    return mutation;
};

export default useCreateSection;
