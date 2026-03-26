# ADR-S03: Feature Structure

**Date:** 2026-03-26
**Status:** Accepted

## Problem

Establish a consistent structure for business features that provides clear boundaries, testability, and scales from simple CRUD to complex domain logic.

## Decision

**Module + Service + Schema pattern with constructor DI.**

Every feature has 3-4 files in `server/src/features/<name>/`:

```
server/src/features/<name>/
├── <name>.module.ts       # Routes (Hono factory function)
├── <name>.service.ts      # Business logic (class with constructor DI)
├── <name>.schema.ts       # Zod schemas (request/response/params)
└── <name>.test.ts         # Tests
```

### File Responsibilities

| File | Contains | NEVER contains |
|---|---|---|
| `<name>.module.ts` | Route definitions, request handling, Zod validation | Business logic, DB queries |
| `<name>.service.ts` | Business logic, DB queries via Prisma | Route definitions, HTTP concerns |
| `<name>.schema.ts` | Zod schemas, type exports | Business logic, route definitions |
| `<name>.test.ts` | Tests for this feature | Tests for other features |

### Module Pattern

Modules are **factory functions** — they receive services and return a Hono app:

```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

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

**Why factory functions, not classes:**
- Simpler than decorators/IoC containers
- Easy to test (pass mock services)
- Hono's `app.route()` expects Hono instances

### Service Pattern

Services are **classes** with constructor injection:

```typescript
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async list() { return this.prisma.user.findMany(); }
}
```

**Why classes, not plain functions:**
- Constructor DI is natural (private prisma)
- Multiple methods share the same dependencies
- Easy to mock in tests

### Wiring in app.ts

```typescript
// Composition root — all DI happens here
const usersService = new UsersService(prisma);
app.route("/api/v1/users", createUsersModule(usersService));
```

### Adding a New Feature

1. Create `src/features/<name>/` directory
2. Write `<name>.schema.ts` — Zod schemas for request/response
3. Write `<name>.service.ts` — Business logic class
4. Write `<name>.module.ts` — Route factory function
5. Wire in `app.ts`: create service, mount module
6. Write `<name>.test.ts` — Tests

### Import Rules

- Modules import: their own schema + service, lib/, middleware/
- Services import: their own schema, lib/, Prisma types
- Schemas import: only Zod (no other feature imports)
- **No circular imports between features**
- Cross-feature communication goes through app.ts wiring

## Consequences

**Positive:**
- Predictable file locations for humans and LLMs
- Clear separation of concerns
- Easy to test (mock services via constructor)
- Zod schemas enforce runtime validation at route boundaries

**Negative:**
- More files per feature than a single-file approach
- Schema duplication between Prisma and Zod (mitigated by `zod-prisma` if needed)

## Related

- ADR-S01: Monorepo structure
- ADR-S02: TypeScript project setup
