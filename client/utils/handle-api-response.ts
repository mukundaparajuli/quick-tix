import { ApiResponseInterface } from "@/types/api-response";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleApiErrorResponse = (error: any) => {
    if (error instanceof AxiosError) {
        if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500
        ) {
            toast.error(error.response.data.message || error.message, {});
        } else {
            toast.error(error.response?.data.message || error.message);
        }
    } else {
        toast.error("Something went wrong. Please try again later!", {
            description: error.message,
        });
    }
};

export const handleApiSuccessResponse = (response: ApiResponseInterface) => {
    if (response && response.status >= 200 && response.status <= 299) {
        toast.success(response.message, {});
    }
};
