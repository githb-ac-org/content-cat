import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/videos - List all videos
export async function GET() {
  try {
    const videos = await prisma.generatedVideo.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create a new video record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      url,
      thumbnailUrl,
      prompt,
      model,
      duration,
      aspectRatio,
      resolution,
      startImageUrl,
      endImageUrl,
      audioEnabled,
    } = body;

    if (!url || !prompt || !model) {
      return NextResponse.json(
        { error: "URL, prompt, and model are required" },
        { status: 400 }
      );
    }

    const video = await prisma.generatedVideo.create({
      data: {
        url,
        thumbnailUrl,
        prompt,
        model,
        duration: parseInt(duration) || 5,
        aspectRatio: aspectRatio || "16:9",
        resolution,
        startImageUrl,
        endImageUrl,
        audioEnabled: audioEnabled || false,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Failed to create video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
