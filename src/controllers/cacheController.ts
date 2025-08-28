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
      console.log('🗑️ Clearing cache');
      pokemonService.clearCache();

      res.status(200).json(createResponse(
        true,
        undefined,
        'Cache cleared successfully'
      ));
    } catch (error) {
      console.error('❌ Cache Controller Error:', error);
      res.status(500).json(createResponse(
        false,
        undefined,
        undefined,
        'Failed to clear cache'
      ));
    }
  }

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
      console.error('❌ Cache Controller Error:', error);
      res.status(500).json(createResponse(
        false,
        undefined,
        undefined,
        'Failed to retrieve cache stats'
      ));
    }
  }
}

export const cacheController = new CacheController();
