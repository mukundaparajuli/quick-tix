import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            role: string;
        };
        access_token?: string;
    }

    interface User {
        id: string;
        email: string;
        name?: string;
        role: string;
        token?: string;
    }
}