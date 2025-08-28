# 🚀 Pokémon API Backend

Backend en **Node.js + Express + TypeScript** que consume la [PokeAPI](https://pokeapi.co) y expone endpoints listos para ser consumidos por un frontend en React.

## 📦 Tecnologías usadas

* **Node.js + Express** (framework backend)
* **TypeScript** (tipado estático)
* **Axios** (cliente HTTP para consumir la PokeAPI)
* **Node-Cache** (caché en memoria)
* **CORS** (integración con frontend React)
* Arquitectura **Clean Architecture + SOLID**

---

## ⚙️ Instalación y configuración

### 1. Clonar repositorio

```bash
git clone https://github.com/tuusuario/pokemon-api-backend.git
cd pokemon-api-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crear archivo `.env` en la raíz con al menos:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

### 5. Build y producción

```bash
npm run build
npm start
```

---

## 📂 Estructura de carpetas

```
src/
├── config/          # Configuración centralizada
├── controllers/     # Controladores Express
├── services/        # Lógica de negocio + acceso a APIs externas
├── types/           # Tipos y DTOs
├── utils/           # Helpers, validadores, errores
├── routes/          # Definición de rutas
├── app.ts           # Configuración principal de Express
└── server.ts        # Punto de entrada
```

---

## 🌐 Endpoints principales

### Healthcheck

`GET /health`

### Pokémon

* `GET /api/pokemon?page=1&limit=20` → Lista paginada de Pokémon
* `GET /api/pokemon/:id` → Obtener detalle de un Pokémon
* `GET /api/pokemon/search?name=pikachu` → Buscar por nombre
* `GET /api/pokemon/search?type=fire&limit=10` → Buscar por tipo
* `GET /api/pokemon/random` → Obtener Pokémon aleatorio
* `GET /api/pokemon/:id/exists` → Verificar si existe

### Caché

* `GET /api/pokemon/cache/stats` → Estadísticas del caché
* `DELETE /api/pokemon/cache` → Limpiar caché

---

## ✅ Características implementadas

* Consumo de **PokeAPI** con Axios.
* **Paginación** (`page`, `limit`) en listados.
* **Búsqueda avanzada** (por nombre o tipo).
* **Caché en backend** para reducir llamadas innecesarias.
* **Manejo de errores tipado** (404, 400, 503).
* **CORS configurado** para conectar con frontend en React.
* **Estructura modular y escalable** bajo principios SOLID.

---

## 🔧 Mejoras opcionales

* 🚦 Rate limiting para proteger la PokeAPI.
* 📝 Documentación Swagger/OpenAPI.
* 🧪 Tests con Jest + Supertest.
* ☁️ Despliegue en Vercel / Render / AWS.
