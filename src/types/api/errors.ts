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
    super(`no se encontró el pokemon con identificador "${identifier}"`);
  }
}

export class ApiConnectionError extends BaseApiError {
  readonly statusCode = 503;
  readonly isOperational = true;
  
  constructor(message: string) {
    super(`error de conexión con la API: ${message}`);
  }
}

export class ValidationError extends BaseApiError {
  readonly statusCode = 400;
  readonly isOperational = true;
  
  constructor(message: string, public readonly validationErrors: string[]) {
    super(message);
  }
}

// al final
export { PokemonValidationError, RateLimitError, ServiceUnavailableError } from '../../utils';
