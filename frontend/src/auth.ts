import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                })
                const user = await res.json()
                console.log("user is here:", user);
                if (res.ok && user) {

                    return user.data
                }
                return new Error("Login Unsuccessful")
            },
        }),
    ],

    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.fullName = user?.fullName;
                token.username = user?.username;
                token.role = user?.role;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.user.email = token.email as string;
            session.user.fullName = token.fullName as string;
            session.user.username = token.username as string;
            return session;
        },
    },
    debug: true,
    secret: process.env.AUTH_SECRET,
})