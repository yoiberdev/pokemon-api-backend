import { Request, Response } from 'express';
import { pokemonService } from '../services/index.js';
import type { ApiResponse } from '../types/index.js';

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

export class CacheController {
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      console.log('limpiando cache');
      pokemonService.clearCache();

      res.status(200).json(createResponse(
        true,
        undefined,
        'cache limpiada'
      ));
    } catch (error) {
      console.error('error en cache controller (clearCache):', error);
      res.status(500).json(createResponse(
        false,
        undefined,
        undefined,
        'no se pudo limpiar el cache'
      ));
    }
  }

  async getCacheStats(req: Request, res: Response): Promise<void> {
    try {
      console.log('obteniendo estadisticas de cache');
      const stats = pokemonService.getCacheStats();

      res.status(200).json(createResponse(
        true,
        stats,
        'estadisticas de cache obtenidas'
      ));
    } catch (error) {
      console.error('error en cache controller (getCacheStats):', error);
      res.status(500).json(createResponse(
        false,
        undefined,
        undefined,
        'no se pudieron obtener las estadisticas de cache'
      ));
    }
  }
}

export const cacheController = new CacheController();
