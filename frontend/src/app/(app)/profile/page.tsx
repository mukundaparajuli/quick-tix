"use client"
import { useSession } from "next-auth/react";

export default function Page() {
    const { data: session, status } = useSession();
    console.log(session);
    return (
        <div>
            Hello {session?.user?.fullName} with userid: {session?.user.id}
            Status: {status}
        </div>
    )
}