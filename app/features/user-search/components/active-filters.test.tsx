import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActiveFilters } from "./active-filters";
import { DEFAULT_FILTERS, type SearchFilters } from "../utils/search-params";

const filters: SearchFilters = {
  q: "react",
  skills: ["TypeScript", "Node.js"],
  jobTitle: "Frontend Developer",
  location: "Tehran",
  page: 2,
  limit: 20,
};

describe("ActiveFilters", () => {
  it("renders a chip for each active filter", () => {
    render(<ActiveFilters filters={filters} onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Tehran")).toBeInTheDocument();
  });

  it("removes an individual filter via its chip", async () => {
    const onChange = vi.fn();
    render(<ActiveFilters filters={filters} onChange={onChange} onClear={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove filter TypeScript" }));
    expect(onChange).toHaveBeenCalledWith({ skills: ["Node.js"] });
  });

  it("clears all filters", async () => {
    const onClear = vi.fn();
    render(
      <ActiveFilters
        filters={filters}
        onChange={vi.fn()}
        onClear={() => onClear()}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("renders nothing when there are no active filters", () => {
    const { container } = render(
      <ActiveFilters filters={DEFAULT_FILTERS} onChange={vi.fn()} onClear={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
