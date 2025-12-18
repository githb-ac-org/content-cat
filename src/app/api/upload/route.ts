import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { prisma } from "@/lib/prisma";

// Get API key from database
async function getApiKey(): Promise<string | null> {
  try {
    const storedKey = await prisma.apiKey.findUnique({
      where: { service: "fal" },
    });
    if (storedKey?.isActive && storedKey.key) {
      return storedKey.key;
    }
  } catch (error) {
    console.error("Failed to fetch API key from database:", error);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key. Add your fal.ai key in Settings." },
        { status: 400 }
      );
    }

    // Configure fal client
    fal.config({ credentials: apiKey });

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Upload each file to fal.ai storage
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const url = await fal.storage.upload(file);
      uploadedUrls.push(url);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
