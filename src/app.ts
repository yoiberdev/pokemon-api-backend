import express from 'express';
import cors from 'cors';
// import pokemonRoutes from './routes/pokemon.js';

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api', pokemonRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;