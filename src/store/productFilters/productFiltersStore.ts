import { create } from "zustand";

import type { ProductFiltersStore } from "./types";

export const useProductFiltersStore = create<ProductFiltersStore>((set) => ({
  searchTerm: "",
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },
}));
