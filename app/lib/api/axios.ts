import axios, { AxiosError, type AxiosInstance } from "axios";

/**
 * Centralized Axios instance.
 *
 * The base URL comes from the environment so no environment-specific URL is
 * hardcoded in the application code.
 */
export const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

/** The categories of failures the UI needs to distinguish. */
export type ApiErrorKind =
  | "validation" // 4xx (bad request, validation errors)
  | "unavailable" // 5xx / backend not reachable
  | "network" // request never reached the backend
  | "cancelled" // request was aborted (stale search)
  | "unknown";

/** Normalized error surfaced to the UI. Never contains raw backend internals. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

const KIND_MESSAGES: Record<ApiErrorKind, string> = {
  validation:
    "Your search request was not valid. Please adjust your filters and try again.",
  unavailable:
    "The search service is temporarily unavailable. Please try again shortly.",
  network:
    "We couldn't reach the server. Please check your connection and try again.",
  cancelled: "The request was cancelled.",
  unknown: "Something went wrong while loading results. Please try again.",
};

/** Converts any thrown value (typically an AxiosError) into an ApiError. */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isCancel(error)) {
    return new ApiError("cancelled", KIND_MESSAGES.cancelled);
  }

  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return new ApiError("unavailable", KIND_MESSAGES.unavailable);
    }
    if (!error.response) {
      return new ApiError("network", KIND_MESSAGES.network);
    }
    const status = error.response.status;
    if (status >= 500) {
      return new ApiError("unavailable", KIND_MESSAGES.unavailable, status);
    }
    return new ApiError("validation", KIND_MESSAGES.validation, status);
  }

  return new ApiError("unknown", KIND_MESSAGES.unknown);
}
