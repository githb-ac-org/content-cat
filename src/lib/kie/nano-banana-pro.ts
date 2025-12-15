/**
 * Kie.ai Nano Banana Pro API Module
 * Fast and precise AI image generation with strong visual consistency
 */

// Types
export type AspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9"
  | "auto";

export type Resolution = "1K" | "2K" | "4K";

export type OutputFormat = "png" | "jpg";

export type TaskState = "waiting" | "processing" | "success" | "fail";

export interface NanoBananaProInput {
  /** Text description of desired image (max 10,000 characters) */
  prompt: string;
  /** Reference images for transformation (max 8 images, 30MB each; accepts JPEG, PNG, WebP) */
  image_input?: string[];
  /** Aspect ratio of the output image */
  aspect_ratio?: AspectRatio;
  /** Resolution of the output image */
  resolution?: Resolution;
  /** Output format of the generated image */
  output_format?: OutputFormat;
}

export interface NanoBananaProRequest {
  model: "nano-banana-pro";
  input: NanoBananaProInput;
  /** Webhook URL for completion notifications */
  callBackUrl?: string;
}

export interface CreateTaskResponse {
  code: number;
  msg: string;
  data?: {
    taskId: string;
  };
}

export interface TaskResultData {
  taskId: string;
  model: string;
  state: TaskState;
  param: string;
  resultJson: string;
  failCode: string | null;
  failMsg: string | null;
  costTime: number | null;
  completeTime: number | null;
  createTime: number;
}

export interface TaskResult {
  code: number;
  msg: string;
  data?: TaskResultData;
}

export interface ParsedTaskOutput {
  /** Array of generated image URLs */
  resultUrls?: string[];
  [key: string]: unknown;
}

// Constants
const API_BASE_URL = "https://api.kie.ai/api/v1";
const CREATE_TASK_ENDPOINT = `${API_BASE_URL}/jobs/createTask`;
const GET_TASK_ENDPOINT = `${API_BASE_URL}/jobs/recordInfo`;

// Default values
export const DEFAULT_ASPECT_RATIO: AspectRatio = "1:1";
export const DEFAULT_RESOLUTION: Resolution = "1K";
export const DEFAULT_OUTPUT_FORMAT: OutputFormat = "png";

// Available options for frontend
export const ASPECT_RATIOS: AspectRatio[] = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
  "auto",
];

export const RESOLUTIONS: Resolution[] = ["1K", "2K", "4K"];

export const OUTPUT_FORMATS: OutputFormat[] = ["png", "jpg"];

export const MAX_PROMPT_LENGTH = 10000;
export const MAX_REFERENCE_IMAGES = 8;
export const MAX_IMAGE_SIZE_MB = 30;

/**
 * Nano Banana Pro API Client
 */
export class NanoBananaProClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Create a new image generation task
   */
  async createTask(
    input: NanoBananaProInput,
    callBackUrl?: string
  ): Promise<CreateTaskResponse> {
    // Validate prompt length
    if (input.prompt.length > MAX_PROMPT_LENGTH) {
      throw new Error(
        `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`
      );
    }

    // Validate reference images count
    if (input.image_input && input.image_input.length > MAX_REFERENCE_IMAGES) {
      throw new Error(
        `Maximum ${MAX_REFERENCE_IMAGES} reference images allowed`
      );
    }

    const request: NanoBananaProRequest = {
      model: "nano-banana-pro",
      input: {
        prompt: input.prompt,
        image_input: input.image_input || [],
        aspect_ratio: input.aspect_ratio || DEFAULT_ASPECT_RATIO,
        resolution: input.resolution || DEFAULT_RESOLUTION,
        output_format: input.output_format || DEFAULT_OUTPUT_FORMAT,
      },
      ...(callBackUrl && { callBackUrl }),
    };

    const response = await fetch(CREATE_TASK_ENDPOINT, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    const data: CreateTaskResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`API Error: ${data.msg} (code: ${data.code})`);
    }

    return data;
  }

  /**
   * Get task status and results
   */
  async getTask(taskId: string): Promise<TaskResult> {
    const url = new URL(GET_TASK_ENDPOINT);
    url.searchParams.set("taskId", taskId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data: TaskResult = await response.json();

    if (data.code !== 200) {
      throw new Error(`API Error: ${data.msg} (code: ${data.code})`);
    }

    return data;
  }

  /**
   * Parse the result JSON from a completed task
   */
  parseResultJson(resultJson: string): ParsedTaskOutput | null {
    if (!resultJson) return null;
    try {
      return JSON.parse(resultJson) as ParsedTaskOutput;
    } catch {
      return null;
    }
  }

  /**
   * Create a task and poll until completion
   */
  async generateImage(
    input: NanoBananaProInput,
    options?: {
      pollInterval?: number;
      maxAttempts?: number;
      onStateUpdate?: (state: TaskState) => void;
    }
  ): Promise<{ task: TaskResult; output: ParsedTaskOutput | null }> {
    const pollInterval = options?.pollInterval || 2000;
    const maxAttempts = options?.maxAttempts || 60;

    // Create the task
    const createResponse = await this.createTask(input);
    const taskId = createResponse.data?.taskId;

    if (!taskId) {
      throw new Error("Failed to get task ID from response");
    }

    // Poll for completion
    let attempts = 0;
    while (attempts < maxAttempts) {
      const taskResult = await this.getTask(taskId);
      const state = taskResult.data?.state;

      if (options?.onStateUpdate && state) {
        options.onStateUpdate(state);
      }

      if (state === "success") {
        const output = this.parseResultJson(taskResult.data?.resultJson || "");
        return { task: taskResult, output };
      }

      if (state === "fail") {
        throw new Error(
          `Task failed: ${taskResult.data?.failMsg || "Unknown error"} (code: ${taskResult.data?.failCode})`
        );
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Task timed out after ${maxAttempts} attempts`);
  }
}

/**
 * Create a new Nano Banana Pro client
 */
export function createNanoBananaProClient(apiKey: string): NanoBananaProClient {
  return new NanoBananaProClient(apiKey);
}
