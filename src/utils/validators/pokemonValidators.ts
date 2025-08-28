import { POKEMON_CONSTANTS } from '../constants/pokemonConstants.js';
import type { PokemonIdentifier, SearchParams } from '../../types/index.js';

export class PokemonValidators {
  static validateIdentifier(identifier: PokemonIdentifier): boolean {
    if (typeof identifier === 'number') {
      return identifier >= POKEMON_CONSTANTS.MIN_POKEMON_ID && 
             identifier <= POKEMON_CONSTANTS.MAX_POKEMON_ID;
    }
    return typeof identifier === 'string' && identifier.length > 0;
  }

  static validateSearchParams(params: SearchParams): string[] {
    const errors: string[] = [];
    
    if (params.name && (params.name.length < 2 || params.name.length > 50)) {
      errors.push('Name must be between 2 and 50 characters');
    }
    
    if (params.type && params.type.length < 2) {
      errors.push('Type must be at least 2 characters');
    }
    
    if (params.limit && (params.limit < 1 || params.limit > POKEMON_CONSTANTS.MAX_PAGE_SIZE)) {
      errors.push(`Limit must be between 1 and ${POKEMON_CONSTANTS.MAX_PAGE_SIZE}`);
    }
    
    return errors;
  }
}