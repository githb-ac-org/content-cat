/**
 * Kie.ai API Module
 * Provides access to various AI image and video generation models
 */

// Nano Banana Pro - Image generation
export {
  // Client
  NanoBananaProClient,
  createNanoBananaProClient,
  // Types
  type AspectRatio as NanoBananaProAspectRatio,
  type Resolution as NanoBananaProResolution,
  type OutputFormat as NanoBananaProOutputFormat,
  type TaskState as NanoBananaProTaskState,
  type NanoBananaProInput,
  type NanoBananaProRequest,
  type CreateTaskResponse as NanoBananaProCreateTaskResponse,
  type TaskResultData as NanoBananaProTaskResultData,
  type TaskResult as NanoBananaProTaskResult,
  type ParsedTaskOutput as NanoBananaProParsedTaskOutput,
  // Constants
  ASPECT_RATIOS as NANO_BANANA_PRO_ASPECT_RATIOS,
  RESOLUTIONS as NANO_BANANA_PRO_RESOLUTIONS,
  OUTPUT_FORMATS as NANO_BANANA_PRO_OUTPUT_FORMATS,
  DEFAULT_ASPECT_RATIO as NANO_BANANA_PRO_DEFAULT_ASPECT_RATIO,
  DEFAULT_RESOLUTION as NANO_BANANA_PRO_DEFAULT_RESOLUTION,
  DEFAULT_OUTPUT_FORMAT as NANO_BANANA_PRO_DEFAULT_OUTPUT_FORMAT,
  MAX_PROMPT_LENGTH as NANO_BANANA_PRO_MAX_PROMPT_LENGTH,
  MAX_REFERENCE_IMAGES as NANO_BANANA_PRO_MAX_REFERENCE_IMAGES,
  MAX_IMAGE_SIZE_MB as NANO_BANANA_PRO_MAX_IMAGE_SIZE_MB,
} from "./nano-banana-pro";

// Kling 2.6 - Video generation
export {
  // Client
  Kling26Client,
  createKling26Client,
  // Types
  type Kling26Model,
  type Kling26AspectRatio,
  type Kling26Duration,
  type TaskState as Kling26TaskState,
  type Kling26TextToVideoInput,
  type Kling26ImageToVideoInput,
  type Kling26TextToVideoRequest,
  type Kling26ImageToVideoRequest,
  type Kling26Request,
  type CreateTaskResponse as Kling26CreateTaskResponse,
  type TaskResultData as Kling26TaskResultData,
  type TaskResult as Kling26TaskResult,
  type ParsedTaskOutput as Kling26ParsedTaskOutput,
  // Constants
  ASPECT_RATIOS as KLING_26_ASPECT_RATIOS,
  DURATIONS as KLING_26_DURATIONS,
  DEFAULT_ASPECT_RATIO as KLING_26_DEFAULT_ASPECT_RATIO,
  DEFAULT_DURATION as KLING_26_DEFAULT_DURATION,
  DEFAULT_SOUND as KLING_26_DEFAULT_SOUND,
  MAX_PROMPT_LENGTH as KLING_26_MAX_PROMPT_LENGTH,
  MAX_IMAGE_URLS as KLING_26_MAX_IMAGE_URLS,
  MAX_IMAGE_SIZE_MB as KLING_26_MAX_IMAGE_SIZE_MB,
} from "./kling-2.6";

// Wan 2.5 - Video generation
export {
  // Client
  Wan25Client,
  createWan25Client,
  // Types
  type Wan25Model,
  type Wan25AspectRatio,
  type Wan25Resolution,
  type Wan25Duration,
  type TaskState as Wan25TaskState,
  type Wan25TextToVideoInput,
  type Wan25ImageToVideoInput,
  type Wan25TextToVideoRequest,
  type Wan25ImageToVideoRequest,
  type Wan25Request,
  type CreateTaskResponse as Wan25CreateTaskResponse,
  type TaskResultData as Wan25TaskResultData,
  type TaskResult as Wan25TaskResult,
  type ParsedTaskOutput as Wan25ParsedTaskOutput,
  // Constants
  ASPECT_RATIOS as WAN_25_ASPECT_RATIOS,
  RESOLUTIONS as WAN_25_RESOLUTIONS,
  DURATIONS as WAN_25_DURATIONS,
  DEFAULT_ASPECT_RATIO as WAN_25_DEFAULT_ASPECT_RATIO,
  DEFAULT_RESOLUTION as WAN_25_DEFAULT_RESOLUTION,
  DEFAULT_DURATION as WAN_25_DEFAULT_DURATION,
  DEFAULT_ENABLE_PROMPT_EXPANSION as WAN_25_DEFAULT_ENABLE_PROMPT_EXPANSION,
  MAX_PROMPT_LENGTH as WAN_25_MAX_PROMPT_LENGTH,
  MAX_NEGATIVE_PROMPT_LENGTH as WAN_25_MAX_NEGATIVE_PROMPT_LENGTH,
  MAX_IMAGE_SIZE_MB as WAN_25_MAX_IMAGE_SIZE_MB,
  MAX_SEED as WAN_25_MAX_SEED,
} from "./wan-2.5";

// Video Configuration - UI to API mapping
export {
  // Types
  type VideoModelId,
  type VideoMode,
  type AspectRatio as VideoAspectRatio,
  type Duration as VideoDuration,
  type Resolution as VideoResolution,
  type VideoModelConfig,
  type VideoGenerationState,
  // Constants
  VIDEO_MODELS,
  // Functions
  getAvailableModels,
  getModelConfig,
  getDefaultState,
  calculateCredits,
  validateState,
  toKling26Params,
  toWan25Params,
  toApiParams,
} from "./video-config";
