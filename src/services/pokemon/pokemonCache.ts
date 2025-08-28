import { CacheManager, type CacheKey } from '../../utils/cache/cache.js';
import { ApiConfig } from '../../config/index.js';
import type { Pokemon, PokemonSummary } from '../../types/index.js';

export class PokemonCache {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager(
      ApiConfig.cache.ttl / 1000, 
      ApiConfig.cache.checkPeriod
    );
  }

  getPokemon(identifier: string | number): Pokemon | undefined {
    const cacheKey: CacheKey = `pokemon-${identifier}`;
    return this.cache.get<Pokemon>(cacheKey);
  }

  setPokemon(identifier: string | number, pokemon: Pokemon): void {
    const cacheKey: CacheKey = `pokemon-${identifier}`;
    this.cache.set(cacheKey, pokemon);
  }

  getPokemonList(page: number, limit: number): PokemonSummary[] | undefined {
    const cacheKey: CacheKey = `pokemon-list-${page}-${limit}`;
    return this.cache.get<PokemonSummary[]>(cacheKey);
  }

  setPokemonList(page: number, limit: number, pokemon: PokemonSummary[]): void {
    const cacheKey: CacheKey = `pokemon-list-${page}-${limit}`;
    this.cache.set(cacheKey, pokemon);
  }

  getSearchResults(searchKey: string): PokemonSummary[] | undefined {
    const cacheKey: CacheKey = `pokemon-search-${searchKey}`;
    return this.cache.get<PokemonSummary[]>(cacheKey);
  }

  setSearchResults(searchKey: string, results: PokemonSummary[]): void {
    const cacheKey: CacheKey = `pokemon-search-${searchKey}`;
    this.cache.set(cacheKey, results);
  }

  clear(): void {
    this.cache.flush();
    console.log('🗑️ Cache cleared');
  }

  getStats(): object {
    return this.cache.getStats();
  }
}