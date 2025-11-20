"use client";

import { updateProfile } from "@/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import useGetUserDetails from "./use-get-profile";
import { User } from "@/types/user";

type UpdateProfileData = Partial<Pick<User, 'name' | 'email'>> & {
    bio?: string;
    phone?: string;
    organizationName?: string;
    website?: string;
    contactEmail?: string;
    photo?: File | null;
};

const useUpdateProfile = () => {
    return useMutation({
        mutationFn: (data: UpdateProfileData) => updateProfile(data),
    });
};


export default useUpdateProfile;

