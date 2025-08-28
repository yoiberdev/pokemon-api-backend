export abstract class BaseApiError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
  
  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class PokemonNotFoundError extends BaseApiError {
  readonly statusCode = 404;
  readonly isOperational = true;
  
  constructor(identifier: string | number) {
    super(`Pokemon with identifier "${identifier}" not found`);
  }
}

export class ApiConnectionError extends BaseApiError {
  readonly statusCode = 503;
  readonly isOperational = true;
  
  constructor(message: string) {
    super(`API Connection Error: ${message}`);
  }
}

export class ValidationError extends BaseApiError {
  readonly statusCode = 400;
  readonly isOperational = true;
  
  constructor(message: string, public readonly validationErrors: string[]) {
    super(message);
  }
}

// Agregar al final del archivo:
export { PokemonValidationError } from '../../utils/errors/PokemonErrors.js';
export { RateLimitError, ServiceUnavailableError } from '../../utils/errors/ApiErrors.js';