import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import type { ApiError } from "~/lib/api/axios";

type SearchErrorStateProps = {
  error: ApiError;
  onRetry: () => void;
};

export function SearchErrorState({ error, onRetry }: SearchErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 p-10 text-center"
    >
      <AlertTriangleIcon aria-hidden="true" className="size-10 text-destructive/70" />
      <div>
        <h3 className="text-base font-semibold">Something went wrong</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCwIcon aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}
