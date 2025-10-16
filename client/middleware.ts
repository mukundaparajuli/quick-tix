import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/organizer']
const publicRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value
    const { pathname } = request.nextUrl

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )
    const isPublicRoute = publicRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to dashboard if accessing public route with auth
    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}