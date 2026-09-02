import type { Route } from "./+types/users-search";

import type { ApiError } from "~/lib/api/axios";
import { ActiveFilters } from "~/features/user-search/components/active-filters";
import { MobileFilters } from "~/features/user-search/components/mobile-filters";
import { SearchBar } from "~/features/user-search/components/search-bar";
import { SearchFilters } from "~/features/user-search/components/search-filters";
import { SearchPagination } from "~/features/user-search/components/search-pagination";
import { SearchResults } from "~/features/user-search/components/search-results";
import { useSearchFilters } from "~/features/user-search/hooks/use-search-filters";
import { useUserSearch } from "~/features/user-search/hooks/use-user-search";
import type { SearchFilters as SearchFiltersState } from "~/features/user-search/utils/search-params";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LinkedIn Search" },
    { name: "description", content: "Search professional profiles by skills, titles and location." },
  ];
}

/** True when any filter (besides pagination) is active. */
function hasActiveFilters(filters: SearchFiltersState): boolean {
  return Boolean(filters.q) || filters.skills.length > 0 || Boolean(filters.jobTitle) || Boolean(filters.location);
}

export default function UsersSearchPage() {
  const { filters, update } = useSearchFilters();
  const { data, isLoading, isFetching, isError, error, refetch } = useUserSearch(filters);

  const handleFilterChange = (changes: Partial<Omit<SearchFiltersState, "page">>) =>
    update(changes, { replace: true });
  const handleClearFilters = () =>
    update({ q: "", skills: [], jobTitle: "", location: "" }, { replace: true });
  const handlePageChange = (page: number) => update({ page }, { replace: false });

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">LinkedIn Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find professional profiles by skills, titles and location.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchBar
          value={filters.q}
          onChange={(q) => handleFilterChange({ q })}
          isFetching={isFetching && !isLoading}
        />
        <SearchFilters filters={filters} facets={data?.facets} onChange={handleFilterChange} />
        <MobileFilters
          filters={filters}
          facets={data?.facets}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
        <ActiveFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      {meta && (
        <div className="mt-6 flex items-center gap-2">
          <p role="status" className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{meta.total}</span>{" "}
            {meta.total === 1 ? "profile" : "profiles"} found
          </p>
          {isFetching && !isLoading && (
            <span
              role="status"
              aria-label="Updating results"
              className="size-3.5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
            />
          )}
        </div>
      )}

      <section className="mt-3">
        <SearchResults
          users={users}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          error={error as ApiError | null}
          onRetry={() => void refetch()}
          hasActiveFilters={hasActiveFilters(filters)}
          onClearFilters={handleClearFilters}
        />
      </section>

      {meta && (
        <div className="mt-8">
          <SearchPagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            disabled={isFetching}
          />
        </div>
      )}
    </main>
  );
}
