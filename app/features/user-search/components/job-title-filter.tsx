import { BriefcaseIcon } from "lucide-react";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Facet } from "../types/search.types";

type JobTitleFilterProps = {
  facets: Facet[];
  value: string;
  onChange: (jobTitle: string) => void;
  disabled?: boolean;
};

const MAX_OPTIONS = 50;

export function JobTitleFilter({ facets, value, onChange, disabled }: JobTitleFilterProps) {
  const options = facets.slice(0, MAX_OPTIONS);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="job-title-filter" className="sr-only">
        Filter by job title
      </Label>
      <Select
        value={value || null}
        onValueChange={(nextValue) => onChange((nextValue as string | null) ?? "")}
        disabled={disabled}
      >
        <SelectTrigger id="job-title-filter" className="w-full sm:w-44">
          <BriefcaseIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Job title" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All job titles</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.value} ({option.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
