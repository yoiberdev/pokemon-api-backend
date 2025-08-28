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
      errors.push('el nombre debe tener entre 2 y 50 caracteres');
    }
    
    if (params.type && params.type.length < 2) {
      errors.push('el tipo debe tener al menos 2 caracteres');
    }
    
    if (params.limit && (params.limit < 1 || params.limit > POKEMON_CONSTANTS.MAX_PAGE_SIZE)) {
      errors.push(`el límite debe estar entre 1 y ${POKEMON_CONSTANTS.MAX_PAGE_SIZE}`);
    }
    
    return errors;
  }
}
