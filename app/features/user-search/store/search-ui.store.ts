import { create } from "zustand";

/**
 * UI-only state for the search experience.
 *
 * Server state (users, facets, meta, loading, error) lives in React Query;
 * the search state itself lives in the URL. This store only holds transient
 * UI preferences that have no place in either of those.
 */
type SearchUiState = {
  /** Mobile filter drawer visibility. */
  isFiltersSheetOpen: boolean;
  openFiltersSheet: () => void;
  closeFiltersSheet: () => void;
};

export const useSearchUiStore = create<SearchUiState>((set) => ({
  isFiltersSheetOpen: false,
  openFiltersSheet: () => set({ isFiltersSheetOpen: true }),
  closeFiltersSheet: () => set({ isFiltersSheetOpen: false }),
}));
