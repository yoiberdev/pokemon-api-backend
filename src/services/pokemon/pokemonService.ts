import { PokeApiClient } from '../external/pokeApiClient.js';
import { PokemonCache } from './pokemonCache.js';
import { PokemonValidationService } from './pokemonValidation.js';
import { POKEMON_CONSTANTS } from '../../utils';
import type {
  Pokemon,
  PokemonSummary,
  PokemonIdentifier,
  SearchParams,
  GetPokemonListRequest,
  PaginatedResponse
} from '../../types/index.js';

export class PokemonService {
  constructor(
    private apiClient: PokeApiClient,
    private cache: PokemonCache,
    private validator: PokemonValidationService
  ) {}

  async getPokemon(identifier: PokemonIdentifier): Promise<Pokemon> {
    this.validator.validateIdentifier(identifier);

    // Intentar obtener del cache
    const cached = this.cache.getPokemon(identifier);
    if (cached) {
      console.log(`cache encontrado para ${identifier}`);
      return cached;
    }

    console.log(`buscando ${identifier} en la API`);
    const pokemon = await this.apiClient.getPokemon(identifier);
    
    // Guardar en cache
    this.cache.setPokemon(identifier, pokemon);
    
    return pokemon;
  }

  async getPokemonList(request: GetPokemonListRequest): Promise<PaginatedResponse<PokemonSummary>> {
    const { page, limit } = request;
    const offset = (page - 1) * limit;
    
    // Intentar obtener del cache
    const cached = this.cache.getPokemonList(page, limit);
    if (cached) {
      console.log(`cache encontrado para lista pagina ${page}`);
      return this.buildPaginatedResponse(cached, page, limit, 1025);
    }

    console.log(`buscando lista de pokemon pagina ${page} en la API`);
    
    const listResponse = await this.apiClient.getPokemonList(limit, offset);

    // Obtener detalles de cada Pokemon en paralelo
    const pokemonPromises = listResponse.results.map(async (pokemon) => {
      return this.getPokemonSummary(pokemon.name);
    });

    const pokemonData = await Promise.all(pokemonPromises);

    // Guardar en cache
    this.cache.setPokemonList(page, limit, pokemonData);

    return this.buildPaginatedResponse(pokemonData, page, limit, listResponse.count);
  }

  async searchPokemon(searchParams: SearchParams): Promise<PokemonSummary[]> {
    this.validator.validateSearchParams(searchParams);

    const { name, type, limit = 20 } = searchParams;
    const searchKey = `${name || ''}-${type || ''}-${limit}`;
    
    // Intentar obtener del cache
    const cached = this.cache.getSearchResults(searchKey);
    if (cached) {
      console.log(`cache encontrado para busqueda: ${searchKey}`);
      return cached;
    }

    let results: PokemonSummary[] = [];

    if (name) {
      results = await this.searchByName(name, limit);
    } else if (type) {
      results = await this.searchByType(type, limit);
    }

    // Guardar en cache
    this.cache.setSearchResults(searchKey, results);

    return results;
  }

  async getRandomPokemon(): Promise<PokemonSummary> {
    const randomId = Math.floor(Math.random() * POKEMON_CONSTANTS.MAX_POKEMON_ID) + 1;
    const pokemon = await this.getPokemon(randomId);
    return this.transformToPokemonSummary(pokemon);
  }

  async pokemonExists(identifier: PokemonIdentifier): Promise<boolean> {
    try {
      await this.getPokemon(identifier);
      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): object {
    return this.cache.getStats();
  }

  // Métodos privados
  private async getPokemonSummary(identifier: PokemonIdentifier): Promise<PokemonSummary> {
    const pokemon = await this.getPokemon(identifier);
    return this.transformToPokemonSummary(pokemon);
  }

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

  private async searchByName(name: string, limit: number): Promise<PokemonSummary[]> {
    try {
      const pokemon = await this.getPokemon(name.toLowerCase());
      return [this.transformToPokemonSummary(pokemon)];
    } catch {
      console.log(`no se encontro exacto "${name}", buscando en la lista...`);
      return this.searchInPokemonList(name, limit);
    }
  }

  private async searchByType(type: string, limit: number): Promise<PokemonSummary[]> {
    try {
      console.log(`buscando pokemons por tipo: ${type}`);
      const response = await this.apiClient.getTypePokemons(type);
      
      const pokemonList = response.pokemon.slice(0, limit);
      
      const pokemonPromises = pokemonList.map(async (entry: any) => {
        return this.getPokemonSummary(entry.pokemon.name);
      });

      return await Promise.all(pokemonPromises);
    } catch (error) {
      console.error(`error buscando por tipo ${type}:`, error);
      return [];
    }
  }

  private async searchInPokemonList(name: string, limit: number): Promise<PokemonSummary[]> {
    const searchLimit = Math.min(limit * 5, 100);
    const listResponse = await this.getPokemonList({ page: 1, limit: searchLimit });
    
    return listResponse.data.filter(pokemon => 
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    ).slice(0, limit);
  }

  private buildPaginatedResponse<T>(
    data: T[], 
    page: number, 
    limit: number, 
    total: number
  ): PaginatedResponse<T> {
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }
}
