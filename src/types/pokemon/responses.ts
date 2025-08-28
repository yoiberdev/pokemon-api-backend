import type { PaginatedResponse } from '../api/common.js';
import type { Pokemon, PokemonSummary } from './entities.js';

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export type GetPokemonListResponse = PaginatedResponse<PokemonSummary>;
export type GetPokemonResponse = Pokemon;
export type SearchPokemonResponse = PokemonSummary[];
export type GetRandomPokemonResponse = PokemonSummary;