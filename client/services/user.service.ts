import { $axios } from "@/lib/axios";

export const getUserDetails = async () => {
    const response = await $axios.get(`/users/profile`);
    return response.data;
}