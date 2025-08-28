import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { ApiConfig } from '../../config/index.js';
import { ApiConnectionError, PokemonNotFoundError } from '../../types/index.js';
import type { Pokemon, PokemonListResponse } from '../../types/index.js';

export class PokeApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ApiConfig.pokeApi.baseUrl,
      timeout: ApiConfig.pokeApi.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use((config) => {
      console.log(`Llamada a PokeAPI: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('PokeAPI Error:', error.message);
        
        if (error.response?.status === 404) {
          throw new PokemonNotFoundError('Pokemon not found');
        }
        
        if (!error.response) {
          throw new ApiConnectionError('Network error - Ha ocurrido un error al conectar con PokeAPI');
        }
        
        throw new ApiConnectionError(`HTTP ${error.response.status}: ${error.message}`);
      }
    );
  }

  async getPokemon(identifier: string | number): Promise<Pokemon> {
    const response = await this.client.get<Pokemon>(`/pokemon/${identifier}`);
    return response.data;
  }

  async getPokemonList(limit: number, offset: number): Promise<PokemonListResponse> {
    const response = await this.client.get<PokemonListResponse>(
      `/pokemon?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }

  async getTypePokemons(type: string): Promise<any> {
    const response = await this.client.get(`/type/${type.toLowerCase()}`);
    return response.data;
  }
}