/**
 * Simple in-memory rate limiter using sliding window algorithm
 * For production, consider using Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  // Maximum requests allowed in the window
  limit: number;
  // Time window in milliseconds
  windowMs: number;
}

// In-memory store for rate limiting (cleared on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60000; // 1 minute
let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
  // Don't prevent process exit
  cleanupTimer.unref();
}

// Preset configurations for different endpoint types
export const RATE_LIMITS = {
  // Expensive operations (AI generation)
  generation: { limit: 10, windowMs: 60000 }, // 10 per minute
  // Standard API operations
  standard: { limit: 100, windowMs: 60000 }, // 100 per minute
  // Read-heavy operations
  read: { limit: 200, windowMs: 60000 }, // 200 per minute
  // Sensitive operations (API keys, auth)
  sensitive: { limit: 20, windowMs: 60000 }, // 20 per minute
} as const;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result with headers info
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  startCleanup();

  const now = Date.now();
  const key = `${identifier}:${config.limit}:${config.windowMs}`;
  const entry = rateLimitStore.get(key);

  // If no entry or window has expired, create new entry
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 * Uses X-Forwarded-For header if behind proxy, falls back to connection IP
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }

  // Fallback to a generic identifier if no IP available
  // In production, you'd want to ensure proper IP forwarding
  return "unknown";
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  };
}
