# Planificación

1. Crear proyecto backend de NODEJS + EXPRESJS + TYPESCRIPT 
2. Crear proyecto frontend de REACTJS + TYPESCRIPT
3. Arquitectura de proyecto backend: N Capas
4. Configuración inicial

# Creación de proyecto backend

mkdir pokemon-api-backend
cd pokemon-api-backend && npm init -y
npm intall express cors axios
npm install -D typescript @types/node @types/express @types/cors

# Estructura de carpetas

/ src /
|__ /controllers 
|__ /services 
|__ /routes 
|__ /types 
|__ /middleware 
|__ /utils 
|__ app.ts 
|__ server.ts 
.env
package.json
README.MD

# Configuración inicial

## .env
url de la api de pokeapi
puerto para correr el backend
variable para tener modo de desarrollo y producción

## app.ts
instancia de express
uso de cors y parseo de entrada de tipo json

## server.ts
llamamos al app.ts para correrlo en el puerto definido en el .env
## package.json
agregando comando `npm run dev` llama a server.ts

## types/pokemon.ts
agregue los tipos necesarios para el proyecto

## services/pokemonService.ts
Definición de la clase de pokemon service