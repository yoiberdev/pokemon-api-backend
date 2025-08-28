import NodeCache from 'node-cache';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
}

export type CacheKey = 
  | `pokemon-${number}` 
  | `pokemon-${string}`
  | `pokemon-list-${number}-${number}` 
  | `pokemon-search-${string}`;

export class CacheManager {
  private cache: NodeCache;

  constructor(ttl: number = 300, checkPeriod: number = 600) {
    this.cache = new NodeCache({ 
      stdTTL: ttl,
      checkperiod: checkPeriod
    });
  }

  get<T>(key: CacheKey): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: CacheKey, value: T, ttl?: number): boolean {
    if (ttl !== undefined) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  has(key: CacheKey): boolean {
    return this.cache.has(key);
  }

  del(key: CacheKey): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }
}