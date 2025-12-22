/**
 * Video Model Configuration
 * Maps UI controls to video model API parameters
 */

// Available video models
export type VideoModelId =
  | "kling-2.6"
  | "kling-2.5-turbo"
  | "wan-2.6"
  | "veo-3.1";

export type VideoMode =
  | "text-to-video"
  | "image-to-video"
  | "reference-to-video"
  | "first-last-frame";

// Common types for UI
export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
export type Duration = "4" | "5" | "6" | "8" | "10" | "15"; // Veo uses 4, 6, 8; others use 5, 10, 15
export type Resolution = "720p" | "1080p";

// Model capability definitions
export interface VideoModelConfig {
  id: VideoModelId;
  name: string;
  shortName: string;
  description: string;
  modes: VideoMode[];
  aspectRatios: AspectRatio[];
  durations: Duration[];
  resolutions?: Resolution[];
  supportsAudio: boolean;
  supportsPromptEnhancement: boolean;
  supportsNegativePrompt: boolean;
  supportsCfgScale: boolean;
  supportsSpecialFx: boolean;
  supportsStartEndFrames: boolean; // For models that support start/end frame inputs
  maxPromptLength: number;
  maxNegativePromptLength: number;
  maxImageSizeMB: number;
  pricing: {
    per4s?: number; // Veo
    per5s?: number;
    per6s?: number; // Veo
    per8s?: number; // Veo
    per10s?: number;
    per15s?: number;
    audioMultiplier?: number;
  };
}

// Speed option for models that support fast mode
export type VideoSpeed = "standard" | "fast";

// UI State for video generation
export interface VideoGenerationState {
  model: VideoModelId;
  mode: VideoMode;
  prompt: string;
  negativePrompt?: string;
  imageUrl?: string; // Start frame for models with start/end frame support
  endImageUrl?: string; // End frame (optional) for models that support it
  referenceVideos?: string[];
  aspectRatio: AspectRatio;
  duration: Duration;
  resolution?: Resolution;
  audioEnabled: boolean;
  enhanceEnabled: boolean;
  cfgScale?: number;
  specialFx?: string;
  seed?: number;
  // Veo 3.1 specific
  speed?: VideoSpeed;
}

// Model configurations
export const VIDEO_MODELS: Record<VideoModelId, VideoModelConfig> = {
  "kling-2.6": {
    id: "kling-2.6",
    name: "Kling 2.6 Pro",
    shortName: "Kling 2.6",
    description: "Premium video with native audio generation",
    modes: ["text-to-video", "image-to-video"],
    aspectRatios: ["1:1", "16:9", "9:16"],
    durations: ["5", "10"],
    supportsAudio: true,
    supportsPromptEnhancement: false,
    supportsNegativePrompt: true,
    supportsCfgScale: true,
    supportsSpecialFx: false,
    supportsStartEndFrames: false,
    maxPromptLength: 2500,
    maxNegativePromptLength: 500,
    maxImageSizeMB: 10,
    pricing: {
      per5s: 0.35,
      per10s: 0.7,
      audioMultiplier: 2, // 2x cost with audio
    },
  },
  "kling-2.5-turbo": {
    id: "kling-2.5-turbo",
    name: "Kling 2.5 Turbo Pro",
    shortName: "Kling 2.5",
    description: "Fast generation with special effects support",
    modes: ["text-to-video", "image-to-video"],
    aspectRatios: ["1:1", "16:9", "9:16"],
    durations: ["5", "10"],
    supportsAudio: false,
    supportsPromptEnhancement: false,
    supportsNegativePrompt: true,
    supportsCfgScale: true,
    supportsSpecialFx: true,
    supportsStartEndFrames: true,
    maxPromptLength: 2500,
    maxNegativePromptLength: 500,
    maxImageSizeMB: 10,
    pricing: {
      per5s: 0.35,
      per10s: 0.7,
    },
  },
  "wan-2.6": {
    id: "wan-2.6",
    name: "Wan 2.6",
    shortName: "Wan",
    description: "Multi-modal with reference video support",
    modes: ["text-to-video", "image-to-video", "reference-to-video"],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    durations: ["5", "10", "15"],
    resolutions: ["720p", "1080p"],
    supportsAudio: false,
    supportsPromptEnhancement: true,
    supportsNegativePrompt: true,
    supportsCfgScale: false,
    supportsSpecialFx: false,
    supportsStartEndFrames: false,
    maxPromptLength: 800,
    maxNegativePromptLength: 500,
    maxImageSizeMB: 10,
    pricing: {
      per5s: 0.25,
      per10s: 0.5,
      per15s: 0.75,
    },
  },
  "veo-3.1": {
    id: "veo-3.1",
    name: "Veo 3.1",
    shortName: "Veo",
    description: "Google's video model with image-to-video and first/last frame modes",
    modes: ["image-to-video", "first-last-frame"],
    aspectRatios: ["1:1", "16:9", "9:16"],
    durations: ["4", "6", "8"], // Veo uses 4s, 6s, 8s
    resolutions: ["720p", "1080p"],
    supportsAudio: true,
    supportsPromptEnhancement: false,
    supportsNegativePrompt: false,
    supportsCfgScale: false,
    supportsSpecialFx: false,
    supportsStartEndFrames: true,
    maxPromptLength: 5000,
    maxNegativePromptLength: 0,
    maxImageSizeMB: 10,
    pricing: {
      per4s: 0.4,
      per6s: 0.6,
      per8s: 0.8,
    },
  },
};

