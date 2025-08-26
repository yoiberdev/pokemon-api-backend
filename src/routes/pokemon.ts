import { Request, Response, Router } from "express";
import { pokemonController, PokemonController } from "../controllers/pokemonController";


const routePokemon = Router();

routePokemon.get('/:id', (req: Request, res: Response) => pokemonController.getPokemon(req, res));

export default routePokemon;