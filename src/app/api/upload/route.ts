import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { getApiKey } from "@/lib/services/apiKeyService";
import { requireAuth } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth(request);
  if (authError) return authError;

  try {
    const apiKey = await getApiKey(user!.id);
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
    logger.error("Upload error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