// Helper functions
export function getAvailableModels(): VideoModelConfig[] {
  return Object.values(VIDEO_MODELS);
}

export function getModelConfig(modelId: VideoModelId): VideoModelConfig {
  return VIDEO_MODELS[modelId];
}

export function getDefaultState(
  modelId: VideoModelId = "kling-2.6"
): VideoGenerationState {
  const config = VIDEO_MODELS[modelId];
  // Use first available mode for the model (Veo doesn't support text-to-video)
  const defaultMode = config.modes.includes("text-to-video")
    ? "text-to-video"
    : config.modes[0];
  // Use first available duration for the model (Veo uses 4/6/8, others use 5/10/15)
  const defaultDuration = config.durations[0] || "5";
  return {
    model: modelId,
    mode: defaultMode,
    prompt: "",
    aspectRatio: "16:9",
    duration: defaultDuration,
    resolution: config.resolutions?.[0],
    audioEnabled: config.supportsAudio,
    enhanceEnabled: false,
    cfgScale: config.supportsCfgScale ? 0.5 : undefined,
    // Veo 3.1 specific defaults
    speed: modelId === "veo-3.1" ? "standard" : undefined,
  };
}

export function calculatePrice(state: VideoGenerationState): number {
  const config = VIDEO_MODELS[state.model];
  let price = 0;

  switch (state.duration) {
    case "4":
      price = config.pricing.per4s || 0;
      break;
    case "5":
      price = config.pricing.per5s || 0;
      break;
    case "6":
      price = config.pricing.per6s || 0;
      break;
    case "8":
      price = config.pricing.per8s || 0;
      break;
    case "10":
      price = config.pricing.per10s || 0;
      break;
    case "15":
      price = config.pricing.per15s || (config.pricing.per10s || 0) * 1.5;
      break;
  }

  // Apply audio multiplier if audio is enabled
  if (state.audioEnabled && config.pricing.audioMultiplier) {
    price *= config.pricing.audioMultiplier;
  }

  return price;
}

