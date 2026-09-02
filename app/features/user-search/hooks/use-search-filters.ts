import { useSearchParams } from "react-router";

import {
  DEFAULT_FILTERS,
  parseSearchParams,
  serializeSearchParams,
  withFilters,
  type SearchFilters,
} from "../utils/search-params";

/**
 * URL-backed search filter state.
 *
 * The URL is the single source of truth: filters are parsed from the current
 * URL search params on every render, and updates go through the router.
 *
 * - Filter/keyword changes replace the history entry (typing must not spam
 *   browser history) and reset page to 1.
 * - Pagination changes push a new history entry so Back/Forward feels natural.
 */
export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseSearchParams(searchParams);

  function update(changes: Partial<Omit<SearchFilters, "page">> & { page?: number }, options?: { resetPage?: boolean; replace?: boolean }) {
    const { replace = true, ...rest } = options ?? {};
    const next = withFilters(filters, changes, rest);
    setSearchParams(serializeSearchParams(next), { replace });
  }

  return { filters, update };
}

export { DEFAULT_FILTERS };
