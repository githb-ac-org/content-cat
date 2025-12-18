import { NextRequest, NextResponse } from "next/server";
import {
  createNanoBananaProClient,
  parseFalError,
  type NanoBananaProAspectRatio,
  type NanoBananaProResolution,
  type NanoBananaProOutputFormat,
} from "@/lib/fal";
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
    const body = await request.json();
    const {
      prompt,
      aspectRatio,
      resolution,
      outputFormat,
      imageUrls,
      numImages,
      enableWebSearch,
      enableSafetyChecker,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Validate image sizes (max ~5MB base64 per image)
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    if (imageUrls && Array.isArray(imageUrls)) {
      for (const url of imageUrls) {
        if (url && url.length > MAX_IMAGE_SIZE) {
          return NextResponse.json(
            {
              error:
                "Reference image is too large. Please use a smaller image (max 5MB).",
            },
            { status: 400 }
          );
        }
      }
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No API key. Add your fal.ai key in Settings.",
          code: "NO_API_KEY",
        },
        { status: 400 }
      );
    }

    const client = createNanoBananaProClient(apiKey);

    // Check if this is an edit request (has image URLs)
    const hasImages =
      imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0;

    if (hasImages) {
      // Image editing mode with reference images
      const result = await client.editImage({
        prompt,
        image_urls: imageUrls,
        aspect_ratio: (aspectRatio || "auto") as NanoBananaProAspectRatio,
        resolution: (resolution || "1K") as NanoBananaProResolution,
        output_format: (outputFormat || "png") as NanoBananaProOutputFormat,
        num_images: numImages || 1,
        enable_safety_checker: enableSafetyChecker ?? true,
      });

      return NextResponse.json({
        success: true,
        images: result.images,
        resultUrls: result.images.map((img) => img.url),
        description: result.description,
        seed: result.seed,
      });
    } else {
      // Text-to-image mode
      const result = await client.generateImage({
        prompt,
        aspect_ratio: (aspectRatio || "1:1") as NanoBananaProAspectRatio,
        resolution: (resolution || "1K") as NanoBananaProResolution,
        output_format: (outputFormat || "png") as NanoBananaProOutputFormat,
        num_images: numImages || 1,
        enable_web_search: enableWebSearch ?? false,
        enable_safety_checker: enableSafetyChecker ?? true,
      });

      return NextResponse.json({
        success: true,
        images: result.images,
        resultUrls: result.images.map((img) => img.url),
        description: result.description,
        seed: result.seed,
      });
    }
  } catch (error) {
    console.error("Image generation error:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Failed to generate image";
    const parsed = parseFalError(errorMsg);
    return NextResponse.json(parsed, { status: 500 });
  }
}
