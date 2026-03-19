import Cookies from "js-cookie";

// Simple centralized fetch helper used across the frontend API layer.
// Purpose:
// - Provide a single place to configure the API base URL (via `VITE_API_BASE`).
// - Add a default timeout and AbortSignal forwarding so callers can cancel
//   inflight requests on unmount or navigation.
// - Normalize JSON parsing and non-JSON fallbacks.
// - Surface HTTP errors with status + parsed body when available.

// Default timeout for requests (ms).
const DEFAULT_TIMEOUT = 10000; // 10s

export function setAuthToken(_token: string | null) {}

// Base URL for API requests. Prefer using `VITE_API_BASE` in your env.
// If not provided the helper falls back to localhost for local dev.
const API_BASE = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || "http://localhost:8000";

// Extended options for apiFetch. Mirrors `RequestInit` and adds `timeoutMs`.
export interface ApiFetchOptions extends RequestInit {
  // How long to wait before aborting the request (ms).
  timeoutMs?: number;
}

function requiresCsrf(method: string) {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

async function ensureCsrfCookie() {
  if (typeof window === "undefined") return;
  if (Cookies.get("XSRF-TOKEN")) return;

  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });
}

/**
 * apiFetch
 * - `path` can be a full URL (starts with http) or a relative path (e.g. '/api/news').
 * - Accepts an optional `signal` to forward aborts from the caller.
 * - Provides a default timeout and will throw on non-OK responses (with parsed
 *   body attached when available).
 *
 * Usage examples:
 *   const news = await apiFetch('/api/news');
 *
 *   // With abort signal (recommended inside useEffect cleanup):
 *   const controller = new AbortController();
 *   apiFetch('/api/eras', { signal: controller.signal }).then(...);
 *   controller.abort();
 */
export async function apiFetch<T = any>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT, signal: userSignal, headers: userHeaders, body, ...rest } = options;

  // Local controller used for timeout + forwarded aborts.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // If caller provided a signal, forward its aborts to our controller.
  if (userSignal) {
    // If the provided signal is already aborted, abort immediately instead of
    // registering a listener which some environments may trigger synchronously.
    if (userSignal.aborted) {
      clearTimeout(timeout);
      const e = new Error("Request aborted by caller");
      (e as any).name = "AbortError";
      throw e;
    }

    userSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  // Build URL: accept absolute URLs or join with the API_BASE.
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const method = (rest.method ?? (body ? "POST" : "GET")).toUpperCase();

  if (requiresCsrf(method) && !url.endsWith("/sanctum/csrf-cookie")) {
    await ensureCsrfCookie();
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const csrfToken = Cookies.get("XSRF-TOKEN");

  const init: RequestInit = {
    method,
    headers: ({
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(requiresCsrf(method) && csrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(csrfToken) } : {}),
      ...(userHeaders as Record<string, string> | undefined),
    } as HeadersInit),
    body: body && typeof body === "object" && !isFormData ? JSON.stringify(body) : (body as any) ?? undefined,
    signal: controller.signal,
    credentials: "include", // Ensure cookies (including HttpOnly) are sent
    ...rest,
  };

  try {
    // Debug: log method + URL so we can inspect failing requests in console.
    try {
      // eslint-disable-next-line no-console
      console.debug("apiFetch ->", init.method, url);
    } catch {}
    const res = await fetch(url, init);
    clearTimeout(timeout);

    // Read raw text first so we can gracefully handle non-JSON responses.
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      // If response isn't valid JSON, return the raw text.
      data = text;
    }

    if (!res.ok) {
      // Attach parsed response body to the thrown error for downstream handling.
      const err = new Error(`Request failed ${res.status} ${res.statusText}`);
      (err as any).status = res.status;
      (err as any).data = data;
      throw err;
    }

    return data as T;
  } catch (err) {
    // Normalize abort errors to a clear message so callers can detect timeouts.
    if ((err as any).name === "AbortError") {
      const e = new Error("Request aborted or timed out");
      (e as any).cause = err;
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
