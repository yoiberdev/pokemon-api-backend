import axios, { AxiosError, AxiosInstance } from "axios";
import NodeCache from "node-cache";
import { ApiConnectionError, Pokemon, POKEMON_CONSTANTS, PokemonIdentifier, PokemonNotFoundError } from "../types/pokemon";


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

    // Obtener pokemon por ID
    async getPokemon(id: PokemonIdentifier): Promise<Pokemon> {
        try {
            const response = await this.apiClient.get<Pokemon>(`/pokemon/${id}`);
            const pokemon = response.data;

            return pokemon;
        } catch (e) {
            if (e instanceof PokemonNotFoundError || e instanceof ApiConnectionError) {
                throw e;
            }
            throw new ApiConnectionError(`Error en la consulta: ${e}`);
        }
    }

}

export const pokemonService = new PokemonService();