# SAID-ts - Structured AI Delivery for TypeScript

AI-native **TypeScript** starter: hono.js, mcp, prisma. Self-contained - its own conventions, ADRs, scaffold, and AI development guide (`CLAUDE.md`).

## Quickstart

```bash
git clone <your-fork> said-ts
cd said-ts/server
make install
make test
# MCP server: make dev
# Web server: bun run src/app.ts
```

## What's included

### Documentation (`docs/`)
- **`CLAUDE.md`** - AI development guide (entry point for Claude Code)
- **`conventions.md`** - code patterns, import rules
- **`idea.md` / `vision.md`** - project context templates
- **`adr/ADR-TS-SXX`** - STARTER ADRs, provided by the starter (repo structure, TypeScript setup, feature structure, pure service modules, dependency injection)
- **Feature templates** - Spec and task log templates

### Server app (`server/`)
- **Core**: Bun + Zod + Biome + bun:test
- **Both layers**: MCP (index.ts) + Web (app.ts) composition roots
- **Example feature**: `hello/` - demonstrates types, service, tools, module, schema, test
- **Infrastructure**: `lib/errors.ts` (AppError), `lib/mcp.ts` (ok/err helpers), `config/config.ts`
- **Path aliases**: `@lib/`, `@features/`, `@config/`
- **Deployment**: Dockerfile + docker-compose.yml (Web + PostgreSQL)

## Composable Layers

Start with Core, add layers as needed:

| Layer             | Add When                   | Key Files                          |
|-------------------|----------------------------|------------------------------------|
| **MCP**           | Building Claude Code tools | `index.ts`, `<name>.tools.ts`      |
| **Web**           | Building HTTP API          | `app.ts`, `<name>.module.ts`       |
| **Storage: DB**   | Need database              | Add Prisma (see below)             |
| **Storage: FS**   | Need file parsing          | Add gray-matter                    |
| **External API**  | Wrapping 3rd-party API     | Pure service module (ADR-TS-S04)   |
| **Deployment**    | Containerizing             | `Dockerfile`, `docker-compose.yml` |

## Adding Prisma (Storage: DB Layer)

```bash
cd server
bun add prisma @prisma/client
bun add -d prisma
bunx prisma init --datasource-provider sqlite
```

### Edit prisma/schema.prisma - example starter:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Configure database

```bash
# 1. Set DATABASE_URL in .env
echo 'DATABASE_URL=file:./prisma/dev.db' >> .env

# 2. Create database and generate client
bunx prisma migrate dev --name init
bunx prisma generate

# 3. Add Makefile targets
# db-studio: bunx prisma studio
# db-migrate: bunx prisma migrate dev

# 4. For production, update docker-compose.yml DATABASE_URL to PostgreSQL
# and change schema.prisma provider to "postgresql"
```

## Commands

From `server/`, run through `make` (the command facade → `package.json` scripts):

```bash
cd web
make dev          # dev server
make build        # production build (standalone) - R-GATE-BUILD
make test         # R-GATE-TEST
make lint         # R-GATE-LINT
make format       # R-GATE-FORMAT
make typecheck    # R-GATE-TYPECHECK
make pre-commit   # all gates
```

## After cloning

1. Update `server/package.json` name, `docs/idea.md`, and `docs/vision.md`.
2. Delete the example feature (`server/src/features/users/`)
3. Create your first feature: `docs/features/FEAT-01-name.md`
4. Read `CLAUDE.md`, then `docs/adr/README.md` for the decision landscape.

## License

MIT - see LICENSE
