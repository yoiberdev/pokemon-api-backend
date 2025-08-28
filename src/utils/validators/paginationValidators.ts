import { POKEMON_CONSTANTS } from '../constants/pokemonConstants.js';

export class PaginationValidators {
  static validatePage(page: unknown): number {
    const parsedPage = Number(page);
    return isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  }

  static validateLimit(limit: unknown): number {
    const parsedLimit = Number(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return POKEMON_CONSTANTS.DEFAULT_PAGE_SIZE;
    }
    return Math.min(parsedLimit, POKEMON_CONSTANTS.MAX_PAGE_SIZE);
  }

  static validatePaginationParams(page?: string, limit?: string) {
    return {
      page: this.validatePage(page),
      limit: this.validateLimit(limit)
    };
  }
}
