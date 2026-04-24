# Technical Architecture

## System Design

TypeScript backend with feature-based architecture, designed for AI-native development.

## Technology Stack

- **Runtime**: Bun (native TS, fast startup)
- **Validation**: Zod (runtime + compile-time type safety)
- **Logging**: Pino (structured JSON)
- **Testing**: bun:test (built-in, zero config)
- **Formatting**: Biome (Rust-based)

### Optional Layers (add as needed)
- **MCP**: @modelcontextprotocol/sdk — Claude Code tools
- **Web**: Hono + @hono/zod-validator — HTTP API
- **Database**: Prisma (SQLite dev, PostgreSQL prod)
- **Container**: Docker (multi-stage Bun build)

## Core Principles

- **Type Safety**: End-to-end types from Zod schemas
- **Composition Root**: All DI in entry point, no global singletons
- **Feature-Based**: Each feature is self-contained in `features/<name>/`
- **Developer Experience**: Hot reload, fast tests, path aliases

## Architecture Decisions

See `docs/adr/` for detailed architectural decisions.
