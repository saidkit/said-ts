# ADR-S02: TypeScript Project Setup

**Date:** 2026-03-26
**Status:** Accepted

## Problem

Choose the runtime, framework, and tooling for a TypeScript backend that prioritizes developer experience, type safety, and AI-assisted development.

## Decision

**Bun + Hono + Prisma + Zod + Pino + Biome**

### Technology Choices

| Concern | Choice | Why |
|---|---|---|
| Runtime | Bun | Native TS execution, fast startup, built-in test runner, package manager |
| Framework | Hono | Lightweight, Web Standards API, middleware ecosystem, multi-runtime |
| Validation | Zod v4 + @hono/zod-validator | Runtime + compile-time type safety, request validation middleware |
| Database | Prisma | Type-safe queries, migration system, multi-DB support |
| Logging | Pino | Fastest Node.js logger, structured JSON output |
| Auth | jose | Standard JWT library, no native dependencies |
| Format/Lint | Biome | Rust-based, fast, replaces ESLint + Prettier |
| Testing | bun:test | Built-in, Jest-compatible API, zero config |

### Why Bun over Node.js

- Native TypeScript execution (no transpile step)
- Built-in test runner (no vitest/jest dependency)
- Built-in package manager (faster than npm/pnpm)
- `--hot` flag for development (no nodemon)
- Bun.serve() for HTTP (or Hono adapter)

### Why Hono over Express/Fastify

- Designed for Web Standards (Request/Response)
- Works on Bun, Node, Deno, Cloudflare Workers
- `@hono/zod-validator` integrates Zod schemas into route handlers
- Tiny footprint (~14KB), no bloat
- Middleware is just functions

### Why Prisma over Drizzle/Knex

- Schema-first design (single source of truth)
- Type-safe queries without manual types
- Migration system built-in
- Multi-database support (SQLite dev, PostgreSQL prod)
- Prisma Studio for visual DB browsing

## Consequences

**Positive:**
- Zero-config TypeScript execution
- End-to-end type safety (Zod schemas -> validated requests -> Prisma queries)
- Fast development cycle (hot reload, fast tests)
- Single formatter+linter (Biome) instead of ESLint + Prettier combo

**Negative:**
- Bun ecosystem smaller than Node.js (some packages may not work)
- Prisma has higher overhead than raw SQL for complex queries

## Related

- ADR-S01: Monorepo structure
- ADR-S03: Feature structure
