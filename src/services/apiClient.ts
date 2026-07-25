import { env } from "@/config/env";

/**
 * Central HTTP client for talking to the local mock API (json-server) in
 * development, or a real backend in production — only this file and the
 * VITE_API_BASE_URL env var need to change to swap one for the other.
 *
 * Uses native fetch (no HTTP library dependency). json-server's REST
 * conventions map directly onto the methods below:
 *   GET    /resource       -> apiClient.get<T[]>("/resource")
 *   GET    /resource/:id   -> apiClient.get<T>(`/resource/${id}`)
 *   POST   /resource       -> apiClient.post<T>("/resource", body)
 *   PATCH  /resource/:id   -> apiClient.patch<T>(`/resource/${id}`, body)
 *   DELETE /resource/:id   -> apiClient.del<T>(`/resource/${id}`)
 */

const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  // Let an externally-provided signal abort the request too (e.g. React Query,
  // or a component unmounting), in addition to our own timeout.
  options?.signal?.addEventListener("abort", () => controller.abort());

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new ApiError(
        `Request failed: ${method} ${path} (${response.status})`,
        response.status,
        data,
      );
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(`Request timed out: ${method} ${path}`, 0, null);
    }
    throw new ApiError(
      `Network error: ${method} ${path} — ${error instanceof Error ? error.message : "unknown error"}`,
      0,
      null,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  del: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
