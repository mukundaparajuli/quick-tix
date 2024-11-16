import { Session } from "next-auth";

export default async function getWithAuth(url: string, session: Session | null) {
    if (!url) {
        throw new Error("Url not found!");
    }

    if (!session || !session.user.accessToken) {
        throw new Error("session not found")
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user.accessToken}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch data. Error: ' + result.message);
    }
    return result.data;
}