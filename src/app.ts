import express from 'express'
import cors from 'cors'
import { AppConfig } from './config/index.js'
import pokemonRoutes from './routes/pokemon.js'

const app = express()

app.use(cors({
  origin: AppConfig.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Middleware para poder leer JSON en las requests con un maximo de 10mb
app.use(express.json({ limit: '10mb' }))

// Middleware para poder leer data de formularios (usando qs en lugar de querystring)
app.use(express.urlencoded({ extended: true }))

// Middleware simple para mostrar cada request en consola
app.use((req, res, next) => {
  const ahora = new Date().toISOString()
  console.log(`${ahora} - ${req.method} ${req.path}`)
  next()
})

// ==========================================
// RUTAS
// ==========================================

// Endpoint para saber si el server está arriba
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: AppConfig.nodeEnv,
    version: '2.0.0'
  })
})

// Ruta raíz (info de la API)
app.get('/', (req, res) => {
  res.json({
    message: 'Pokemon API Backend - Refactor',
    version: '2.0.0',
    arquitectura: 'Clean Architecture con principios SOLID',
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
    docs: 'https://pokeapi.co/docs/v2'
  })
})

// Rutas de Pokémon
app.use('/api/pokemon', pokemonRoutes)

// 404 - cuando la ruta no existe
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `La ruta ${req.method} ${req.originalUrl} no existe`,
    endpointsDisponibles: [
      '/health',
      '/api/pokemon',
      '/api/pokemon/:id',
      '/api/pokemon/search',
      '/api/pokemon/random',
    ],
  })
})

// Middleware para manejar errores generales
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no controlado:', err)
  
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: AppConfig.nodeEnv === 'development' 
      ? err.message 
      : 'Algo salió mal'
  })
})

export default app
