import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/characters/[id] - Get a single character
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("Failed to fetch character:", error);
    return NextResponse.json(
      { error: "Failed to fetch character" },
      { status: 500 }
    );
  }
}

// DELETE /api/characters/[id] - Delete a character
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return NextResponse.json(
      { error: "Failed to delete character" },
      { status: 500 }
    );
  }
}

// PATCH /api/characters/[id] - Update a character
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, referenceImages } = body;

    const updateData: {
      name?: string;
      referenceImages?: string[];
      thumbnailUrl?: string;
    } = {};
    if (name) updateData.name = name;
    if (referenceImages) {
      updateData.referenceImages = referenceImages;
      updateData.thumbnailUrl = referenceImages[0];
    }

    const character = await prisma.character.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(character);
  } catch (error) {
    console.error("Failed to update character:", error);
    return NextResponse.json(
      { error: "Failed to update character" },
      { status: 500 }
    );
  }
}
