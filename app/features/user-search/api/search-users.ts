import { isAxiosError } from "axios";

import { axiosInstance, normalizeApiError } from "~/lib/api/axios";

import type { UserSearchParams, UserSearchResponse } from "../types/search.types";

export function buildSearchQuery(params: UserSearchParams): Record<string, string> {
  const query: Record<string, string> = {
    page: String(params.page),
    limit: String(params.limit),
  };

  if (params.q) query.q = params.q;
  if (params.skills && params.skills.length > 0) query.skills = params.skills.join(",");
  if (params.jobTitle) query.jobTitle = params.jobTitle;
  if (params.location) query.location = params.location;

  return query;
}

/**
 * GET /api/v1/users/search
 *
 * The only search API function. Accepts TanStack Query's `signal` so
 * in-flight requests are cancelled when the search parameters change.
 */
export async function searchUsers(
  params: UserSearchParams,
  options: { signal?: AbortSignal } = {},
): Promise<UserSearchResponse> {
  try {
    const response = await axiosInstance.get<UserSearchResponse>("/api/v1/users/search", {
      params: buildSearchQuery(params),
      signal: options.signal,
    });
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export { isAxiosError };
