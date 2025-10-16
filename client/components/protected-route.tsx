'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'

interface ProtectedRouteProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

export default function ProtectedRoute({
    children,
    fallback = null
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return fallback || <div>Loading...</div>
    }

    return isAuthenticated ? <>{children}</> : fallback
}