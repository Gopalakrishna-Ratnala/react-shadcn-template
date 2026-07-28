export interface ProductFiltersState {
  searchTerm: string;
}

export interface ProductFiltersActions {
  setSearchTerm: (searchTerm: string) => void;
  clearSearchTerm: () => void;
}

export type ProductFiltersStore = ProductFiltersState & ProductFiltersActions;
