// src/app.ts
import express from 'express';
import cors from 'cors';
import pokemonRoutes from './routes/pokemon.js';

const app = express();

// ==========================================
// MIDDLEWARE BÁSICO
// ==========================================

// CORS - Permitir requests del frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// Health check - Verificar que la API funciona
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Ruta raíz - Info de la API
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Pokemon API Backend',
    version: '1.0.0',
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

// Error handler global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;