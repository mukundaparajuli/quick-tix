// export { auth as middleware } from "@/auth"

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default auth(request: NextRequest) {



    const { nextUrl } = request;

    if (
        token &&
        (url.pathname.startsWith("/sign-in") ||
            url.pathname.startsWith("/sign-up") ||
            url.pathname.startsWith("/verify")) ||
        url.pathname.startsWith("/u")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

// Configuration for the middleware
export const config = {
    matcher: ["/sign-in", "/sign-up", "/verify", "/dashboard", "/"],
};