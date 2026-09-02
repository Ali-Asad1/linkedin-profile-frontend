import { SlidersHorizontalIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ActiveFilters } from "./active-filters";
import { SearchFiltersStacked } from "./search-filters";
import type { SearchFacets } from "../types/search.types";
import type { SearchFilters } from "../utils/search-params";
import { useSearchUiStore } from "../store/search-ui.store";

type MobileFiltersProps = {
  filters: SearchFilters;
  facets: SearchFacets | undefined;
  onChange: (changes: Partial<Omit<SearchFilters, "page">>) => void;
  onClear: () => void;
};

/**
 * Mobile filter experience: a slide-in sheet (Base UI Dialog) containing the
 * same filters as the desktop toolbar. State is owned by the Zustand UI store.
 */
export function MobileFilters({ filters, facets, onChange, onClear }: MobileFiltersProps) {
  const isOpen = useSearchUiStore((state) => state.isFiltersSheetOpen);
  const openFiltersSheet = useSearchUiStore((state) => state.openFiltersSheet);
  const closeFiltersSheet = useSearchUiStore((state) => state.closeFiltersSheet);

  const activeCount =
    filters.skills.length + (filters.jobTitle ? 1 : 0) + (filters.location ? 1 : 0);

  return (
    <div className="md:hidden">
      <Dialog open={isOpen} onOpenChange={(open) => (open ? openFiltersSheet() : closeFiltersSheet())}>
        <DialogTrigger
          render={
            <Button variant="outline" onClick={openFiltersSheet}>
              <SlidersHorizontalIcon aria-hidden="true" className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-secondary px-1.5 text-xs">{activeCount}</span>
              )}
            </Button>
          }
        />
        <DialogContent aria-label="Filters">
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>Refine your profile search.</DialogDescription>
          {filters.skills.length > 0 || filters.jobTitle || filters.location ? (
            <ActiveFilters filters={filters} onChange={onChange} onClear={onClear} />
          ) : null}
          <SearchFiltersStacked filters={filters} facets={facets} onChange={onChange} />
          <Button onClick={closeFiltersSheet}>Show results</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
