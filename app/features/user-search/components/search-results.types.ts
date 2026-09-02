import type { ApiError } from "~/lib/api/axios";
import type { User } from "../types/search.types";

export type SearchResultsProps = {
  users: User[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: ApiError | null;
  onRetry: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};
