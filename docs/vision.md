# Technical Architecture

## System Design

Modern TypeScript backend with feature-based architecture, designed for AI-assisted development.

## Technology Stack

- **Runtime**: Bun (native TS, fast startup)
- **Framework**: Hono + @hono/zod-validator (typed request validation)
- **Validation**: Zod v4 (runtime + compile-time)
- **Database**: Prisma (SQLite dev, PostgreSQL prod)
- **Logging**: Pino (structured JSON)
- **Testing**: Bun test (built-in)
- **Formatting**: Biome (Rust-based)
- **Container**: Docker (multi-stage Bun build)

## Core Principles

- **Type Safety**: End-to-end types from Zod schema to Prisma query
- **Composition Root**: All DI in `app.ts`, no global singletons
- **Feature-Based**: Each feature is self-contained (module + service + schema)
- **Developer Experience**: Hot reload, fast tests, Prisma Studio

## Data Flow

```
Request -> Middleware (auth, logging) -> Module (route matching, Zod validation)
    -> Service (business logic) -> Prisma (database) -> Response
```

## Architecture Decisions

See `docs/adr/` for detailed architectural decisions.
