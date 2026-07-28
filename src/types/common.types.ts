export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error?: string;
}

// For non-route-tied fetches only (e.g. a modal's on-demand fetch,
// search-as-you-type) - route-tied pending/error state comes from
// useNavigation()/useFetcher().state instead. See core/10-error-handling.md.
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
