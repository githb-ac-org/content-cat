import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/characters - List all characters
export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(characters);
  } catch (error) {
    console.error("Failed to fetch characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}

// POST /api/characters - Create a new character
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, referenceImages } = body;

    if (!name || !referenceImages || referenceImages.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one reference image are required" },
        { status: 400 }
      );
    }

    const character = await prisma.character.create({
      data: {
        name,
        referenceImages,
        thumbnailUrl: referenceImages[0], // Use first image as thumbnail
      },
    });

    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error("Failed to create character:", error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 }
    );
  }
}
