// src/routes/pokemon.ts - VERSIÓN BÁSICA PARA DEBUG
import { Router } from 'express';
import { pokemonController } from '../controllers/pokemonController.js';

const router = Router();

// Solo las rutas esenciales primero
router.get('/', pokemonController.getPokemonList.bind(pokemonController));
router.get('/search', pokemonController.searchPokemon.bind(pokemonController));
router.get('/random', pokemonController.getRandomPokemon.bind(pokemonController));

// Ruta con parámetro AL FINAL
router.get('/:identifier', pokemonController.getPokemon.bind(pokemonController));

export default router;