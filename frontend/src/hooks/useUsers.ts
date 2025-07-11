'use client';
import { getUser } from '@/api/services/user';
import { useQuery } from '@tanstack/react-query';

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id,
    });
};