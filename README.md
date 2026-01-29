# Node + React AI Challenge

A workspace containing a Fastify-based API and a Vite + React frontend used for the Node + React AI Challenge.

## Use case
- Local development and demonstration of an AI-enabled project with a backend API (webhooks, DB access) and a frontend UI.

## Technologies
- [pnpm](https://pnpm.io/)

### API
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Fastify (API)](https://www.fastify.io/) - REST API Framework
- [BiomeJS](https://biomejs.dev/guides/getting-started/) - Linter/Formatter
- [Drizzle ORM](https://orm.drizzle.team/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Zod](https://zod.dev/) - TS Schema validation
- [Scalar Docs](https://scalar.com/products/docs/getting-started) - API Documentation

### Web
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- TanStack Router
- TailwindCSS
-



## Prerequisites
- Node.js (>=18)
- pnpm (recommended; matches workspace `pnpm-lock.yaml`)
- PostgreSQL (if you plan to run the API with a real database)

## Setup / Install
From the repository root, install dependencies for the workspace:

```bash
pnpm install
```

## Environment
Create an `.env` file inside the `api/` folder. Example `api/.env`:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=postgres://user:password@localhost:5432/mydb
```

The API expects at least `DATABASE_URL` (see `api/src/env.ts`).

## Run (development)
Start the API in watch/dev mode:

```bash
pnpm --filter api dev
```

Start the frontend (Vite dev server):

```bash
pnpm --filter web dev
```

You can run both in separate terminals, or use your own tooling to run them concurrently.

## Database / Migrations
Drizzle Kit is available in the `api` package. Useful commands:

```bash
pnpm --filter api run db:generate   # generate types/migrations/artifacts from schema
pnpm --filter api run db:migrate    # run migrations
pnpm --filter api run db:studio     # open drizzle studio (dev)
```

## Build / Production
- Frontend: build with `pnpm --filter web build` and serve the generated `dist` however you prefer.
- API: the `api` package includes a `start` script that expects a compiled `dist/server.js`. To run in production, compile the TypeScript and then start:

```bash
pnpm --filter api exec tsc --build
pnpm --filter api start
```

Note: you may prefer to add a `build` script to `api/package.json` to formalize compilation.

## Project layout
- `api/` — Fastify API, DB schema, routes, migrations
- `web/` — Vite + React frontend

## Troubleshooting
- If the API cannot connect to the DB, verify `api/.env` and that PostgreSQL is reachable at `DATABASE_URL`.
- If a script is missing, check the corresponding `package.json` in `api/` or `web/`.
