import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await validateSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: session.user,
      session: {
        expiresAt: session.session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
