import { FilterIcon, XIcon } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { SearchFilters } from "../utils/search-params";

type ActiveFiltersProps = {
  filters: SearchFilters;
  onChange: (changes: Partial<Omit<SearchFilters, "page">>) => void;
  onClear: () => void;
};

export function ActiveFilters({ filters, onChange, onClear }: ActiveFiltersProps) {
  const chips: { key: string; kind: "q" | "skill" | "jobTitle" | "location"; value: string }[] = [];

  if (filters.q) {
    chips.push({ key: "q", kind: "q", value: filters.q });
  }
  for (const skill of filters.skills) {
    chips.push({ key: `skill:${skill}`, kind: "skill", value: skill });
  }
  if (filters.jobTitle) {
    chips.push({ key: "jobTitle", kind: "jobTitle", value: filters.jobTitle });
  }
  if (filters.location) {
    chips.push({ key: "location", kind: "location", value: filters.location });
  }

  if (chips.length === 0) return null;

  function removeChip(chip: (typeof chips)[number]) {
    switch (chip.kind) {
      case "q":
        onChange({ q: "" });
        break;
      case "skill":
        onChange({ skills: filters.skills.filter((s) => s !== chip.value) });
        break;
      case "jobTitle":
        onChange({ jobTitle: "" });
        break;
      case "location":
        onChange({ location: "" });
        break;
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <FilterIcon aria-hidden="true" className="size-3.5" />
        Active filters:
      </span>
      {chips.map((chip) => (
        <Badge key={chip.key} variant="secondary" className="gap-1 pr-1">
          {chip.value}
          <button
            type="button"
            aria-label={`Remove filter ${chip.value}`}
            className="rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-ring/60"
            onClick={() => removeChip(chip)}
          >
            <XIcon aria-hidden="true" className="size-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onClear}>
        Clear all
      </Button>
    </div>
  );
}
