import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const DEBOUNCE_MS = 350;

type SearchBarProps = {
  value: string;
  onChange: (q: string) => void;
  isFetching?: boolean;
};

/**
 * Keyword search input with debounced URL updates.
 * Keeps a local value so typing is instant; only the debounced value
 * propagates to the URL (and therefore to the API).
 */
export function SearchBar({ value, onChange, isFetching = false }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  function handleChange(nextValue: string) {
    setInputValue(nextValue);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange(nextValue.trim());
    }, DEBOUNCE_MS);
  }

  function handleClear() {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setInputValue("");
    onChange("");
  }

  return (
    <div role="search" className="relative w-full">
      <label htmlFor="profile-search" className="sr-only">
        Search profiles by keyword, skills, companies or titles
      </label>
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id="profile-search"
        type="search"
        autoComplete="off"
        placeholder="Search people, skills, companies, titles..."
        className="h-11 rounded-lg pl-9 pr-24 text-base shadow-sm"
        value={inputValue}
        onChange={(event) => handleChange(event.target.value)}
        aria-busy={isFetching}
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {isFetching && (
          <span
            aria-label="Searching"
            role="status"
            className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
          />
        )}
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
