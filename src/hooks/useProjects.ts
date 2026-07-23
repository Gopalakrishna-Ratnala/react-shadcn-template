import { useState } from "react";

import { getProjects } from "@/services/projects";
import type { AsyncState, Project } from "@/types";

interface UseProjectsResult {
  state: AsyncState<Project[]>;
}

/**
 * Loads the studio's projects into an AsyncState the UI can render directly.
 * The mock service resolves synchronously, so this seeds a success state; the
 * consuming page still handles loading/error branches for real backends.
 */
export function useProjects(): UseProjectsResult {
  const [state] = useState<AsyncState<Project[]>>(() => {
    const response = getProjects();
    return { status: "success", data: response.data };
  });

  return { state };
}
