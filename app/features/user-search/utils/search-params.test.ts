import { describe, expect, it } from "vitest";

import {
  DEFAULT_FILTERS,
  isDefaultFilters,
  parseSearchParams,
  serializeSearchParams,
  withFilters,
} from "./search-params";

function parse(query: string) {
  return parseSearchParams(new URLSearchParams(query));
}

function serialize(filters: Partial<typeof DEFAULT_FILTERS>) {
  const params = serializeSearchParams({ ...DEFAULT_FILTERS, ...filters });
  return params.toString();
}

describe("parseSearchParams", () => {
  it("returns defaults for an empty URL", () => {
    expect(parse("")).toEqual(DEFAULT_FILTERS);
  });

  it("parses a keyword", () => {
    expect(parse("q=frontend").q).toBe("frontend");
  });

  it("parses a single skill", () => {
    expect(parse("skills=React").skills).toEqual(["React"]);
  });

  it("parses multiple skills", () => {
    expect(parse("skills=React,TypeScript").skills).toEqual(["React", "TypeScript"]);
  });

  it("drops empty skill entries", () => {
    expect(parse("skills=React,,TypeScript,").skills).toEqual(["React", "TypeScript"]);
  });

  it("parses job title and location with encoding", () => {
    const filters = parse("jobTitle=Frontend%20Developer&location=Tehran");
    expect(filters.jobTitle).toBe("Frontend Developer");
    expect(filters.location).toBe("Tehran");
  });

  it("parses pagination values", () => {
    const filters = parse("page=3&limit=40");
    expect(filters.page).toBe(3);
    expect(filters.limit).toBe(40);
  });

  it("falls back to defaults for invalid pagination values", () => {
    expect(parse("page=abc").page).toBe(1);
    expect(parse("page=-1").page).toBe(1);
    expect(parse("limit=0").limit).toBe(DEFAULT_FILTERS.limit);
  });

  it("parses combined filters", () => {
    const filters = parse("q=react&skills=TypeScript&jobTitle=Frontend%20Developer&location=Tehran&page=2");
    expect(filters).toEqual({
      q: "react",
      skills: ["TypeScript"],
      jobTitle: "Frontend Developer",
      location: "Tehran",
      page: 2,
      limit: 20,
    });
  });
});

describe("serializeSearchParams", () => {
  it("produces an empty query string for default state", () => {
    expect(serialize({})).toBe("");
  });

  it("serializes a keyword", () => {
    expect(serialize({ q: "frontend" })).toBe("q=frontend");
  });

  it("serializes multiple skills joined with commas", () => {
    expect(serialize({ skills: ["React", "TypeScript"] })).toBe("skills=React%2CTypeScript");
  });

  it("never serializes an empty skills array", () => {
    expect(serialize({ skills: [] })).toBe("");
  });

  it("omits page=1 and the default limit", () => {
    expect(serialize({ page: 1, limit: 20 })).toBe("");
  });

  it("includes page only when above 1", () => {
    expect(serialize({ q: "react", page: 4 })).toBe("q=react&page=4");
  });

  it("round-trips parse -> serialize -> parse", () => {
    const original = "q=react&skills=React,TypeScript&jobTitle=Frontend Developer&location=Tehran&page=2&limit=40";
    const filters = parse(original.replace(" ", "%20"));
    const reparsed = parse(serializeSearchParams(filters).toString());
    expect(reparsed).toEqual(filters);
  });
});

describe("withFilters", () => {
  it("resets page to 1 when a filter changes", () => {
    const next = withFilters({ ...DEFAULT_FILTERS, page: 4 }, { skills: ["React"] });
    expect(next.page).toBe(1);
    expect(next.skills).toEqual(["React"]);
  });

  it("keeps the page when only pagination changes", () => {
    const next = withFilters({ ...DEFAULT_FILTERS, page: 2, q: "react" }, { page: 3 }, { resetPage: false });
    expect(next.page).toBe(3);
    expect(next.q).toBe("react");
  });

  it("clears all filters when asked", () => {
    const current = { q: "react", skills: ["React"], jobTitle: "Dev", location: "Tehran", page: 2, limit: 20 };
    const next = withFilters(current, { q: "", skills: [], jobTitle: "", location: "" });
    expect(next).toEqual(DEFAULT_FILTERS);
    expect(isDefaultFilters(next)).toBe(true);
  });

  it("clamps page to at least 1", () => {
    const next = withFilters(DEFAULT_FILTERS, { page: 0 }, { resetPage: false });
    expect(next.page).toBe(1);
  });
});
