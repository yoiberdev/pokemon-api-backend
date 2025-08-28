export interface GetPokemonListRequest {
  page: number;
  limit: number;
}

export interface GetPokemonRequest {
  identifier: PokemonIdentifier;
}

export interface SearchPokemonRequest {
  name?: string;
  type?: string;
  limit?: number;
}

export type PokemonId = number;
export type PokemonName = string;
export type PokemonIdentifier = PokemonId | PokemonName;