import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient, ApiError } from "./apiClient";

function mockFetchOnce(
  body: unknown,
  init: { status?: number; contentType?: string } = {},
) {
  const { status = 200, contentType = "application/json" } = init;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => contentType },
      json: async () => body,
      text: async () => String(body),
    }),
  );
}

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON on a successful GET", async () => {
    mockFetchOnce([{ id: 1, name: "Example item one" }]);
    const result =
      await apiClient.get<{ id: number; name: string }[]>("/example");
    expect(result).toEqual([{ id: 1, name: "Example item one" }]);
  });

  it("sends a JSON body on POST with the correct headers", async () => {
    mockFetchOnce({ id: 3, name: "New item" }, { status: 201 });
    await apiClient.post("/example", { name: "New item" });

    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/example"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New item" }),
      }),
    );
  });

  it("throws an ApiError with the status code on a non-2xx response", async () => {
    mockFetchOnce({ message: "Not found" }, { status: 404 });
    await expect(apiClient.get("/nonexistent")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
    });
  });

  it("throws ApiError (not a raw exception) on a network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );
    await expect(apiClient.get("/example")).rejects.toBeInstanceOf(ApiError);
  });
});
