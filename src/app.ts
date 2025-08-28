import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppConfig } from './config/index.js';
import pokemonRoutes from './routes/pokemon.js';

const app = express();

// CORS - Permitir requests del frontend
app.use(cors({
  origin: AppConfig.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsear JSON
app.use(express.json({ limit: '10mb' }));

// Parsear URL encoded data
app.use(express.urlencoded({ extended: true }));

// Logging middleware simple
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// ==========================================
// RUTAS
// ==========================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: AppConfig.nodeEnv,
    version: '2.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Pokemon API Backend - Refactored',
    version: '2.0.0',
    architecture: 'Clean Architecture with SOLID principles',
    endpoints: {
      health: '/health',
      pokemon: {
        list: 'GET /api/pokemon?page=1&limit=20',
        single: 'GET /api/pokemon/:id',
        search: 'GET /api/pokemon/search?name=pikachu',
        random: 'GET /api/pokemon/random',
        byType: 'GET /api/pokemon/types/electric',
        exists: 'GET /api/pokemon/:id/exists',
      },
      cache: {
        stats: 'GET /api/pokemon/cache/stats',
        clear: 'DELETE /api/pokemon/cache',
      }
    },
    documentation: 'https://pokeapi.co/docs/v2'
  });
});

// Rutas principales de Pokemon
app.use('/api/pokemon', pokemonRoutes);

// 404 - Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      '/health',
      '/api/pokemon',
      '/api/pokemon/:id',
      '/api/pokemon/search',
      '/api/pokemon/random',
    ],
  });
});

// Error handler global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 Unhandled Error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: AppConfig.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;