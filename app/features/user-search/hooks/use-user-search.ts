import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { searchUsers } from "../api/search-users";
import type { SearchFilters } from "../utils/search-params";
import type { UserSearchResponse } from "../types/search.types";

/** Stable query key that includes every parameter affecting the result. */
export function userSearchQueryKey(filters: SearchFilters) {
  return [
    "users-search",
    {
      q: filters.q,
      skills: [...filters.skills].sort().join(","),
      jobTitle: filters.jobTitle,
      location: filters.location,
      page: filters.page,
      limit: filters.limit,
    },
  ] as const;
}

/**
 * Server-state hook for the search page.
 *
 * - Previous results are kept visible while a new search loads
 *   (`placeholderData: keepPreviousData`).
 * - Requests are cancelled via the query signal when parameters change.
 * - The next page is prefetched so pagination feels instant.
 */
export function useUserSearch(filters: SearchFilters): UseQueryResult<UserSearchResponse> {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: userSearchQueryKey(filters),
    queryFn: ({ signal }) => searchUsers(filters, { signal }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  // Prefetch the next page when it exists (fire-and-forget).
  useEffect(() => {
    const { page, limit } = filters;
    const meta = query.data?.meta;
    if (!meta || page >= meta.totalPages) return;

    void queryClient.prefetchQuery({
      queryKey: userSearchQueryKey({ ...filters, page: page + 1 }),
      queryFn: ({ signal }) => searchUsers({ ...filters, page: page + 1, limit }, { signal }),
      staleTime: 60_000,
    });
  }, [filters, query.data?.meta, queryClient]);

  return query;
}
