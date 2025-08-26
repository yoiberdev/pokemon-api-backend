// src/services/pokemonService.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import NodeCache from 'node-cache';
import {
  Pokemon,
  PokemonSummary,
  PokemonListResponse,
  PaginatedResponse,
  PokemonNotFoundError,
  ApiConnectionError,
  POKEMON_CONSTANTS,
  PokemonIdentifier,
  SearchParams
} from '../types/pokemon.js';

export class PokemonService {
  private apiClient: AxiosInstance;
  private cache: NodeCache;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';
    this.cache = new NodeCache({ 
      stdTTL: POKEMON_CONSTANTS.CACHE_TTL / 1000, // NodeCache usa segundos
      checkperiod: 600 // Limpia cache cada 10 minutos
    });

    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      timeout: POKEMON_CONSTANTS.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para logging (útil para debug)
    this.apiClient.interceptors.request.use((config) => {
      console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Interceptor para manejo de errores
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('❌ API Error:', error.message);
        
        if (error.response?.status === 404) {
          throw new PokemonNotFoundError('Pokemon not found');
        }
        
        if (!error.response) {
          throw new ApiConnectionError('Network error - Unable to reach PokeAPI');
        }
        
        throw new ApiConnectionError(`HTTP ${error.response.status}: ${error.message}`);
      }
    );
  }

  /**
   * Obtener un Pokemon por ID o nombre
   */
  async getPokemon(identifier: PokemonIdentifier): Promise<Pokemon> {
    const cacheKey = `pokemon-${identifier}`;
    
    // Intentar obtener del cache primero
    const cached = this.cache.get<Pokemon>(cacheKey);
    if (cached) {
      console.log(`💾 Cache hit for ${identifier}`);
      return cached;
    }

    try {
      console.log(`🌐 Fetching ${identifier} from API`);
      const response = await this.apiClient.get<Pokemon>(`/pokemon/${identifier}`);
      const pokemon = response.data;
      
      // Guardar en cache
      this.cache.set(cacheKey, pokemon);
      
      return pokemon;
    } catch (error) {
      if (error instanceof PokemonNotFoundError || error instanceof ApiConnectionError) {
        throw error;
      }
      throw new ApiConnectionError(`Failed to fetch Pokemon: ${error}`);
    }
  }

  /**
   * Obtener lista de Pokemon con paginación
   */
  async getPokemonList(page: number = 1, limit: number = POKEMON_CONSTANTS.DEFAULT_PAGE_SIZE): Promise<PaginatedResponse<PokemonSummary>> {
    // Validar límites
    if (limit > POKEMON_CONSTANTS.MAX_PAGE_SIZE) {
      limit = POKEMON_CONSTANTS.MAX_PAGE_SIZE;
    }
    
    const offset = (page - 1) * limit;
    const cacheKey = `pokemon-list-${page}-${limit}`;
    
    // Intentar obtener del cache
    const cached = this.cache.get<PaginatedResponse<PokemonSummary>>(cacheKey);
    if (cached) {
      console.log(`💾 Cache hit for list page ${page}`);
      return cached;
    }

    try {
      console.log(`🌐 Fetching Pokemon list page ${page} from API`);
      
      // Obtener la lista básica
      const listResponse = await this.apiClient.get<PokemonListResponse>(
        `/pokemon?limit=${limit}&offset=${offset}`
      );

      // Obtener detalles de cada Pokemon en paralelo (más rápido)
      const pokemonPromises = listResponse.data.results.map(async (pokemon) => {
        return this.getPokemonSummary(pokemon.name);
      });

      const pokemonData = await Promise.all(pokemonPromises);

      const result: PaginatedResponse<PokemonSummary> = {
        data: pokemonData,
        pagination: {
          page,
          limit,
          total: listResponse.data.count,
          totalPages: Math.ceil(listResponse.data.count / limit),
          hasNext: listResponse.data.next !== null,
          hasPrev: listResponse.data.previous !== null,
        },
      };

      // Guardar en cache
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      throw new ApiConnectionError(`Failed to fetch Pokemon list: ${error}`);
    }
  }

  /**
   * Buscar Pokemon por nombre
   */
  async searchPokemon(searchParams: SearchParams): Promise<PokemonSummary[]> {
    const { name, type, limit = 20 } = searchParams;
    
    if (!name && !type) {
      throw new Error('Search requires either name or type parameter');
    }

    const cacheKey = `pokemon-search-${name || ''}-${type || ''}-${limit}`;
    
    // Intentar obtener del cache
    const cached = this.cache.get<PokemonSummary[]>(cacheKey);
    if (cached) {
      console.log(`💾 Cache hit for search: ${name || type}`);
      return cached;
    }

    try {
      let results: PokemonSummary[] = [];

      if (name) {
        // Búsqueda por nombre exacto
        try {
          const pokemon = await this.getPokemon(name.toLowerCase());
          results = [this.transformToPokemonSummary(pokemon)];
        } catch (error) {
          // Si no encuentra por nombre exacto, buscar en lista general
          console.log(`🔍 Exact match not found for "${name}", searching in list...`);
          results = await this.searchInPokemonList(name, limit);
        }
      }

      if (type && results.length === 0) {
        // Búsqueda por tipo - esto es más complejo, por ahora buscar en lista
        results = await this.searchByType(type, limit);
      }

      // Guardar en cache
      this.cache.set(cacheKey, results);

      return results;
    } catch (error) {
      throw new ApiConnectionError(`Search failed: ${error}`);
    }
  }

  /**
   * Obtener resumen de un Pokemon (datos básicos para listas)
   */
  private async getPokemonSummary(identifier: PokemonIdentifier): Promise<PokemonSummary> {
    const pokemon = await this.getPokemon(identifier);
    return this.transformToPokemonSummary(pokemon);
  }

  /**
   * Transformar Pokemon completo a resumen
   */
  private transformToPokemonSummary(pokemon: Pokemon): PokemonSummary {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other?.['official-artwork']?.front_default || 
             pokemon.sprites.front_default || 
             '',
      types: pokemon.types.map(t => t.type.name),
    };
  }

  /**
   * Buscar Pokemon en la lista general por nombre parcial
   */
  private async searchInPokemonList(name: string, limit: number): Promise<PokemonSummary[]> {
    // Para búsqueda básica, obtener más Pokemon y filtrar
    // En producción esto sería más eficiente con un índice de búsqueda
    const searchLimit: number = Math.min(limit * 5, 100); // Buscar en más Pokemon
    const listResponse = await this.getPokemonList(1, searchLimit);
    
    return listResponse.data.filter(pokemon => 
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    ).slice(0, limit);
  }

  /**
   * Buscar Pokemon por tipo
   */
  private async searchByType(type: string, limit: number): Promise<PokemonSummary[]> {
    try {
      console.log(`🔍 Searching Pokemon by type: ${type}`);
      const response = await this.apiClient.get(`/type/${type.toLowerCase()}`);
      
      // Obtener los primeros Pokemon del tipo
      const pokemonList = response.data.pokemon.slice(0, limit);
      
      const pokemonPromises = pokemonList.map(async (entry: any) => {
        return this.getPokemonSummary(entry.pokemon.name);
      });

      return await Promise.all(pokemonPromises);
    } catch (error) {
      console.error(`Error searching by type ${type}:`, error);
      return [];
    }
  }

  /**
   * Limpiar cache (útil para desarrollo)
   */
  clearCache(): void {
    this.cache.flushAll();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Obtener estadísticas del cache
   */
  getCacheStats(): object {
    return this.cache.getStats();
  }

  /**
   * Verificar si un Pokemon existe
   */
  async pokemonExists(identifier: PokemonIdentifier): Promise<boolean> {
    try {
      await this.getPokemon(identifier);
      return true;
    } catch (error) {
      if (error instanceof PokemonNotFoundError) {
        return false;
      }
      throw error; // Re-lanzar otros errores
    }
  }

  /**
   * Obtener Pokemon aleatorio
   */
  async getRandomPokemon(): Promise<PokemonSummary> {
    const randomId = Math.floor(Math.random() * POKEMON_CONSTANTS.MAX_POKEMON_ID) + 1;
    const pokemon = await this.getPokemon(randomId);
    return this.transformToPokemonSummary(pokemon);
  }
}

// Exportar instancia singleton para usar en toda la app
export const pokemonService = new PokemonService();