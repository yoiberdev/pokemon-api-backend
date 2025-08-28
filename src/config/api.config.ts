export const ApiConfig = {
  pokeApi: {
    baseUrl: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
    timeout: 10000
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutos
    checkPeriod: 10 * 60 // 10 minutos
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  }
} as const;