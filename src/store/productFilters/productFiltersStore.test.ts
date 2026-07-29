import { afterEach, describe, expect, it } from "vitest";

import { useProductFiltersStore } from "./productFiltersStore";

const INITIAL_STATE = useProductFiltersStore.getState();

describe("useProductFiltersStore", () => {
  afterEach(() => {
    useProductFiltersStore.setState(INITIAL_STATE, true);
  });

  it("has an empty searchTerm initially", () => {
    expect(useProductFiltersStore.getState().searchTerm).toBe("");
  });

  it("setSearchTerm updates searchTerm", () => {
    useProductFiltersStore.getState().setSearchTerm("desk lamp");
    expect(useProductFiltersStore.getState().searchTerm).toBe("desk lamp");
  });
});
