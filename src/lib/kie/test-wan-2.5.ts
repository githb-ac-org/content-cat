/**
 * Test script for Wan 2.5 Video Generation API
 * Run with: KIE_API_KEY=your_key npx tsx src/lib/kie/test-wan-2.5.ts
 */

import {
  createWan25Client,
  ASPECT_RATIOS,
  RESOLUTIONS,
  DURATIONS,
  type TaskState,
} from "./wan-2.5";

const API_KEY = process.env.KIE_API_KEY || "";

async function runTests() {
  console.log("=== Testing Wan 2.5 Video Generation API ===\n");

  if (!API_KEY) {
    console.error("Error: KIE_API_KEY environment variable is required");
    console.log(
      "Usage: KIE_API_KEY=your_key npx tsx src/lib/kie/test-wan-2.5.ts"
    );
    process.exit(1);
  }

  const client = createWan25Client(API_KEY);

  console.log("Available options:");
  console.log("  Aspect Ratios:", ASPECT_RATIOS.join(", "));
  console.log("  Resolutions:", RESOLUTIONS.join(", "));
  console.log("  Durations:", DURATIONS.map((d) => `${d}s`).join(", "));
  console.log();

  // Test 1: Text-to-Video
  console.log("--- Test 1: Text-to-Video (5s, 720p, 16:9) ---");
  try {
    const result = await client.generateTextToVideo(
      {
        prompt:
          "A cute orange cat playing with a ball of yarn in a sunny room, cinematic lighting",
        aspect_ratio: "16:9",
        resolution: "720p",
        duration: "5",
        enable_prompt_expansion: false,
      },
      {
        pollInterval: 5000,
        maxAttempts: 120,
        onStateUpdate: (state: TaskState) => {
          process.stdout.write(`\r  State: ${state}   `);
        },
      }
    );

    console.log("\n  SUCCESS!");
    console.log("  Task ID:", result.task.data?.taskId);
    console.log("  Cost time:", result.task.data?.costTime, "ms");
    console.log("  Result URLs:", result.output?.resultUrls);
  } catch (error) {
    console.error("\n  FAILED:", error);
  }

  // Test 2: Image-to-Video
  console.log("\n--- Test 2: Image-to-Video (5s, 720p) ---");
  try {
    const result = await client.generateImageToVideo(
      {
        prompt: "The cat slowly turns its head and blinks, gentle movement",
        image_url:
          "https://tempfile.aiquickdraw.com/g/fd00abdce58019cd9ba86b86a53fd752_1765821358.png",
        resolution: "720p",
        duration: "5",
        enable_prompt_expansion: false,
      },
      {
        pollInterval: 5000,
        maxAttempts: 120,
        onStateUpdate: (state: TaskState) => {
          process.stdout.write(`\r  State: ${state}   `);
        },
      }
    );

    console.log("\n  SUCCESS!");
    console.log("  Task ID:", result.task.data?.taskId);
    console.log("  Cost time:", result.task.data?.costTime, "ms");
    console.log("  Result URLs:", result.output?.resultUrls);
  } catch (error) {
    console.error("\n  FAILED:", error);
  }

  // Test 3: Text-to-Video with negative prompt
  console.log("\n--- Test 3: Text-to-Video with negative prompt (1080p) ---");
  try {
    const result = await client.generateTextToVideo(
      {
        prompt: "A serene mountain landscape at sunrise with flowing water",
        negative_prompt: "blurry, distorted, low quality",
        aspect_ratio: "16:9",
        resolution: "1080p",
        duration: "5",
      },
      {
        pollInterval: 5000,
        maxAttempts: 120,
        onStateUpdate: (state: TaskState) => {
          process.stdout.write(`\r  State: ${state}   `);
        },
      }
    );

    console.log("\n  SUCCESS!");
    console.log("  Task ID:", result.task.data?.taskId);
    console.log("  Cost time:", result.task.data?.costTime, "ms");
    console.log("  Result URLs:", result.output?.resultUrls);
  } catch (error) {
    console.error("\n  FAILED:", error);
  }

  console.log("\n=== All tests completed ===");
}

runTests();
