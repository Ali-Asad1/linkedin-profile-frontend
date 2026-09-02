/**
 * Pure helpers to convert between URL query params and the canonical
 * search-filter state. These are the only places that know how the search
 * state is represented in the URL.
 */

export const DEFAULT_PAGE_SIZE = 20;
export const ALLOWED_PAGE_SIZES = [20, 40, 60] as const;

/** The canonical search state used across the app. */
export type SearchFilters = {
  q: string;
  skills: string[];
  jobTitle: string;
  location: string;
  page: number;
  limit: number;
};

export const DEFAULT_FILTERS: SearchFilters = {
  q: "",
  skills: [],
  jobTitle: "",
  location: "",
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
};

const POSITIVE_INT = /^\d+$/;

/**
 * URLSearchParams -> SearchFilters.
 * Invalid or missing values fall back to defaults.
 */
export function parseSearchParams(params: URLSearchParams): SearchFilters {
  const q = params.get("q")?.trim() ?? "";

  const skills = (params.get("skills") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const jobTitle = params.get("jobTitle")?.trim() ?? "";
  const location = params.get("location")?.trim() ?? "";

  const pageRaw = params.get("page");
  const page =
    pageRaw && POSITIVE_INT.test(pageRaw) && Number(pageRaw) > 0
      ? Number(pageRaw)
      : DEFAULT_FILTERS.page;

  const limitRaw = params.get("limit");
  const limit =
    limitRaw && POSITIVE_INT.test(limitRaw) && Number(limitRaw) > 0
      ? Number(limitRaw)
      : DEFAULT_FILTERS.limit;

  return { q, skills, jobTitle, location, page, limit };
}

/**
 * SearchFilters -> URLSearchParams.
 * Empty/default values are omitted so the default URL stays clean
 * (`/users/search` instead of `?q=&page=1`).
 */
export function serializeSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.skills.length > 0) params.set("skills", filters.skills.join(","));
  if (filters.jobTitle) params.set("jobTitle", filters.jobTitle);
  if (filters.location) params.set("location", filters.location);
  if (filters.page > DEFAULT_FILTERS.page) params.set("page", String(filters.page));
  if (filters.limit !== DEFAULT_FILTERS.limit) params.set("limit", String(filters.limit));

  return params;
}

/** Returns true when the state differs from the default (no filters, page 1). */
export function isDefaultFilters(filters: SearchFilters): boolean {
  return (
    !filters.q &&
    filters.skills.length === 0 &&
    !filters.jobTitle &&
    !filters.location &&
    filters.page === DEFAULT_FILTERS.page &&
    filters.limit === DEFAULT_FILTERS.limit
  );
}

/**
 * Merges partial filter changes into a full SearchFilters state.
 * Changes to q/skills/jobTitle/location always reset the page to 1;
 * `resetPage: false` keeps the current page (used for pagination itself).
 */
export function withFilters(
  current: SearchFilters,
  changes: Partial<Omit<SearchFilters, "page">> & { page?: number },
  options: { resetPage?: boolean } = {},
): SearchFilters {
  const { resetPage = true, ...rest } = options;
  const changesResetPage =
    changes.q !== undefined ||
    changes.skills !== undefined ||
    changes.jobTitle !== undefined ||
    changes.location !== undefined;

  const next: SearchFilters = {
    q: changes.q ?? current.q,
    skills: changes.skills ?? current.skills,
    jobTitle: changes.jobTitle ?? current.jobTitle,
    location: changes.location ?? current.location,
    page: changes.page ?? (resetPage || changesResetPage ? DEFAULT_FILTERS.page : current.page),
    limit: changes.limit ?? current.limit,
  };

  if (next.page < 1) next.page = DEFAULT_FILTERS.page;
  return next;
}
