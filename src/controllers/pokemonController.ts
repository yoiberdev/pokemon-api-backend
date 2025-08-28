import { Request, Response } from 'express';
import { pokemonService } from '../services/index.js';
import { PaginationValidators } from '../utils';
import type { ApiResponse, SearchParams } from '../types/index.js';
import { PokemonValidationError, PokemonNotFoundError, ApiConnectionError } from '../types/index.js';

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

    if (error instanceof PokemonValidationError) {
        res.status(400).json(createResponse(false, undefined, undefined, error.message));
        return;
    }

    if (error instanceof ApiConnectionError) {
        res.status(503).json(createResponse(false, undefined, undefined, 'Service temporalmente no disponible'));
        return;
    }

    res.status(500).json(createResponse(false, undefined, undefined, 'Error interno del servidor'));
};

export class PokemonController {
    async getPokemon(req: Request, res: Response): Promise<void> {
        try {
            const { identifier } = req.params;

            if (!identifier) {
                res.status(400).json(createResponse(false, undefined, undefined, 'Pokemon identifier es requerido'));
                return;
            }

            console.log(`Identifier pokemon obtenido: ${identifier}`);
            const pokemon = await pokemonService.getPokemon(identifier);

            res.status(200).json(createResponse(
                true,
                pokemon,
                `Pokemon ${pokemon.name} recuperado con éxito`
            ));
        } catch (error) {
            handleError(res, error);
        }
    }

    async getPokemonList(req: Request, res: Response): Promise<void> {
        try {
            const { page, limit } = PaginationValidators.validatePaginationParams(
                req.query.page as string,
                req.query.limit as string
            );

            console.log(`Obteniendo lista de Pokemon - Página: ${page}, límite: ${limit}`);

            const pokemonList = await pokemonService.getPokemonList({ page, limit });

            res.status(200).json(createResponse(
                true,
                pokemonList,
                `Se han recuperado ${pokemonList.data.length} Pokemon con éxito`
            ));
        } catch (error) {
            handleError(res, error);
        }
    }

    async searchPokemon(req: Request, res: Response): Promise<void> {
        try {
            const { name, type, limit } = req.query;

            const searchParams: SearchParams = {
                name: name as string,
                type: type as string,
                limit: limit ? parseInt(limit as string, 10) : 20,
            };

            console.log(`Buscando Pokemon:`, searchParams);
            const results = await pokemonService.searchPokemon(searchParams);

            res.status(200).json(createResponse(
                true,
                results,
                `Se han encontrado ${results.length} Pokemon que coinciden con tu búsqueda`
            ));
        } catch (error) {
            handleError(res, error);
        }
    }

    async getRandomPokemon(req: Request, res: Response): Promise<void> {
        try {
            console.log('Obteniendo Pokemon aleatorio');
            const randomPokemon = await pokemonService.getRandomPokemon();

            res.status(200).json(createResponse(
                true,
                randomPokemon,
                `Se ha recuperado el Pokemon aleatorio ${randomPokemon.name} con éxito`
            ));
        } catch (error) {
            handleError(res, error);
        }
    }

    async pokemonExists(req: Request, res: Response): Promise<void> {
        try {
            const { identifier } = req.params;

            if (!identifier) {
                res.status(400).json(createResponse(false, undefined, undefined, 'Pokemon identifier es requerido'));
                return;
            }

            console.log(`Comprobando si existe el Pokemon: ${identifier}`);
            const exists = await pokemonService.pokemonExists(identifier);

            res.status(200).json(createResponse(
                true,
                { exists, identifier },
                exists ? `Pokemon ${identifier} existe` : `Pokemon ${identifier} no encontrado`
            ));
        } catch (error) {
            handleError(res, error);
        }
    }

    async getPokemonByType(req: Request, res: Response): Promise<void> {
        try {
            const { type } = req.params;
            const { limit } = req.query;

            if (!type) {
                res.status(400).json(createResponse(false, undefined, undefined, 'Pokemon type es requerido'));
                return;
            }

            const searchLimit = limit ? parseInt(limit as string, 10) : 20;

            console.log(`Obteniendo Pokemon por tipo: ${type}`);
            const results = await pokemonService.searchPokemon({ type, limit: searchLimit });

            res.status(200).json(createResponse(
                true,
                results,
                `Se han encontrado ${results.length} Pokemon de tipo ${type}`
            ));
        } catch (error) {
            handleError(res, error);
        }
    }
}

export const pokemonController = new PokemonController();
