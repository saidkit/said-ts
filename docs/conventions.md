# Code Conventions

## Core Philosophy
- **KISS** - Simple solutions over complex ones
- **YAGNI** - Build only what's needed now
- **MVP First** - Working version, then iterate
- **Type Safety** - Zod for runtime, TypeScript for compile-time
- **Error Handling** - Typed errors with AppError class

## Stack

### Core
```bash
bun                        # Runtime + package manager + test runner
hono                       # Web framework
@hono/zod-validator        # Zod-based request validation middleware
zod                        # Runtime validation (v4)
prisma                     # Database ORM
pino                       # Structured logging
jose                       # JWT signing/verification
biome                      # Formatting + linting
```

### Code Quality Commands
```bash
bun test                   # Run tests
bun run format             # Format with Biome
bun run lint               # Lint with Biome
bun run check              # Format + lint
```

## Feature Structure

Every feature lives in `server/src/features/<name>/` with 3-4 files:

```
server/src/features/<name>/
├── <name>.module.ts       # Hono routes (factory function)
├── <name>.service.ts      # Business logic (constructor DI)
├── <name>.schema.ts       # Zod schemas (request/response)
└── <name>.test.ts         # Tests
```

### Module Pattern
Modules are **factory functions** that receive services and return a Hono app:

```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createUserSchema } from "./users.schema";
import type { UsersService } from "./users.service";

export function createUsersModule(service: UsersService) {
  const app = new Hono();

  app.get("/", async (c) => {
    return c.json(await service.list());
  });

  app.post("/", zValidator("json", createUserSchema), async (c) => {
    const body = c.req.valid("json");
    return c.json(await service.create(body), 201);
  });

  return app;
}
```

### Service Pattern
Services are **classes** that receive dependencies via constructor:

```typescript
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw AppError.notFound(`User ${id} not found`);
    return user;
  }
}
```

### Schema Pattern
Schemas define request/response shapes with Zod:

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

## Composition Root (`app.ts`)

All dependency wiring happens in `createApp()`:

```typescript
export function createApp(overrides?: Partial<AppDeps>) {
  const config = overrides?.config ?? loadConfig();
  const logger = overrides?.logger ?? createLogger(config);
  const prisma = overrides?.prisma ?? createPrismaClient(config);

  const app = new Hono();
  // ... middleware, routes, features
  return { app, config, logger, prisma };
}
```

**Rules:**
- Services receive deps via constructor (no global imports)
- `createApp()` accepts overrides for testing
- Features are mounted via `app.route()`
- Middleware is applied globally or per-feature

## Import Order

```typescript
// 1. Node/Bun built-ins
import { readFile } from "fs/promises";

// 2. External packages
import { Hono } from "hono";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

// 3. Internal lib/middleware
import { AppError } from "../../lib/errors";
import type { Logger } from "../../lib/logger";

// 4. Feature-local
import { userSchema } from "./users.schema";
import type { UsersService } from "./users.service";
```

## Error Handling

Use the `AppError` class for all business errors:

```typescript
// Throw typed errors in services
throw AppError.notFound(`User ${id} not found`);
throw AppError.badRequest("Email already exists");
throw AppError.unauthorized("Invalid token");

// Global error handler converts to JSON response
app.onError(createErrorHandler(logger));
```

## Configuration

All config flows through `src/config.ts` with Zod validation:

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});
```

**Forbidden:** Direct `process.env` access outside `config.ts`.

## Testing

```typescript
import { describe, it, expect } from "bun:test";
import { createApp } from "../../app";

describe("Users", () => {
  const { app } = createApp(); // Uses test env from test/setup.ts

  it("GET /api/v1/users returns array", async () => {
    const res = await app.request("/api/v1/users");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
```

**Rules:**
- Use `bun:test` (built-in, fast)
- Create app via `createApp()` for isolation
- Test files live alongside feature code (`*.test.ts`)
- `test/setup.ts` sets test environment variables

## Database

- **Schema**: `server/prisma/schema.prisma`
- **Dev**: SQLite (`file:./prisma/dev.db`)
- **Prod**: PostgreSQL (via `DATABASE_URL`)
- **Migrations**: `bunx prisma migrate dev`
- **Studio**: `bunx prisma studio`

## Forbidden Practices
- Direct `process.env` access outside `config.ts`
- Global mutable state (use composition root)
- `any` type (use `unknown` and narrow)
- Ignoring errors (always handle or rethrow)
- Circular imports between features
- Business logic in modules (keep in services)

## Quality Checklist
Before marking tasks complete:
- [ ] Tests pass (`bun test`)
- [ ] Code formatted (`bun run format`)
- [ ] No TypeScript errors
- [ ] Zod schemas match API contract

---

**References:**
- `@docs/adr/ADR-S02-typescript-project-setup.md` — Stack decisions
- `@docs/adr/ADR-S03-feature-structure.md` — Feature pattern details
