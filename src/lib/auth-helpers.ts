import { NextResponse } from "next/server";
import { prisma } from "./prisma";

/**
 * Validate session from request headers (set by middleware)
 * Use this in API routes that need user context
 */
export async function getAuthenticatedUser(request: Request) {
  const sessionToken = request.headers.get("x-session-token");

  if (!sessionToken) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication for an API route
 * Returns a 401 response if not authenticated
 */
export async function requireAuth(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  return { user, error: null };
}

/**
 * Require admin role for an API route
 */
export async function requireAdmin(request: Request) {
  const { user, error } = await requireAuth(request);

  if (error) {
    return { user: null, error };
  }

  if (user?.role !== "admin") {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}
