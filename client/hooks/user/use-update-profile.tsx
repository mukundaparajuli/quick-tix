"use client";

import { updateProfile } from "@/services/user.service";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types/user";
import useAuthStore from "@/stores/auth-store";
import { handleApiErrorResponse, handleApiSuccessResponse } from "@/utils/handle-api-response";

type UpdateProfileData = Partial<Pick<User, 'name' | 'email'>> & {
    bio?: string;
    phone?: string;
    organizationName?: string;
    website?: string;
    contactEmail?: string;
    photo?: File | null;
};

const useUpdateProfile = () => {
    // Select only the setter to avoid re-renders when other auth state changes.
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: (data: UpdateProfileData) => updateProfile(data),
        onSuccess: (apiResponse) => {
            handleApiSuccessResponse(apiResponse);
            const updatedUser = apiResponse?.data ?? null;
            setUser({ user: updatedUser });
        },
        onError: (error: any) => {
            handleApiErrorResponse(error);
        }
    });
};


export default useUpdateProfile;

