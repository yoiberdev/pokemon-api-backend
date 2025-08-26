// src/routes/pokemon.ts
import { Router } from 'express';
import { pokemonController } from '../controllers/pokemonController.js';

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
 * 
 * ⚠️ IMPORTANTE: Esta ruta DEBE ir ANTES de /:identifier
 * para evitar conflictos de routing
 */
router.get('/search', pokemonController.searchPokemon.bind(pokemonController));

/**
 * GET /api/pokemon/random
 * Obtener un Pokemon aleatorio
 * 
 * ⚠️ IMPORTANTE: También ANTES de /:identifier
 */
router.get('/random', pokemonController.getRandomPokemon.bind(pokemonController));

/**
 * GET /api/pokemon/types/:type
 * Obtener Pokemon por tipo específico
 * Params: type (electric, fire, water, etc.)
 * Query params: ?limit=10
 */
router.get('/types/:type', pokemonController.getPokemonByType.bind(pokemonController));

/**
 * GET /api/pokemon/:identifier
 * Obtener Pokemon específico por ID o nombre
 * Params: identifier (1, pikachu, etc.)
 * 
 * ⚠️ Esta ruta va AL FINAL porque es muy general
 */
router.get('/:identifier', pokemonController.getPokemon.bind(pokemonController));

/**
 * GET /api/pokemon/:identifier/exists
 * Verificar si un Pokemon existe
 * Params: identifier (1, pikachu, etc.)
 */
router.get('/:identifier/exists', pokemonController.pokemonExists.bind(pokemonController));

// ==========================================
// RUTAS DE UTILIDAD (DESARROLLO)
// ==========================================

/**
 * DELETE /api/pokemon/cache
 * Limpiar cache del servicio
 * Útil durante desarrollo
 */
router.delete('/cache', pokemonController.clearCache.bind(pokemonController));

/**
 * GET /api/pokemon/cache/stats
 * Obtener estadísticas del cache
 * Útil para monitoreo
 */
router.get('/cache/stats', pokemonController.getCacheStats.bind(pokemonController));

export default router;