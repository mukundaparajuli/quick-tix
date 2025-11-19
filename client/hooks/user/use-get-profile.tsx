"use client";

import { getUserDetails } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

const useGetUserDetails = () => {
    const query = useQuery({
        queryKey: [
            "profile"
        ],
        queryFn: () => getUserDetails(),
        enabled: true,
    });
    return query;
};

export default useGetUserDetails;

