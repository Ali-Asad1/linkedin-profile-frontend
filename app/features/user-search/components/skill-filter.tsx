import { SlidersHorizontalIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { Facet } from "../types/search.types";

const MAX_OPTIONS = 50;

type SkillFilterProps = {
  facets: Facet[];
  selected: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
};

/**
 * Multi-select skills filter populated from the API facets.
 * URL state is the source of truth for the selection; facets only provide
 * the available options (and counts).
 */
export function SkillFilter({ facets, selected, onChange, disabled }: SkillFilterProps) {
  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const facetOptions = facets.filter((facet) => !selected.includes(facet.value));
    const queryLower = query.trim().toLowerCase();
    const filtered = queryLower
      ? facetOptions.filter((facet) => facet.value.toLowerCase().includes(queryLower))
      : facetOptions;
    const selectedFacets = facets.filter((facet) => selected.includes(facet.value));
    const missingSelected = selected
      .filter((value) => !facets.some((facet) => facet.value === value))
      .map((value) => ({ value, count: 0 }));

    return [...missingSelected, ...selectedFacets, ...filtered].slice(0, MAX_OPTIONS);
  }, [facets, selected, query]);

  function toggleSkill(skill: string, checked: boolean) {
    onChange(checked ? [...selected, skill] : selected.filter((s) => s !== skill));
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" role="combobox" aria-expanded={false} disabled={disabled}>
            <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
            Skills
            {selected.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selected.length}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent className="p-0" aria-label="Filter by skills">
        <div className="border-b p-2">
          <Label htmlFor="skill-filter-search" className="sr-only">
            Search skills
          </Label>
          <Input
            id="skill-filter-search"
            placeholder="Search skills..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1" role="listbox" aria-label="Available skills">
          {options.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No skills found
            </p>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => toggleSkill(option.value, checked === true)}
                    />
                    {option.value}
                  </span>
                  {option.count > 0 && (
                    <span className="text-xs text-muted-foreground">{option.count}</span>
                  )}
                </label>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
