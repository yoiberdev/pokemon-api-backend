import { Request, Response } from "express";
import { pokemonService } from "../services/pokemonService";
import { ApiConnectionError, ApiResponse, POKEMON_CONSTANTS, PokemonNotFoundError } from "../types/pokemon";

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

const handleError = (res: Response, error: unknown): void => {
  console.error('Controller Error:', error);

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

    // Get para obtener pokemon por ID
    async getPokemon(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if(!id) {
                res.status(400).json(createResponse(false, undefined, undefined, 'Pokemon ID is required'));
                return;
            }

            console.log("Pokemon desde controller:", id);

            const pokemon = await pokemonService.getPokemon(id);
            res.json(pokemon);
        } catch (e) {
            console.log(e);
        }
    }
}

export const pokemonController = new PokemonController();