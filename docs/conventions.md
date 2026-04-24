# Code Conventions

## Core Philosophy
- **KISS** - Simple solutions over complex ones
- **YAGNI** - Build only what's needed now
- **MVP First** - Working version, then iterate
- **Type Safety** - Zod for runtime, TypeScript for compile-time
- **Error Handling** - Typed errors with AppError class

## Core Stack (always present)

```bash
bun                        # Runtime + package manager + test runner
zod                        # Runtime validation (v4)
pino                       # Structured logging
biome                      # Formatting + linting
```

### Code Quality Commands
```bash
bun test                   # Run tests
bun run format             # Format with Biome
bun run lint               # Lint with Biome
bun run check              # Format + lint
bunx tsc --noEmit          # Type-check (catches deprecation warnings)
```

---

## Layer: Web (Hono + Prisma)

Active when project uses HTTP API server. See `CLAUDE.md` Active Layers.

### Web Dependencies
```bash
hono                       # Web framework
@hono/zod-validator        # Zod-based request validation middleware
prisma                     # Database ORM
jose                       # JWT signing/verification
```

### Web Feature Structure

Every feature lives in `server/src/features/<name>/` (same structure as all layers, see ADR-S03). Web-specific file is `<name>.module.ts`:

```
server/src/features/<name>/
├── <name>.types.ts        # Domain-owned interfaces (when needed)
├── <name>.service.ts      # Business logic (constructor DI)
├── <name>.module.ts       # Hono routes (factory function)
├── <name>.tools.ts        # MCP tool factory (when needed)
├── <name>.schema.ts       # Zod schemas (request/response)
└── <name>.test.ts         # Tests
```

### Web Module Pattern
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

### Web Service Pattern
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

### Web Composition Root (`app.ts`)

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

### Web Configuration

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});
```

### Web Testing

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

### Web Database

- **Schema**: `server/prisma/schema.prisma`
- **Dev**: SQLite (`file:./prisma/dev.db`)
- **Prod**: PostgreSQL (via `DATABASE_URL`)
- **Migrations**: `bunx prisma migrate dev`
- **Studio**: `bunx prisma studio`

---

## Layer: MCP (Model Context Protocol)

Active when project uses MCP server. See `CLAUDE.md` Active Layers.

### MCP Dependencies
```bash
@modelcontextprotocol/sdk  # MCP server + transport
```

### MCP Source Structure

Same feature structure as all layers (see ADR-S03). MCP-specific file is `<name>.tools.ts`:

```
server/src/
├── index.ts                              # Composition root — registerTool()
├── config.ts                             # Config resolution
├── lib/                                  # Domain-agnostic utilities
└── features/
    └── <name>/
        ├── <name>.types.ts               # Domain-owned interfaces
        ├── <name>.service.ts             # Business logic
        ├── <name>.tools.ts               # MCP tool factory
        ├── <name>.schema.ts              # Zod input schemas
        └── <name>.test.ts                # Tests
```

### MCP Tool Handler Pattern

Handler factory receives service, returns tool methods:

```typescript
// features/orders/orders.tools.ts
import type { OrdersService } from "./orders.service";

export function createOrderTools(service: OrdersService) {
  return {
    listOrders: async (args: { status?: string }) => {
      const orders = await service.list(args.status);
      return { content: [{ type: "text" as const, text: JSON.stringify(orders) }] };
    },
  };
}
```

### MCP Composition Root (`index.ts`)

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { resolveConfig } from "./config";
import { OrdersService } from "./features/orders/orders.service";
import { createOrderTools } from "./features/orders/orders.tools";
import { ListOrdersSchema } from "./features/orders/orders.schema";

const config = resolveConfig();
const ordersService = new OrdersService(config);
const orderTools = createOrderTools(ordersService);

const server = new McpServer({ name: "my-server", version: "1.0.0" });

server.registerTool("list_orders", {
  description: "List orders with optional status filter",
  inputSchema: ListOrdersSchema.shape,
}, orderTools.listOrders);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### MCP Configuration

```typescript
const configSchema = z.object({
  dataDir: z.string(),
  reportsDir: z.string(),
});
```

Config resolution: env var > config file > git-root defaults.

### MCP Testing

Test service and handlers directly — no transport layer:

```typescript
import { describe, it, expect } from "bun:test";
import { createOrderTools } from "./orders.tools";
import { OrdersService } from "./orders.service";

describe("Order handlers", () => {
  const service = new OrdersService(testConfig);
  const handlers = createOrderTools(service);

  it("listOrders returns array", async () => {
    const result = await handlers.listOrders({});
    const data = JSON.parse(result.content[0].text);
    expect(Array.isArray(data)).toBe(true);
  });
});
```

---

## Generic Patterns (all layers)

### Import Order

```typescript
// 1. Node/Bun built-ins
import { readFile } from "fs/promises";

// 2. External packages
import { z } from "zod";

// 3. Project aliases (@app, @config, @features, @lib — alphabetical)
import { createApp } from "@app";
import type { Config } from "@config/config.js";
import type { User } from "@features/users/users.schema.js";
import { AppError } from "@lib/errors.js";

// 4. Feature-local (relative imports within own feature)
import { OrdersService } from "./orders.service.js";
import type { CreateOrderInput } from "./orders.schema.js";
```

**Path alias rules** (see ADR-S02):
- Cross-boundary imports always use aliases: `@app`, `@lib/`, `@features/`, `@config/`
- Within a feature, use relative imports: `./orders.service.js`
- Never use `../../` to reach lib, config, app, or another feature

### Error Handling

Use the `AppError` class for all business errors:

```typescript
// Throw typed errors in services / handlers
throw AppError.notFound(`Order ${id} not found`);
throw AppError.badRequest("Duplicate ID");

// Web layer: global error handler converts to JSON response
// MCP layer: errors caught and returned as tool error results
```

### Schema Pattern
Schemas define input/output shapes with Zod:

```typescript
import { z } from "zod";

export const createOrderSchema = z.object({
  id: z.string().regex(/^[A-Z0-9][-A-Z0-9]*$/i),
  number: z.string(),
  title: z.string().min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
```

### Composition Root Rules
- Services/handlers receive deps via constructor or factory function (no global imports)
- Entry point accepts overrides for testing
- **Web**: `createApp()` in `app.ts`, features mounted via `app.route()`
- **MCP**: `index.ts`, tools registered via `server.registerTool()`

### Forbidden Practices
- Direct `process.env` access outside `config.ts`
- Global mutable state (use composition root)
- `any` type (use `unknown` and narrow)
- Ignoring errors (always handle or rethrow)
- Circular imports between domains/features
- Cross-domain service/handler imports (use DI via composition root)
- Root-level dump-all `types.ts` (types belong in owning feature's `<name>.types.ts`)
- Domain-specific code in `lib/` (lib/ is for domain-agnostic utilities only)
- Pre-creating types for unbuilt features (YAGNI)
- Business logic in route handlers / tool registration (keep in services/handlers)

## Quality Checklist
Before marking tasks complete:
- [ ] Tests pass (`bun test`)
- [ ] Code formatted (`bun run format`)
- [ ] Type-check passes (`bunx tsc --noEmit`) — catches deprecations and type errors
- [ ] Zod schemas validate at boundaries

---

**References:**
- `@docs/adr/ADR-S02-typescript-project-setup.md` — Stack decisions
- `@docs/adr/ADR-S03-feature-structure.md` — Feature pattern details
