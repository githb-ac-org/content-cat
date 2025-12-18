import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

// DELETE /api/videos/[id] - Delete a video
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;

    // Only delete if the video belongs to the user
    await prisma.generatedVideo.deleteMany({
      where: { id, userId: user!.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}

// GET /api/videos/[id] - Get a single video
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;

    const video = await prisma.generatedVideo.findFirst({
      where: { id, userId: user!.id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Failed to fetch video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
