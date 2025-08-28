import { PokemonValidators } from '../../utils/validators/pokemonValidators.js';
import { PokemonValidationError } from '../../types/index.js';
import type { SearchParams, PokemonIdentifier } from '../../types/index.js';

export class PokemonValidationService {
  validateIdentifier(identifier: PokemonIdentifier): void {
    if (!PokemonValidators.validateIdentifier(identifier)) {
      throw new PokemonValidationError(
        'Invalid Pokemon identifier',
        ['Identifier must be a valid Pokemon ID (1-1025) or name']
      );
    }
  }

  validateSearchParams(params: SearchParams): void {
    const errors = PokemonValidators.validateSearchParams(params);
    
    if (errors.length > 0) {
      throw new PokemonValidationError('Invalid search parameters', errors);
    }

    if (!params.name && !params.type) {
      throw new PokemonValidationError(
        'Search requires parameters',
        ['Either name or type parameter is required']
      );
    }
  }
}