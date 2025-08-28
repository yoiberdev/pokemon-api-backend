export class ApiConnectionError extends Error {
  constructor(message: string) {
    super(`error de conexión con la API: ${message}`);
    this.name = 'ApiConnectionError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'se pasaron del límite de peticiones') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message: string = 'el servicio no está disponible por ahora') {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}
