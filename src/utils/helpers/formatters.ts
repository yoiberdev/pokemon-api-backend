export class PokemonFormatters {
  static formatPokemonId(id: number): string {
    return `#${id.toString().padStart(3, '0')}`;
  }

  static formatPokemonName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  static formatPokemonHeight(heightInDecimeters: number): string {
    const meters = heightInDecimeters / 10;
    return `${meters.toFixed(1)}m`;
  }

  static formatPokemonWeight(weightInHectograms: number): string {
    const kilograms = weightInHectograms / 10;
    return `${kilograms.toFixed(1)}kg`;
  }

  static createSearchKey(name?: string, type?: string, limit?: number): string {
    return `${name || ''}-${type || ''}-${limit || 20}`;
  }
}