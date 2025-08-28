export class PokemonNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`Pokemon with identifier "${identifier}" not found`);
    this.name = 'PokemonNotFoundError';
  }
}

export class PokemonValidationError extends Error {
  constructor(message: string, public readonly validationErrors: string[]) {
    super(message);
    this.name = 'PokemonValidationError';
  }
}