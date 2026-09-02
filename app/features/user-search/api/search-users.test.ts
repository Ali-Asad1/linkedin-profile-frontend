import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "~/lib/api/axios";

import { buildSearchQuery, searchUsers } from "./search-users";

const getMock = vi.hoisted(() => vi.fn());

vi.mock("~/lib/api/axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~/lib/api/axios")>();
  return {
    ...actual,
    axiosInstance: { get: getMock },
  };
});

const sampleResponse = {
  data: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  facets: { skills: [], jobTitles: [], locations: [] },
};

function axiosError(status: number): AxiosError {
  const response = {
    status,
    statusText: "Error",
    headers: {},
    config: { headers: new AxiosHeaders() },
  } as AxiosResponse;
  return new AxiosError("Request failed", status >= 500 ? "ERR_BAD_RESPONSE" : "ERR_BAD_REQUEST", undefined, undefined, response);
}

describe("buildSearchQuery", () => {
  it("always includes page and limit", () => {
    expect(buildSearchQuery({ page: 1, limit: 20 })).toEqual({ page: "1", limit: "20" });
  });

  it("joins skills with commas", () => {
    const query = buildSearchQuery({ page: 1, limit: 20, skills: ["React", "TypeScript"] });
    expect(query.skills).toBe("React,TypeScript");
  });

  it("never sends empty filters", () => {
    const query = buildSearchQuery({
      page: 1,
      limit: 20,
      q: "",
      skills: [],
      jobTitle: "",
      location: "",
    });
    expect(query).toEqual({ page: "1", limit: "20" });
  });
});

describe("searchUsers", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("returns the parsed response body", async () => {
    getMock.mockResolvedValueOnce({ data: sampleResponse });
    const result = await searchUsers({ page: 2, limit: 20, q: "react" });
    expect(result).toEqual(sampleResponse);
    expect(getMock).toHaveBeenCalledWith(
      "/api/v1/users/search",
      expect.objectContaining({
        params: { page: "2", limit: "20", q: "react" },
      }),
    );
  });

  it("propagates the abort signal", async () => {
    getMock.mockResolvedValueOnce({ data: sampleResponse });
    const controller = new AbortController();
    await searchUsers({ page: 1, limit: 20 }, { signal: controller.signal });
    expect(getMock).toHaveBeenCalledWith(
      "/api/v1/users/search",
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it("normalizes a 400 error into a validation ApiError", async () => {
    getMock.mockRejectedValueOnce(axiosError(400));
    const error = await searchUsers({ page: 1, limit: 20 }).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe("validation");
    expect(error.status).toBe(400);
  });

  it("normalizes a 503 error into an unavailable ApiError", async () => {
    getMock.mockRejectedValueOnce(axiosError(503));
    const error = await searchUsers({ page: 1, limit: 20 }).catch((e) => e);
    expect(error.kind).toBe("unavailable");
  });

  it("normalizes network errors (no response) into a network ApiError", async () => {
    getMock.mockRejectedValueOnce(new AxiosError("Network Error", "ERR_NETWORK"));
    const error = await searchUsers({ page: 1, limit: 20 }).catch((e) => e);
    expect(error.kind).toBe("network");
  });

  it("does not expose raw axios internals in the message", async () => {
    getMock.mockRejectedValueOnce(axiosError(500));
    const error = await searchUsers({ page: 1, limit: 20 }).catch((e) => e);
    expect(error.message).not.toMatch(/ERR_|ECONNREFUSED|AxiosError/);
  });
});
