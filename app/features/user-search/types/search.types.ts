/** Parameters accepted by GET /api/v1/users/search. */
export type UserSearchParams = {
  q?: string;
  skills?: string[];
  jobTitle?: string;
  location?: string;
  page: number;
  limit: number;
};

export type Experience = {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
};

export type Education = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: number;
  endDate: number;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string;
  locationName: string;
  locationCountry: string;
  industry: string;
  currentCompanyName: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
};

export type Facet = {
  value: string;
  count: number;
};

export type SearchFacets = {
  skills: Facet[];
  jobTitles: Facet[];
  locations: Facet[];
};

export type SearchMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UserSearchResponse = {
  data: User[];
  meta: SearchMeta;
  facets: SearchFacets;
};
