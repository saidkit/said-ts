# Smart AI Development Template (TypeScript)

A modern, production-ready TypeScript backend template for AI-assisted development with structured workflows and feature-based architecture.

## Quick Start

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Setup project
make setup

# Start development server
make dev
```

The API server will be available at http://localhost:3000

## Project Structure

```
template-ts-dev/
├── docs/                  # Project documentation & architecture
│   ├── idea.md            # Project vision
│   ├── vision.md          # Technical architecture
│   ├── conventions.md     # Code standards
│   ├── features/          # Feature specifications
│   └── adr/               # Architecture decision records
├── server/                # Backend
│   ├── src/
│   │   ├── index.ts       # Entry point
│   │   ├── app.ts         # Composition root (DI wiring)
│   │   ├── config.ts      # Zod-validated env config
│   │   ├── lib/           # Shared infrastructure
│   │   ├── middleware/     # Hono middleware
│   │   └── features/      # Feature modules
│   ├── prisma/            # Database schema & migrations
│   └── test/              # Test setup
├── CLAUDE.md              # AI development guide
├── Makefile               # Unified dev commands
└── docker-compose.yml     # Docker services
```

## Stack

| Concern | Choice |
|---|---|
| Runtime | Bun |
| Framework | Hono + @hono/zod-validator |
| Validation | Zod |
| Database | Prisma (SQLite dev, PostgreSQL prod) |
| Logging | Pino |
| Testing | Bun test (built-in) |
| Formatting | Biome |
| Container | Docker + docker-compose |

## Development Commands

```bash
make setup          # Install deps + generate Prisma + push schema
make dev            # Start dev server with hot reload
make test           # Run all tests
make format         # Format code with Biome
make lint           # Lint code with Biome
make db-studio      # Open Prisma Studio
make docker-dev     # Start with Docker Compose
```

## Feature Pattern

Each feature lives in `server/src/features/<name>/` with:
- `<name>.module.ts` — Hono routes (Zod-validated)
- `<name>.service.ts` — Business logic (receives deps via constructor)
- `<name>.schema.ts` — Zod schemas (request/response validation)
- `<name>.test.ts` — Tests

See `docs/conventions.md` for the full pattern.

## Starting a New Project

### 1. Copy the template
```bash
cp -r template-ts-dev my-project
cd my-project
```

### 2. Customize identity
- Edit `server/package.json` — change `name`
- Edit `docs/idea.md` — describe your project vision
- Edit `server/prisma/schema.prisma` — define your data model
- Edit `server/.env` — set your env vars

### 3. Setup
```bash
make setup
```

### 4. Start Claude Code
```bash
claude
```

The first message to Claude Code:
```
Read @CLAUDE.md — I'm starting a new project based on this template.
Here's what I want to build: [describe your project in 2-3 sentences]
```

Claude Code will read `CLAUDE.md`, understand the project structure, conventions, and ADRs, then help you plan and implement features following the established patterns.

### Typical first session flow
1. Claude reads `CLAUDE.md` (automatic — it's in the project root)
2. You describe what you want to build
3. Claude proposes a feature spec (`docs/features/FEAT-001-xxx.md`)
4. You approve, Claude implements following `docs/conventions.md` patterns
5. `make test && make format` to verify

## AI Development

**AI Development Guide**: [`CLAUDE.md`](CLAUDE.md) — Context strategies, workflows, session patterns

## Contributing

1. **Setup**: `make setup`
2. **Branch**: `feature/FEAT-XXX-name`
3. **Develop**: Follow [`docs/conventions.md`](docs/conventions.md)
4. **Quality**: `make pre-commit`

## License

[Your License Here]
