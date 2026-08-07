# PoC Prisma vs Drizzle

Boilerplate inicial para comparar **Prisma** y **Drizzle** sobre el mismo dominio (Users, Posts, Comments), con **Express + TypeScript + PostgreSQL**.

## Estructura

- `apps/prisma-api`: implementación con Prisma (schema-first).
- `apps/drizzle-api`: implementación con Drizzle (SQL-like en TypeScript).
- `docker-compose.yml`: PostgreSQL local para ambos proyectos.

## Requisitos

- Node.js 20+
- Docker + Docker Compose

## Setup rápido

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Configurar variables de entorno:

   ```bash
   cp .env.example .env
   ```

3. Levantar PostgreSQL:

   ```bash
   npm run db:up
   ```

## Migraciones

### Prisma

```bash
npm run prisma:migrate
```

### Drizzle

```bash
npm run drizzle:generate
npm run drizzle:migrate
```

## Ejecutar APIs

- Ambas en paralelo:

  ```bash
  npm run dev
  ```

- Solo Prisma:

  ```bash
  npm run dev:prisma
  ```

- Solo Drizzle:

  ```bash
  npm run dev:drizzle
  ```

## Endpoints base para casos de prueba

### Prisma API (`http://localhost:3001`)

- `GET /health`
- `GET /users`
- `POST /users`
- `POST /users/with-post` (nested write)
- `POST /posts`
- `GET /posts/with-relations`
- `POST /comments`

### Drizzle API (`http://localhost:3002`)

- `GET /health`
- `GET /users`
- `POST /users`
- `POST /users/with-post` (transaction)
- `POST /posts`
- `GET /posts/with-relations-rq` (Relational Queries API)
- `GET /posts/with-relations-join` (LEFT JOIN)
- `POST /comments`

## Próximos casos de prueba sugeridos

1. Medir DX en migraciones (`prisma migrate` vs `drizzle-kit`).
2. Comparar complejidad de CRUD básico.
3. Probar inserciones anidadas y manejo transaccional.
4. Comparar lecturas relacionales y comportamiento N+1.
