/**
 * Fal.ai Veo 3.1 API Module
 * Google's video generation model with first/last frame control
 *
 * Endpoint: fal-ai/veo3.1/first-last-frame-to-video
 */

import {
  fal,
  configureFalClient,
  type QueueUpdate,
  type FalVideo,
} from "./client";

// Model ID
export const VEO_31_MODEL = "fal-ai/veo3.1/first-last-frame-to-video";

// Types
export type Veo31Duration = "4s" | "6s" | "8s";
export type Veo31AspectRatio = "auto" | "9:16" | "16:9" | "1:1";
export type Veo31Resolution = "720p" | "1080p";

// Input schema
export interface Veo31Input {
  /** URL of the first frame of the video (required) */
  first_frame_url: string;
  /** URL of the last frame of the video (required) */
  last_frame_url: string;
  /** The text prompt describing the video (required) */
  prompt: string;
  /** Duration of the generated video. Default: "8s" */
  duration?: Veo31Duration;
  /** Aspect ratio of the generated video. Default: "auto" */
  aspect_ratio?: Veo31AspectRatio;
  /** Resolution of the generated video. Default: "720p" */
  resolution?: Veo31Resolution;
  /** Whether to generate audio for the video. Default: true */
  generate_audio?: boolean;
}

// Output schema
export interface Veo31Output {
  /** The generated video */
  video: FalVideo;
}

// Constants
export const VEO_31_DURATIONS: Veo31Duration[] = ["4s", "6s", "8s"];
export const VEO_31_ASPECT_RATIOS: Veo31AspectRatio[] = [
  "auto",
  "9:16",
  "16:9",
  "1:1",
];
export const VEO_31_RESOLUTIONS: Veo31Resolution[] = ["720p", "1080p"];

export const VEO_31_DEFAULT_DURATION: Veo31Duration = "8s";
export const VEO_31_DEFAULT_ASPECT_RATIO: Veo31AspectRatio = "auto";
export const VEO_31_DEFAULT_RESOLUTION: Veo31Resolution = "720p";

export const VEO_31_MAX_PROMPT_LENGTH = 5000;

/**
 * Veo 3.1 API Client
 */
export class Veo31Client {
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    configureFalClient(apiKey);
  }

  /**
   * Generate video from first and last frame images
   */
  async generateVideo(
    input: Veo31Input,
    options?: {
      onQueueUpdate?: (update: QueueUpdate) => void;
    }
  ): Promise<Veo31Output> {
    if (!input.first_frame_url) {
      throw new Error("First frame URL is required");
    }

    if (!input.last_frame_url) {
      throw new Error("Last frame URL is required");
    }

    if (!input.prompt) {
      throw new Error("Prompt is required");
    }

    if (input.prompt.length > VEO_31_MAX_PROMPT_LENGTH) {
      throw new Error(
        `Prompt exceeds maximum length of ${VEO_31_MAX_PROMPT_LENGTH} characters`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (fal.subscribe as any)(VEO_31_MODEL, {
      input: {
        first_frame_url: input.first_frame_url,
        last_frame_url: input.last_frame_url,
        prompt: input.prompt,
        duration: input.duration || VEO_31_DEFAULT_DURATION,
        aspect_ratio: input.aspect_ratio || VEO_31_DEFAULT_ASPECT_RATIO,
        resolution: input.resolution || VEO_31_DEFAULT_RESOLUTION,
        generate_audio: input.generate_audio ?? true,
      },
      logs: true,
      onQueueUpdate: options?.onQueueUpdate,
    });

    return result.data as Veo31Output;
  }
}

/**
 * Create a new Veo 3.1 client
 */
export function createVeo31Client(apiKey: string): Veo31Client {
  return new Veo31Client(apiKey);
}
