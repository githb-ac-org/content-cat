import { NextResponse } from "next/server";
import {
  getSessionToken,
  invalidateSession,
  deleteSessionCookie,
} from "@/lib/auth";

export async function POST() {
  try {
    const token = await getSessionToken();

    if (token) {
      await invalidateSession(token);
    }

    await deleteSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    // Still delete the cookie even if there's an error
    await deleteSessionCookie();
    return NextResponse.json({ success: true });
  }
}
