import { LoaderIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { LocationFilter } from "./location-filter";
import { JobTitleFilter } from "./job-title-filter";
import { SkillFilter } from "./skill-filter";
import type { SearchFacets } from "../types/search.types";
import type { SearchFilters } from "../utils/search-params";

type SearchFiltersProps = {
  filters: SearchFilters;
  facets: SearchFacets | undefined;
  onChange: (changes: Partial<Omit<SearchFilters, "page">>) => void;
};

/**
 * The filter controls row (Skills, Job Title, Location).
 * Facets come from the latest search response; if they are not loaded yet,
 * the controls are disabled instead of rendering empty dropdowns.
 */
export function SearchFilters({ filters, facets, onChange }: SearchFiltersProps) {
  const disabled = facets === undefined;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SkillFilter
        facets={facets?.skills ?? []}
        selected={filters.skills}
        onChange={(skills) => onChange({ skills })}
        disabled={disabled}
      />
      <JobTitleFilter
        facets={facets?.jobTitles ?? []}
        value={filters.jobTitle}
        onChange={(jobTitle) => onChange({ jobTitle })}
        disabled={disabled}
      />
      <LocationFilter
        facets={facets?.locations ?? []}
        value={filters.location}
        onChange={(location) => onChange({ location })}
        disabled={disabled}
      />
      {disabled && (
        <span role="status" className="flex items-center gap-1 text-xs text-muted-foreground">
          <LoaderIcon aria-hidden="true" className="size-3.5 animate-spin" />
          Loading filters…
        </span>
      )}
    </div>
  );
}

export function SearchFiltersStacked({ filters, facets, onChange }: SearchFiltersProps) {
  const disabled = facets === undefined;

  return (
    <div className="flex flex-col gap-4">
      <Separator />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Skills</span>
        <SkillFilter
          facets={facets?.skills ?? []}
          selected={filters.skills}
          onChange={(skills) => onChange({ skills })}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Job title</span>
        <JobTitleFilter
          facets={facets?.jobTitles ?? []}
          value={filters.jobTitle}
          onChange={(jobTitle) => onChange({ jobTitle })}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Location</span>
        <LocationFilter
          facets={facets?.locations ?? []}
          value={filters.location}
          onChange={(location) => onChange({ location })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
