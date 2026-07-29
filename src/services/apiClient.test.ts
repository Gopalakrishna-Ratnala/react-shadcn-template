import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock("axios", () => {
  const isAxiosError = (error: unknown): boolean =>
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as { isAxiosError?: boolean }).isAxiosError === true;

  return {
    default: {
      create: vi.fn(() => ({ request: requestMock })),
      isAxiosError,
    },
  };
});

import { apiClient, ApiError } from "./apiClient";

interface MockAxiosErrorOverrides {
  message?: string;
  code?: string;
  response?: { status: number; data: unknown };
}

const makeAxiosError = (
  overrides: MockAxiosErrorOverrides = {},
): Record<string, unknown> => ({
  isAxiosError: true,
  message: overrides.message ?? "Request failed",
  code: overrides.code,
  response: overrides.response,
});

describe("apiClient", () => {
  afterEach(() => {
    requestMock.mockReset();
  });

  it("creates a single axios instance from env.apiBaseUrl with JSON headers", () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "http://localhost:3001",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("returns response data on a successful GET", async () => {
    requestMock.mockResolvedValueOnce({
      data: [{ id: 1, name: "Example item one" }],
    });

    const result =
      await apiClient.get<{ id: number; name: string }[]>("/example");

    expect(result).toEqual([{ id: 1, name: "Example item one" }]);
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: "GET", url: "/example" }),
    );
  });

  it("sends the request body on POST with the correct method/url", async () => {
    requestMock.mockResolvedValueOnce({ data: { id: 3, name: "New item" } });

    await apiClient.post("/example", { name: "New item" });

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/example",
        data: { name: "New item" },
      }),
    );
  });

  it("throws an ApiError with the status code on a non-2xx response", async () => {
    requestMock.mockRejectedValueOnce(
      makeAxiosError({
        response: { status: 404, data: { message: "Not found" } },
      }),
    );

    await expect(apiClient.get("/nonexistent")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
    });
  });

  it("throws ApiError (not a raw exception) on a network failure", async () => {
    requestMock.mockRejectedValueOnce(
      makeAxiosError({ code: "ERR_NETWORK", message: "Network Error" }),
    );

    await expect(apiClient.get("/example")).rejects.toBeInstanceOf(ApiError);
  });

  it("throws ApiError with status 0 when the request times out", async () => {
    requestMock.mockRejectedValueOnce(
      makeAxiosError({ code: "ECONNABORTED", message: "timeout exceeded" }),
    );

    await expect(apiClient.get("/example")).rejects.toMatchObject({
      name: "ApiError",
      status: 0,
    });
  });
});
