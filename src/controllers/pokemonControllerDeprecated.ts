// src/controllers/pokemonController.ts
import { Request, Response } from 'express';
import { pokemonService } from '../services/pokemonService.js';
import {
  ApiResponse,
  PokemonSummary,
  PaginatedResponse,
  PokemonNotFoundError,
  ApiConnectionError,
  POKEMON_CONSTANTS,
  SearchParams
} from '../types/pokemon.js';

/**
 * Utilidad para crear respuestas consistentes
 */
const createResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> => ({
  success,
  data,
  message,
  error,
});

/**
 * Utilidad para manejar errores de manera consistente
 */
const handleError = (res: Response, error: unknown): void => {
  console.error('❌ Controller Error:', error);

  if (error instanceof PokemonNotFoundError) {
    res.status(404).json(createResponse(false, undefined, undefined, error.message));
    return;
  }

  if (error instanceof ApiConnectionError) {
    res.status(503).json(createResponse(false, undefined, undefined, 'Service temporarily unavailable'));
    return;
  }

  if (error instanceof Error) {
    res.status(400).json(createResponse(false, undefined, undefined, error.message));
    return;
  }

  res.status(500).json(createResponse(false, undefined, undefined, 'Internal server error'));
};

/**
 * Validar parámetros de paginación
 */
const validatePagination = (page?: string, limit?: string) => {
  const parsedPage = page ? parseInt(page, 10) : 1;
  const parsedLimit = limit ? parseInt(limit, 10) : POKEMON_CONSTANTS.DEFAULT_PAGE_SIZE;

  if (isNaN(parsedPage) || parsedPage < 1) {
    throw new Error('Page must be a positive integer');
  }

  if (isNaN(parsedLimit) || parsedLimit < 1) {
    throw new Error('Limit must be a positive integer');
  }

  if (parsedLimit > POKEMON_CONSTANTS.MAX_PAGE_SIZE) {
    throw new Error(`Limit cannot exceed ${POKEMON_CONSTANTS.MAX_PAGE_SIZE}`);
  }

  return { page: parsedPage, limit: parsedLimit };
};

export class PokemonController {
  /**
   * GET /api/pokemon/:identifier
   * Obtener un Pokemon específico por ID o nombre
   */
  async getPokemon(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.params;

      if (!identifier) {
        res.status(400).json(createResponse(false, undefined, undefined, 'Pokemon identifier is required'));
        return;
      }

      console.log(`🎯 Getting Pokemon: ${identifier}`);
      const pokemon = await pokemonService.getPokemon(identifier);

      res.status(200).json(createResponse(
        true,
        pokemon,
        `Pokemon ${pokemon.name} retrieved successfully`
      ));
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * GET /api/pokemon
   * Obtener lista paginada de Pokemon
   */
  async getPokemonList(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = validatePagination(
        req.query.page as string,
        req.query.limit as string
      );

      console.log(`📋 Getting Pokemon list - Page: ${page}, Limit: ${limit}`);
      
      const pokemonList: PaginatedResponse<PokemonSummary> = await pokemonService.getPokemonList(page, limit);

      res.status(200).json(createResponse(
        true,
        pokemonList,
        `Retrieved ${pokemonList.data.length} Pokemon successfully`
      ));
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * GET /api/pokemon/search
   * Buscar Pokemon por nombre o tipo
   */
  async searchPokemon(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, limit } = req.query;

      // Validar parámetros de búsqueda
      if (!name && !type) {
        res.status(400).json(createResponse(
          false,
          undefined,
          undefined,
          'Search requires either "name" or "type" parameter'
        ));
        return;
      }

      const searchParams: SearchParams = {
        name: name as string,
        type: type as string,
        limit: limit ? parseInt(limit as string, 10) : 20,
      };

      // Validar límite
      if (searchParams.limit && (isNaN(searchParams.limit) || searchParams.limit < 1)) {
        res.status(400).json(createResponse(
          false,
          undefined,
          undefined,
          'Limit must be a positive integer'
        ));
        return;
      }

      console.log(`🔍 Searching Pokemon:`, searchParams);
      const results = await pokemonService.searchPokemon(searchParams);

      res.status(200).json(createResponse(
        true,
        results,
        `Found ${results.length} Pokemon matching your search`
      ));
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * GET /api/pokemon/random
   * Obtener un Pokemon aleatorio
   */
  async getRandomPokemon(req: Request, res: Response): Promise<void> {
    try {
      console.log('🎲 Getting random Pokemon');
      const randomPokemon = await pokemonService.getRandomPokemon();

      res.status(200).json(createResponse(
        true,
        randomPokemon,
        `Random Pokemon ${randomPokemon.name} retrieved successfully`
      ));
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * GET /api/pokemon/:identifier/exists
   * Verificar si un Pokemon existe
   */
  async pokemonExists(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.params;

      if (!identifier) {
        res.status(400).json(createResponse(false, undefined, undefined, 'Pokemon identifier is required'));
        return;
      }

      console.log(`🔍 Checking if Pokemon exists: ${identifier}`);
      const exists = await pokemonService.pokemonExists(identifier);

      res.status(200).json(createResponse(
        true,
        { exists, identifier },
        exists ? `Pokemon ${identifier} exists` : `Pokemon ${identifier} not found`
      ));
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * DELETE /api/cache
   * Limpiar cache (útil para desarrollo)
   */
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      console.log('🗑️ Clearing cache');
      pokemonService.clearCache();

      res.status(200).json(createResponse(
        true,
        undefined,
        'Cache cleared successfully'
      ));
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * GET /api/cache/stats
   * Obtener estadísticas del cache
   */
  async getCacheStats(req: Request, res: Response): Promise<void> {
    try {
      console.log('📊 Getting cache stats');
      const stats = pokemonService.getCacheStats();

      res.status(200).json(createResponse(
        true,
        stats,
        'Cache statistics retrieved successfully'
      ));
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * GET /api/pokemon/types/:type
   * Obtener Pokemon por tipo específico
   */
  async getPokemonByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const { limit } = req.query;

      if (!type) {
        res.status(400).json(createResponse(false, undefined, undefined, 'Pokemon type is required'));
        return;
      }

      const searchLimit = limit ? parseInt(limit as string, 10) : 20;

      if (isNaN(searchLimit) || searchLimit < 1) {
        res.status(400).json(createResponse(
          false,
          undefined,
          undefined,
          'Limit must be a positive integer'
        ));
        return;
      }

      console.log(`🏷️ Getting Pokemon by type: ${type}`);
      const results = await pokemonService.searchPokemon({ type, limit: searchLimit });

      res.status(200).json(createResponse(
        true,
        results,
        `Found ${results.length} Pokemon of type ${type}`
      ));
    } catch (error) {
      handleError(res, error);
    }
  }
}

// Exportar instancia para usar en las rutas
export const pokemonController = new PokemonController();