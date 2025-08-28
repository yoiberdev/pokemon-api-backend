import { Router } from 'express';
import { pokemonController } from '../controllers/pokemonController.js';
import { cacheController } from '../controllers/cacheController.js';

const router = Router();

// ==========================================
// RUTAS PRINCIPALES
// ==========================================

/**
 * GET /api/pokemon
 * Lista paginada de Pokemon
 * Query params: ?page=1&limit=20
 */
router.get('/', pokemonController.getPokemonList.bind(pokemonController));

/**
 * GET /api/pokemon/search
 * Buscar Pokemon por nombre o tipo
 * Query params: ?name=pikachu o ?type=electric&limit=10
 */
router.get('/search', pokemonController.searchPokemon.bind(pokemonController));

/**
 * GET /api/pokemon/random
 * Obtener un Pokemon aleatorio
 */
router.get('/random', pokemonController.getRandomPokemon.bind(pokemonController));

/**
 * GET /api/pokemon/types/:type
 * Obtener Pokemon por tipo específico
 */
router.get('/types/:type', pokemonController.getPokemonByType.bind(pokemonController));

/**
 * GET /api/pokemon/:identifier
 * Obtener Pokemon específico por ID o nombre
 */
router.get('/:identifier', pokemonController.getPokemon.bind(pokemonController));

/**
 * GET /api/pokemon/:identifier/exists
 * Verificar si un Pokemon existe
 */
router.get('/:identifier/exists', pokemonController.pokemonExists.bind(pokemonController));

// ==========================================
// RUTAS DE CACHE
// ==========================================

/**
 * DELETE /api/pokemon/cache
 * Limpiar cache del servicio
 */
router.delete('/cache', cacheController.clearCache.bind(cacheController));

/**
 * GET /api/pokemon/cache/stats
 * Obtener estadísticas del cache
 */
router.get('/cache/stats', cacheController.getCacheStats.bind(cacheController));

export default router;