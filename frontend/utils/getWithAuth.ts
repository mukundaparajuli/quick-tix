import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export default async function getWithAuth(url: string, session: Session | null) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user.accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return await response.json();
}