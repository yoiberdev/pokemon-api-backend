export interface SearchParams {
  name?: string;
  type?: string;
  limit?: number;
}

export interface PokemonFilters {
  type?: string;
  page: number;
  limit: number;
  searchTerm?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}