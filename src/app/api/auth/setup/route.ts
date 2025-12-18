import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUser } from "@/lib/auth";

/**
 * Setup route to create the initial admin user
 * This can only be used when no users exist in the database
 */
export async function POST(request: Request) {
  try {
    // Check if any users already exist
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: "Setup already completed. Users already exist." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create admin user
    const user = await createUser(
      email.toLowerCase().trim(),
      password,
      name,
      "admin"
    );

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

/**
 * Check if setup is needed
 */
export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      setupRequired: userCount === 0,
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    );
  }
}
