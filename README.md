# SAID-ts — Smart AI Development for TypeScript

Generic boilerplate for AI-native TypeScript development with structured workflows.

## Quick Start

```bash
# 1. Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# 2. Copy template to new project
cp -r template/ my-project/
cd my-project/server

# 3. Install dependencies
bun install

# 4. Run tests (should pass immediately)
make test

# 5. Start developing
# MCP server: make dev
# Web server: bun run src/app.ts
```

## What's Included

### Documentation (docs/)
- **CLAUDE.md** — AI development guide (entry point for Claude Code)
- **conventions.md** — Code patterns and import rules
- **idea.md** / **vision.md** — Project context templates
- **ADR-S01..S05** — Architecture decisions (monorepo, TypeScript setup, feature structure, pure service modules, dependency injection)
- **Feature templates** — Spec and task log templates

### Server Seed (server/)
- **Core**: Bun + Zod + Biome + bun:test
- **Both layers**: MCP (index.ts) + Web (app.ts) composition roots
- **Example feature**: `hello/` — demonstrates types, service, tools, module, schema, test
- **Infrastructure**: `lib/errors.ts` (AppError), `lib/mcp.ts` (ok/err helpers), `config/config.ts`
- **Path aliases**: `@lib/`, `@features/`, `@config/`
- **Deployment**: Dockerfile + docker-compose.yml (Web + PostgreSQL)

## Composable Layers

Start with Core, add layers as needed:

| Layer | Add When | Key Files |
|---|---|---|
| **MCP** | Building Claude Code tools | `index.ts`, `<name>.tools.ts` |
| **Web** | Building HTTP API | `app.ts`, `<name>.module.ts` |
| **Storage: DB** | Need database | Add Prisma (see below) |
| **Storage: FS** | Need file parsing | Add gray-matter |
| **External API** | Wrapping 3rd-party API | Pure service module (ADR-S04) |
| **Deployment** | Containerizing | `Dockerfile`, `docker-compose.yml` |

## Adding Prisma (Storage: DB Layer)

```bash
cd server

# 1. Install
bun add prisma @prisma/client
bun add -d prisma

# 2. Initialize
bunx prisma init --datasource-provider sqlite

# 3. Edit prisma/schema.prisma — example starter:
```

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

```bash
# 4. Set DATABASE_URL in .env
echo 'DATABASE_URL=file:./prisma/dev.db' >> .env

# 5. Create database and generate client
bunx prisma migrate dev --name init
bunx prisma generate

# 6. Add Makefile targets
# db-studio: bunx prisma studio
# db-migrate: bunx prisma migrate dev

# 7. For production, update docker-compose.yml DATABASE_URL to PostgreSQL
# and change schema.prisma provider to "postgresql"
```

## After Cloning

1. Update `package.json` name and version
2. Update `CLAUDE.md` project overview
3. Update `docs/idea.md` and `docs/vision.md` with your project context
4. Delete the `users/` example feature
5. Create your first feature: `docs/features/FEAT-001-name.md`

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
