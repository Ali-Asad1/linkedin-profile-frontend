import { MapPinIcon } from "lucide-react";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Facet } from "../types/search.types";

type LocationFilterProps = {
  facets: Facet[];
  value: string;
  onChange: (location: string) => void;
  disabled?: boolean;
};

const MAX_OPTIONS = 50;

export function LocationFilter({ facets, value, onChange, disabled }: LocationFilterProps) {
  const options = facets.slice(0, MAX_OPTIONS);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="location-filter" className="sr-only">
        Filter by location
      </Label>
      <Select
        value={value || null}
        onValueChange={(nextValue) => onChange((nextValue as string | null) ?? "")}
        disabled={disabled}
      >
        <SelectTrigger id="location-filter" className="w-full sm:w-44">
          <MapPinIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All locations</SelectItem>
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
