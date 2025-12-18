import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

// GET /api/api-keys - List all API keys (masked)
export async function GET(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
    });

    // Mask the actual key values for security
    const maskedKeys = apiKeys.map((key) => ({
      ...key,
      key: key.key.slice(0, 8) + "..." + key.key.slice(-4),
    }));

    return NextResponse.json(maskedKeys);
  } catch (error) {
    console.error("Failed to fetch API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create or update an API key
export async function POST(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { name, key, service } = body;

    if (!name || !key || !service) {
      return NextResponse.json(
        { error: "Name, key, and service are required" },
        { status: 400 }
      );
    }

    // Upsert - create or update if service already exists for this user
    const apiKey = await prisma.apiKey.upsert({
      where: { userId_service: { userId: user!.id, service } },
      update: { name, key, isActive: true },
      create: { userId: user!.id, name, key, service, isActive: true },
    });

    return NextResponse.json(
      {
        ...apiKey,
        key: apiKey.key.slice(0, 8) + "..." + apiKey.key.slice(-4),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save API key:", error);
    return NextResponse.json(
      { error: "Failed to save API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys - Delete an API key by service
export async function DELETE(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");

    if (!service) {
      return NextResponse.json(
        { error: "Service parameter is required" },
        { status: 400 }
      );
    }

    await prisma.apiKey.deleteMany({
      where: { userId: user!.id, service },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
