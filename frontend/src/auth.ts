import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User } from "next-auth";

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

                    if (!res.ok) {
                        const errorData = await res.json();
                        console.log("Login failed:", errorData);
                        throw new Error(errorData.message || "Login failed");
                    }
                    const data = await res.json();
                    console.log(data.data);
                    console.log(data.data.userPayload);


                    return {
                        fullName: data.data.userPayload.fullName,
                        email: data.data.userPayload.email,
                        username: data.data.userPayload.username,
                        role: data.data.userPayload.role,
                        accessToken: data.data.jwtToken,
                    } as User

                } catch (error) {
                    console.log("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.fullName = user.fullName;
                token.email = user.email;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken as string;
            session.user.fullName = token.fullName as string;
            session.user.email = token.email as string;
            session.user.username = token.username as string;
            session.user.role = token.role as string; return session;
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