// Validation
export function validateState(state: VideoGenerationState): string[] {
  const errors: string[] = [];
  const config = VIDEO_MODELS[state.model];

  if (!state.prompt.trim()) {
    errors.push("Prompt is required");
  }

  if (state.prompt.length > config.maxPromptLength) {
    errors.push(`Prompt exceeds ${config.maxPromptLength} characters`);
  }

  if (
    state.negativePrompt &&
    state.negativePrompt.length > config.maxNegativePromptLength
  ) {
    errors.push(
      `Negative prompt exceeds ${config.maxNegativePromptLength} characters`
    );
  }

  if (state.mode === "image-to-video" && !state.imageUrl) {
    errors.push("Image is required for image-to-video");
  }

  if (
    state.mode === "reference-to-video" &&
    (!state.referenceVideos || state.referenceVideos.length === 0)
  ) {
    errors.push("Reference videos are required for reference-to-video");
  }

  if (!config.aspectRatios.includes(state.aspectRatio)) {
    errors.push(
      `Aspect ratio ${state.aspectRatio} not supported by ${config.name}`
    );
  }

  if (!config.durations.includes(state.duration)) {
    errors.push(`Duration ${state.duration}s not supported by ${config.name}`);
  }

  if (!config.modes.includes(state.mode)) {
    errors.push(`Mode ${state.mode} not supported by ${config.name}`);
  }

  return errors;
}

// Convert UI state to Kling 2.6 API parameters
export function toKling26Params(state: VideoGenerationState) {
  const base = {
    prompt: state.prompt,
    duration: state.duration as "5" | "10",
    cfg_scale: state.cfgScale ?? 0.5,
    ...(state.negativePrompt && { negative_prompt: state.negativePrompt }),
    ...(state.seed !== undefined && { seed: state.seed }),
  };

  if (state.mode === "text-to-video") {
    return {
      ...base,
      aspect_ratio: state.aspectRatio as "16:9" | "9:16" | "1:1",
      generate_audio: state.audioEnabled,
    };
  } else {
    return {
      ...base,
      image_url: state.imageUrl || "",
      generate_audio: state.audioEnabled,
    };
  }
}

// Convert UI state to Kling 2.5 Turbo API parameters
export function toKling25TurboParams(state: VideoGenerationState) {
  const base = {
    prompt: state.prompt,
    duration: state.duration as "5" | "10",
    cfg_scale: state.cfgScale ?? 0.5,
    ...(state.negativePrompt && { negative_prompt: state.negativePrompt }),
    ...(state.seed !== undefined && { seed: state.seed }),
  };

  if (state.mode === "text-to-video") {
    return {
      ...base,
      aspect_ratio: state.aspectRatio as "16:9" | "9:16" | "1:1",
    };
  } else {
    // Image-to-video mode with start frame (required) and optional end frame
    return {
      ...base,
      image_url: state.imageUrl || "",
      ...(state.endImageUrl && { tail_image_url: state.endImageUrl }),
      ...(state.specialFx && { special_fx: state.specialFx }),
    };
  }
}

// Convert UI state to Wan 2.6 API parameters
export function toWan26Params(state: VideoGenerationState) {
  const base = {
    prompt: state.prompt,
    duration: state.duration as "5" | "10" | "15",
    resolution: state.resolution || "720p",
    enable_prompt_expansion: state.enhanceEnabled,
    ...(state.negativePrompt && { negative_prompt: state.negativePrompt }),
    ...(state.seed !== undefined && { seed: state.seed }),
  };

  if (state.mode === "text-to-video") {
    return {
      ...base,
      aspect_ratio: state.aspectRatio as
        | "16:9"
        | "9:16"
        | "1:1"
        | "4:3"
        | "3:4",
    };
  } else if (state.mode === "image-to-video") {
    return {
      ...base,
      image_url: state.imageUrl || "",
    };
  } else {
    // reference-to-video
    return {
      ...base,
      aspect_ratio: state.aspectRatio as
        | "16:9"
        | "9:16"
        | "1:1"
        | "4:3"
        | "3:4",
      reference_videos: state.referenceVideos || [],
    };
  }
}

export function toApiParams(state: VideoGenerationState) {
  switch (state.model) {
    case "kling-2.6":
      return toKling26Params(state);
    case "kling-2.5-turbo":
      return toKling25TurboParams(state);
    case "wan-2.6":
      return toWan26Params(state);
    case "veo-3.1":
      // Veo 3.1 uses different API patterns, handled separately
      return {
        prompt: state.prompt,
        duration: state.duration,
        resolution: state.resolution || "720p",
        generate_audio: state.audioEnabled,
      };
    default:
      throw new Error(`Unknown model: ${state.model}`);
  }
}
