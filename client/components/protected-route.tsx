"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth-store";

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    role?: "ATTENDEE" | "ORGANIZER" | "ADMIN";
}

export default function ProtectedRoute({
    children,
    fallback = null,
    role
}: ProtectedRouteProps) {
    const router = useRouter();
    const { accessToken, user } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !accessToken) {
            router.push("/login");
        }
        if (isHydrated && role && user?.role !== role) {
            router.push("/unauthorized");
        }
    }, [accessToken, isHydrated, router]);

    if (!isHydrated) return <>Loading...</>;
    return accessToken ? <>{children}</> : fallback;
}
