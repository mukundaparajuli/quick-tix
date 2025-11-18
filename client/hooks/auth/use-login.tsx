"use client";

import { loginWithCredentials } from "@/services/auth.service";
import useAuthStore from "@/stores/auth-store";
import { ApiErrorInterface } from "@/types/api-error";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const useLogin = (
    successCallbackFn?: () => void,
    errorCallbackFn?: () => void
) => {
    const auth = useAuthStore((state) => state);
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: loginWithCredentials,
        onSuccess: (response) => {
            handleApiSuccessResponse(response);
            successCallbackFn?.();

            auth.setAuth({
                user: response.data.user,
                accessToken: response.data?.token,
            });

            console.log("Logged in user:", response.data);
            if (response.data.user.role === "ATTENDEE") {
                console.log("Redirecting to /dashboard");
                router.push("/dashboard");
            }
            if (response.data.user.role === "ORGANIZER") {
                console.log("Redirecting to /organizer");
                router.push("/organizer");
            }
        },
        onError: (error: AxiosError<ApiErrorInterface>) => {
            console.log(error)
            handleApiErrorResponse(error);
            errorCallbackFn?.();
        },
    });

    return mutation;
};

export default useLogin;
