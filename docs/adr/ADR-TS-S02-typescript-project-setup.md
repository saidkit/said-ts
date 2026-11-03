# ADR-TS-S02: TypeScript Project Setup

**Date:** 2026-04-22
**Status:** Accepted

## Problem

Choose the runtime, tooling, and per-layer dependencies for a TypeScript application that prioritizes developer experience, type safety, and AI-native development.

## Decision

**Core: Bun + Zod + Pino + Biome + bun:test**
**Layers add their own dependencies as needed.**

### Core (always present)

| Concern | Choice | Why |
|---|---|---|
| Runtime | Bun | Native TS execution, fast startup, built-in test runner, package manager |
| Validation | Zod v4 | Runtime + compile-time type safety |
| Logging | Pino | Fastest Node.js logger, structured JSON output |
| Format/Lint | Biome | Rust-based, fast, replaces ESLint + Prettier |
| Testing | bun:test | Built-in, Jest-compatible API, zero config |

### Layer: Web

| Concern | Choice | Why |
|---|---|---|
| Framework | Hono | Lightweight, Web Standards API, middleware ecosystem, multi-runtime |
| Request validation | @hono/zod-validator | Integrates Zod schemas into route handlers |
| Auth | jose | Standard JWT library, no native dependencies |
| OpenAPI | @hono/zod-openapi | Contract generation from existing Zod schemas |

### Layer: MCP

| Concern | Choice | Why |
|---|---|---|
| Protocol | @modelcontextprotocol/sdk | Official SDK, supports stdio/SSE/HTTP transports |

**Note:** MCP SDK is primarily tested with Node.js. When using Bun, verify transport compatibility.

### Layer: Storage (DB)

| Concern | Choice | Why |
|---|---|---|
| ORM | Prisma | Schema-first, type-safe queries, migration system, multi-DB |
| Dev DB | SQLite | Zero-config local development |
| Prod DB | PostgreSQL | Production-grade relational storage |

### Layer: Storage (Filesystem)

| Concern | Choice | Why |
|---|---|---|
| Frontmatter | gray-matter | Standard YAML frontmatter parser for markdown |
| File discovery | glob | Reliable file pattern matching |

### Layer: Deployment

| Concern | Choice | Why |
|---|---|---|
| Container | Docker | Multi-stage Bun build for minimal image |

## Key Rationale

### Why Bun over Node.js
- Native TypeScript execution (no transpile step)
- Built-in test runner (no vitest/jest dependency)
- Built-in package manager (faster than npm/pnpm)
- `--hot` flag for development (no nodemon)

### Why Hono over Express/Fastify (Web layer)
- Designed for Web Standards (Request/Response)
- Works on Bun, Node, Deno, Cloudflare Workers
- `@hono/zod-validator` integrates Zod schemas into route handlers
- Tiny footprint (~14KB), no bloat

### Why Prisma over Drizzle/Knex (Storage DB layer)
- Schema-first design (single source of truth)
- Type-safe queries without manual types
- Migration system built-in
- Multi-database support (SQLite dev, PostgreSQL prod)

### Why @modelcontextprotocol/sdk (MCP layer)
- Official SDK maintained by Anthropic
- Supports multiple transports (stdio, SSE, Streamable HTTP)
- Built-in Zod schema integration for tool inputs
- TypeScript-native

## Path Aliases

**Four tsconfig `paths` aliases map to the structural roles under `src/`.**

```json
"paths": {
  "@lib/*": ["./src/lib/*"],
  "@features/*": ["./src/features/*"],
  "@config/*": ["./src/config/*"],
  "@app": ["./src/app.ts"]
}
```

| Alias | Maps to | Structural role |
|---|---|---|
| `@lib/*` | `src/lib/` | Domain-agnostic utilities (errors, MCP helpers, auth, logger) |
| `@features/*` | `src/features/` | Business domain modules |
| `@config/*` | `src/config/` | Project configuration |
| `@app` | `src/app.ts` | Web composition root (used by integration tests) |

### Why aliases

- **Stable paths.** `@lib/mcp.js` is the same regardless of caller depth — no counting `../` levels.
- **Semantic clarity.** The alias tells you *what kind of code* you're reaching into (infrastructure vs. business domain vs. config).
- **Refactoring safety.** Moving a file within a feature doesn't break imports from other features or lib.

### Why named aliases, not one `@/` root

A single `@/` root alias is common but loses the semantic signal. Named aliases match the *categories* of code in the project:
- `lib/` = generic utilities, no business knowledge
- `features/` = all business logic (per ADR-S03)
- `config/` = project configuration — not a utility, not a feature
- `app` = Web composition root — single-file alias for integration test imports

### Rules

- **Cross-boundary imports** use aliases: `@lib/errors.js`, `@features/orders/orders.types.js`, `@config/config.js`
- **Within a feature** use relative imports: `./orders.service.js`, `./orders.types.js`
- **Composition root** (`index.ts`, `app.ts`) uses `@features/` for all feature imports
- **Integration tests** use `@app` to import the Web composition root: `import { createApp } from "@app"`
- **Test files** follow the same alias rules as source files
- Bun resolves tsconfig `paths` natively — no extra tooling required

## Consequences

**Positive:**
- Zero-config TypeScript execution
- End-to-end type safety (Zod schemas at every boundary)
- Fast development cycle (hot reload, fast tests)
- Single formatter+linter (Biome)
- Layer-specific deps only installed when needed

**Negative:**
- Bun ecosystem smaller than Node.js (some packages may not work)
- Prisma has higher overhead than raw SQL for complex queries
- MCP SDK primarily Node.js-tested — Bun compatibility needs verification

## Related

- ADR-TS-S01: Repository structure (multi-repo layer composition)
- ADR-S03: Feature structure
