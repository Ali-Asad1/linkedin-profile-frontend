import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

type SearchPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

/**
 * Compact page navigation: `1 2 3 … 10`.
 * `meta.totalPages` from the API is the source of truth.
 */
export function SearchPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: SearchPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav aria-label="Search result pages" className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        aria-label="Previous page"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon aria-hidden="true" />
        Previous
      </Button>
      {pages.map((entry, index) =>
        entry === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="px-1.5 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={entry}
            variant={entry === page ? "default" : "ghost"}
            size="sm"
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            disabled={disabled}
            className="min-w-8"
            onClick={() => onPageChange(entry)}
          >
            {entry}
          </Button>
        ),
      )}
      <Button
        variant="outline"
        size="sm"
        aria-label="Next page"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRightIcon aria-hidden="true" />
      </Button>
    </nav>
  );
}

/** Produces a compact list like [1, 2, 3, "ellipsis", 10] around the current page. */
function buildPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("ellipsis");

  pages.push(totalPages);
  return pages;
}
