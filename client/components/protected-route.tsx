"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth-store";

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function ProtectedRoute({
    children,
    fallback = null,
}: ProtectedRouteProps) {
    const router = useRouter();
    const { accessToken } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !accessToken) {
            router.push("/login");
        }
    }, [accessToken, isHydrated, router]);

    if (!isHydrated) return <>Loading...</>;
    return accessToken ? <>{children}</> : fallback;
}
