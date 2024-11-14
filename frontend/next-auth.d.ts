import NextAuth from "next-auth";

declare module "next-auth" {

    interface User {
        id: string;
        fullName: string;
        role: string;
        username: string;
        accessToken: string;
    }


    interface Session {
        user: {
            id: string;
            email: string;
            fullName: string;
            username: string;
            role: string;
            accessToken: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        fullName: string;
        username: string;
        role: string;
        accessToken: string;
    }
}

