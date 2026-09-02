import type { SearchResultsProps } from "./search-results.types";
import { UserCard } from "./user-card";
import { UserCardSkeleton } from "./user-card-skeleton";
import { SearchEmptyState } from "./search-empty-state";
import { SearchErrorState } from "./search-error-state";

/**
 * Results list with the four UI states:
 * initial loading (skeletons), error, empty, and the results themselves.
 * While a new search is loading, the previous results stay visible and a
 * subtle overlay communicates that a refresh is happening.
 */
export function SearchResults({
  users,
  isLoading,
  isFetching,
  isError,
  error,
  onRetry,
  hasActiveFilters,
  onClearFilters,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-label="Loading results">
        {Array.from({ length: 6 }, (_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    if (error) {
      return <SearchErrorState error={error} onRetry={onRetry} />;
    }
    return null;
  }

  if (users.length === 0) {
    return <SearchEmptyState hasFilters={hasActiveFilters} onClearFilters={onClearFilters} />;
  }

  return (
    <div className="relative" aria-busy={isFetching}>
      <ul className="space-y-3 transition-opacity" aria-label="Search results">
        {users.map((user) => (
          <li key={user.id}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
}
