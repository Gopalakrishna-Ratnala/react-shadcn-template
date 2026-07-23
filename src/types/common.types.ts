export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error?: string;
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
