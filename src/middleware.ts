import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "session_token";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/setup",
  "/api/health",
];

// Routes that should redirect to login if not authenticated
const PROTECTED_PAGE_ROUTES = [
  "/",
  "/image",
  "/video",
  "/create-character",
  "/products",
  "/prompts",
];

// API routes that require authentication
const PROTECTED_API_PREFIXES = [
  "/api/images",
  "/api/videos",
  "/api/characters",
  "/api/products",
  "/api/api-keys",
  "/api/generate-image",
  "/api/generate-video",
  "/api/upload",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Check if this is a protected API route
  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Check if this is a protected page route
  const isProtectedPage = PROTECTED_PAGE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!sessionToken) {
    // No session - handle based on route type
    if (isProtectedApi) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (isProtectedPage) {
      // Redirect to login for page routes
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is logged in and trying to access login page, redirect to home
  if (sessionToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Session exists - validate it by checking with the database
  // Note: For performance, we do lightweight validation in middleware
  // and full validation in API routes when needed
  if (sessionToken && (isProtectedApi || isProtectedPage)) {
    // Add session token to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-session-token", sessionToken);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
