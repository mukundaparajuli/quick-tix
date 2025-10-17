import { registerWithCredentials } from "@/services/auth.service";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";

const useRegister = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: registerWithCredentials,
        onSuccess: (response, formData) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();
            router.push("/login");
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });
    return mutation;
};
export default useRegister;
