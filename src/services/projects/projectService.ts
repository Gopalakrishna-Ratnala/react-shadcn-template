import type { ApiResponse, Project } from "@/types";

import { mockProjectsResponse } from "./mocks";

/**
 * Returns the studio's projects. This template ships a static mock; swap the
 * body for a real `apiClient` call when a backend is wired up — the
 * `ApiResponse<Project[]>` contract stays the same.
 */
export function getProjects(): ApiResponse<Project[]> {
  return mockProjectsResponse;
}
