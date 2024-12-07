/**
 * An array of routes that are publicly accessible
 * These routes dont require authentication
 * @type{string[]}
 */

export const publicRoutes: string[] = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
  @type{string[]}

 */
export const authRoutes: string[] = [
    "/login",
    "/register"
];

/**
 *the prefix for API authentication routes
 Routes that start with this prefix are used for API authentication process
 * @type{string}
 */
export const authPrefix: string = "/api/auth";

/**
 * Default redirect paths after logging in
 * @type{string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";