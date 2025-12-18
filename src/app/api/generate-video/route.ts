import { NextRequest, NextResponse } from "next/server";
import {
  createKling26Client,
  createKling25TurboClient,
  createWan26Client,
  parseFalError,
  type VideoModelId,
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
      model,
      mode,
      aspectRatio,
      duration,
      resolution,
      audioEnabled,
      enhanceEnabled,
      imageUrl,
      endImageUrl,
      negativePrompt,
      cfgScale,
      seed,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
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

    const modelId = (model || "kling-2.6") as VideoModelId;
    let result: { video: { url: string }; seed?: number };

    // Log input for debugging
    console.log("Video generation request:", {
      modelId,
      mode,
      prompt: prompt?.substring(0, 50),
      aspectRatio,
      duration,
      audioEnabled,
      hasImageUrl: !!imageUrl,
      hasEndImageUrl: !!endImageUrl,
    });

    switch (modelId) {
      case "kling-2.6": {
        const client = createKling26Client(apiKey);
        if (mode === "image-to-video" && imageUrl) {
          result = await client.generateImageToVideo({
            prompt,
            image_url: imageUrl,
            duration: duration as "5" | "10",
            generate_audio: audioEnabled ?? false,
            negative_prompt: negativePrompt,
            cfg_scale: cfgScale ?? 0.5,
            seed,
          });
        } else {
          result = await client.generateTextToVideo({
            prompt,
            aspect_ratio: aspectRatio as "16:9" | "9:16" | "1:1",
            duration: duration as "5" | "10",
            generate_audio: audioEnabled ?? false,
            negative_prompt: negativePrompt,
            cfg_scale: cfgScale ?? 0.5,
            seed,
          });
        }
        break;
      }

      case "kling-2.5-turbo": {
        const client = createKling25TurboClient(apiKey);
        if (mode === "image-to-video" && imageUrl) {
          result = await client.generateImageToVideo({
            prompt,
            image_url: imageUrl,
            duration: duration as "5" | "10",
            negative_prompt: negativePrompt,
            cfg_scale: cfgScale ?? 0.5,
            tail_image_url: endImageUrl,
            seed,
          });
        } else {
          result = await client.generateTextToVideo({
            prompt,
            aspect_ratio: aspectRatio as "16:9" | "9:16" | "1:1",
            duration: duration as "5" | "10",
            negative_prompt: negativePrompt,
            cfg_scale: cfgScale ?? 0.5,
            seed,
          });
        }
        break;
      }

      case "wan-2.6": {
        const client = createWan26Client(apiKey);
        if (mode === "image-to-video" && imageUrl) {
          result = await client.generateImageToVideo({
            prompt,
            image_url: imageUrl,
            duration: duration as "5" | "10" | "15",
            resolution: resolution as "720p" | "1080p",
            enable_prompt_expansion: enhanceEnabled ?? false,
            negative_prompt: negativePrompt,
            seed,
          });
        } else {
          result = await client.generateTextToVideo({
            prompt,
            aspect_ratio: aspectRatio as "16:9" | "9:16" | "1:1" | "4:3" | "3:4",
            duration: duration as "5" | "10" | "15",
            resolution: resolution as "720p" | "1080p",
            enable_prompt_expansion: enhanceEnabled ?? false,
            negative_prompt: negativePrompt,
            seed,
          });
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown model: ${modelId}` },
          { status: 400 }
        );
    }

    // Save the video to the database
    const video = await prisma.generatedVideo.create({
      data: {
        url: result.video.url,
        prompt,
        model: modelId,
        duration: parseInt(duration) || 5,
        aspectRatio: aspectRatio || "16:9",
        resolution,
        startImageUrl: imageUrl,
        endImageUrl,
        audioEnabled: audioEnabled || false,
      },
    });

    return NextResponse.json({
      success: true,
      video: video, // Return the full database record
      videoUrl: result.video.url,
      seed: result.seed,
      id: video.id,
    });
  } catch (error: unknown) {
    console.error("Video generation error:", error);
    // Log more details for debugging
    if (error && typeof error === "object" && "body" in error) {
      console.error("Error body:", JSON.stringify((error as { body: unknown }).body, null, 2));
    }
    const errorMsg =
      error instanceof Error ? error.message : "Failed to generate video";
    const parsed = parseFalError(errorMsg);
    return NextResponse.json(parsed, { status: 500 });
  }
}
