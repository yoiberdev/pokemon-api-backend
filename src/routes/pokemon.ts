// src/routes/pokemon.ts
import { Router } from 'express';
import { pokemonController } from '../controllers/pokemonController.js';

const router = Router();

// IMPORTANTE: Las rutas más específicas van ANTES que las genéricas
// Rutas de búsqueda y acciones específicas primero
router.get('/search', pokemonController.searchPokemon.bind(pokemonController));
router.get('/random', pokemonController.getRandomPokemon.bind(pokemonController));
router.get('/cache/stats', pokemonController.getCacheStats.bind(pokemonController));
router.delete('/cache', pokemonController.clearCache.bind(pokemonController));

// Rutas con parámetros específicos
router.get('/types/:type', pokemonController.getPokemonByType.bind(pokemonController));
router.get('/:identifier/exists', pokemonController.pokemonExists.bind(pokemonController));

// Lista de Pokemon (ruta raíz)
router.get('/', pokemonController.getPokemonList.bind(pokemonController));

// Ruta con parámetro genérico AL FINAL
router.get('/:identifier', pokemonController.getPokemon.bind(pokemonController));

export default router;