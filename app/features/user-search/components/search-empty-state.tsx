import { SearchXIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

type SearchEmptyStateProps = {
  hasFilters: boolean;
  onClearFilters: () => void;
};

export function SearchEmptyState({ hasFilters, onClearFilters }: SearchEmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center"
    >
      <SearchXIcon aria-hidden="true" className="size-10 text-muted-foreground/60" />
      <div>
        <h3 className="text-base font-semibold">No profiles found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or removing some filters.
        </p>
      </div>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
