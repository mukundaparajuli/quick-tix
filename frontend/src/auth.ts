import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User } from "next-auth";
import { toast } from "sonner";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify(credentials),
                    });
                    const data = await res.json();
                    const user = {
                        id: data.data.userPayload.id,
                        fullName: data.data.userPayload.fullName,
                        email: data.data.userPayload.email,
                        username: data.data.userPayload.username,
                        role: data.data.userPayload.role,
                        accessToken: data.data.jwtToken,
                    }
                    console.log("mapped user=", user);

                    return user;

                } catch (error) {
                    console.log("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log(user);
            if (user) {
                token.fullName = user.fullName;
                token.id = user.id;
                token.accessToken = user.accessToken;
                token.fullName = user.fullName;
                token.email = user.email;
                token.username = user.username;
                token.role = user.role;
                console.log("token= ", token);
            }
            return token;
        },
        async session({ session, token }) {
            console.log(session);
            session.user.name = token.fullName as string;
            session.user.id = token.id as string;
            session.user.accessToken = token.accessToken as string;
            session.user.fullName = token.fullName as string;
            session.user.email = token.email as string;
            session.user.username = token.username as string;
            session.user.role = token.role as string;
            console.log("session= ", session)
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.AUTH_SECRET,
});