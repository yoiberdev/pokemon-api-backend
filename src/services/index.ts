import { PokeApiClient } from './external/pokeApiClient.js';
import { PokemonCache } from './pokemon/pokemonCache.js';
import { PokemonValidationService } from './pokemon/pokemonValidation.js';
import { PokemonService } from './pokemon/pokemonService.js';

// Factory pattern para crear instancia singleton
class ServiceFactory {
  private static pokemonServiceInstance: PokemonService;

  static getPokemonService(): PokemonService {
    if (!this.pokemonServiceInstance) {
      const apiClient = new PokeApiClient();
      const cache = new PokemonCache();
      const validator = new PokemonValidationService();
      
      this.pokemonServiceInstance = new PokemonService(apiClient, cache, validator);
    }
    
    return this.pokemonServiceInstance;
  }
}

export const pokemonService = ServiceFactory.getPokemonService();
