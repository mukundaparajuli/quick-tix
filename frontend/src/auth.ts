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
                console.log(user);
                if (res.ok && user) {
                    return user
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

    secret: process.env.AUTH_SECRET,
})