/**
 * CSRF protection and fetch utilities for client-side requests
 */

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Get the CSRF token from cookies
 */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === CSRF_COOKIE) {
      return value;
    }
  }
  return null;
}

/**
 * Get headers with CSRF token included
 */
export function getCsrfHeaders(): HeadersInit {
  const token = getCsrfToken();
  if (!token) return {};
  return { [CSRF_HEADER]: token };
}

/**
 * Options for apiFetch
 */
interface ApiFetchOptions extends RequestInit {
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Wrapper for fetch that automatically includes CSRF token
 * for state-changing requests and handles timeouts
 */
export async function apiFetch(
  url: string | URL,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  const method = fetchOptions.method?.toUpperCase() || "GET";
  const isStateChanging = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  // Add CSRF token for state-changing requests
  if (isStateChanging) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        [CSRF_HEADER]: csrfToken,
      };
    }
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Backwards compatible alias
export const fetchWithCsrf = apiFetch;
