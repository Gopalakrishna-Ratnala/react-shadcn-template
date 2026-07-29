import axios from "axios";

import { env } from "@/config/env";

/**
 * Central HTTP client for talking to the local mock API (json-server) in
 * development, or a real backend in production — only this file and the
 * VITE_API_BASE_URL env var need to change to swap one for the other.
 *
 * Uses axios (chosen over native fetch for its built-in per-request
 * cancellation/timeout and error normalization). json-server's REST
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

const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

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
  try {
    const response = await axiosInstance.request<T>({
      method,
      url: path,
      data: body,
      timeout: options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      // Let an externally-provided signal abort the request too (e.g. a
      // component unmounting), in addition to axios's own timeout above.
      signal: options?.signal,
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;

    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new ApiError(
          `Request failed: ${method} ${path} (${error.response.status})`,
          error.response.status,
          error.response.data,
        );
      }

      if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
        throw new ApiError(`Request timed out: ${method} ${path}`, 0, null);
      }

      throw new ApiError(
        `Network error: ${method} ${path} — ${error.message}`,
        0,
        null,
      );
    }

    throw new ApiError(
      `Network error: ${method} ${path} — ${error instanceof Error ? error.message : "unknown error"}`,
      0,
      null,
    );
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>("GET", path, undefined, options),
  post: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> => request<T>("POST", path, body, options),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> => request<T>("PATCH", path, body, options),
  put: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> => request<T>("PUT", path, body, options),
  del: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>("DELETE", path, undefined, options),
};
