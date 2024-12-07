import Credentials from "next-auth/providers/credentials";

export const AUTH_CONFIG = {
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
                    console.log(data.data.userPayload);

                    const user = data.data.userPayload;

                    return user;
                } catch (error) {
                    console.log("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
}