// Tipos base
export interface ApiResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiResource[];
}

// Pokemon individual
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: ApiResource;
}

export interface PokemonAbility {
  ability: ApiResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: ApiResource;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  species: ApiResource;
}

// Pokemon response API propia
export interface PokemonSummary {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para búsquedas
export interface SearchParams {
  name?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface PokemonFilters {
  type?: string;
  generation?: number;
  minId?: number;
  maxId?: number;
}

// Tipos para colores de pokemon
export type PokemonTypeColor = {
  [key: string]: string;
};

export const TYPE_COLORS: PokemonTypeColor = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Tipos para errores
export class PokemonNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`Pokemon with identifier "${identifier}" not found`);
    this.name = 'PokemonNotFoundError';
  }
}

export class ApiConnectionError extends Error {
  constructor(message: string) {
    super(`API Connection Error: ${message}`);
    this.name = 'ApiConnectionError';
  }
}

// Cache
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
}

export type CacheKey = 
  | `pokemon-${number}` 
  | `pokemon-list-${number}-${number}` 
  | `pokemon-search-${string}`;

// Configuración del servicio Pokemon
export interface PokemonServiceConfig {
  baseUrl: string;
  timeout: number;
  cacheEnabled: boolean;
  cacheTtl: number;
}

// Tipos genéricos
export type PokemonId = number;
export type PokemonName = string;
export type PokemonIdentifier = PokemonId | PokemonName;

// Para validar si un string es un tipo válido de Pokemon
export type ValidPokemonType = keyof typeof TYPE_COLORS;

// Helper type para extraer solo las propiedades necesarias
export type SimplePokemon = Pick<Pokemon, 'id' | 'name' | 'sprites' | 'types'>;

// Constantes útiles
export const POKEMON_CONSTANTS = {
  MAX_POKEMON_ID: 1025, // Actualizar según la generación actual
  MIN_POKEMON_ID: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  API_TIMEOUT: 10000, // 10 segundos
} as const;

// Tipos para configuración
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
}
