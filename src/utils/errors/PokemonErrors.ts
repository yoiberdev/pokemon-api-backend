export class PokemonNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`no se encontró el pokemon con identificador "${identifier}"`);
    this.name = 'PokemonNotFoundError';
  }
}

export class PokemonValidationError extends Error {
  constructor(message: string, public readonly validationErrors: string[]) {
    super(message);
    this.name = 'PokemonValidationError';
  }
}
