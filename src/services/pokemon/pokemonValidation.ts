import { PokemonValidators } from '../../utils';
import { PokemonValidationError } from '../../types/index.js';
import type { SearchParams, PokemonIdentifier } from '../../types/index.js';

export class PokemonValidationService {
  validateIdentifier(identifier: PokemonIdentifier): void {
    if (!PokemonValidators.validateIdentifier(identifier)) {
      throw new PokemonValidationError(
        'Identificador de pokemon no válido',
        ['Debe ser un número entre 1 y 1025 o un nombre']
      );
    }
  }

  validateSearchParams(params: SearchParams): void {
    const errors = PokemonValidators.validateSearchParams(params);
    
    if (errors.length > 0) {
      throw new PokemonValidationError('Parámetros de búsqueda no válidos', errors);
    }

    if (!params.name && !params.type) {
      throw new PokemonValidationError(
        'La búsqueda necesita al menos un dato',
        ['Debes poner un nombre o un tipo para buscar']
      );
    }
  }
}
