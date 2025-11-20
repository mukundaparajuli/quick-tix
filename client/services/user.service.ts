import { $axios } from "@/lib/axios";
import { User } from "@/types/user";

type UpdateProfileData = Partial<Pick<User, 'name' | 'email'>> & {
    bio?: string;
    phone?: string;
    organizationName?: string;
    website?: string;
    contactEmail?: string;
    photo?: File | null;
};

export const getUserDetails = async () => {
    const response = await $axios.get(`/users/profile`);
    return response.data;
}

export const updateProfile = async (data: UpdateProfileData) => {
    console.log("Update Profile Data in Service:", data);
    const response = await $axios.put(`/users/profile`, data);
    return response.data;
}