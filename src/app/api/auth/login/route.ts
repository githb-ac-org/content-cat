import { NextResponse } from "next/server";
import {
  getUserByEmail,
  verifyPassword,
  createSession,
  setSessionCookie,
  updateLastLogin,
} from "@/lib/auth";
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitHeaders,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// Stricter rate limit for login attempts
const LOGIN_RATE_LIMIT = { limit: 5, windowMs: 60000 }; // 5 attempts per minute

export async function POST(request: Request) {
  // Rate limiting for login attempts
  const clientId = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(clientId, LOGIN_RATE_LIMIT);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please wait before trying again.",
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await getUserByEmail(normalizedEmail);
    if (!user) {
      // Use generic error to prevent user enumeration
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const token = await createSession(user.id);
    await setSessionCookie(token);
    await updateLastLogin(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Login error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
