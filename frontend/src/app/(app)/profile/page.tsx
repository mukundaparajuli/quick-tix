"use client"
import { useSession } from "next-auth/react";

export default function Page() {
    const { data: session, status } = useSession();
    return (
        <div>
            Hello {session?.user?.fullName}
        </div>
    )
}