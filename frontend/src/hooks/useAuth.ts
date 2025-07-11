'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
    }
}

export const useAuth = () => {
    const { data: session, status } = useSession();

    return {
        user: session?.user,
        accessToken: session?.accessToken,
        status,
        signIn,
        signOut,
    };
};