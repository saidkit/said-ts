# ADR-TS-S03: Feature Structure

**Date:** 2026-04-22
**Status:** Accepted

## Problem

Establish consistent structures for business features that provide clear boundaries, testability, and scale from simple CRUD to complex domain logic — regardless of application layer (Web API, MCP server, or both).

## Decision

**One universal feature structure in `server/src/features/`. Layer-specific files are optional add-ons, not separate patterns.**

Core principles:
1. All business logic lives in `src/features/<name>/` — never at `src/` root
2. Business logic lives in services, not in routing/registration code
3. Dependencies are injected, not imported as singletons
4. Zod validates at the boundary (HTTP request or MCP tool input)
5. Tests call business logic directly, not through transport layers

---

## Feature Module Structure

Every feature lives in `server/src/features/<name>/`:

```
server/src/features/<name>/
├── <name>.types.ts       # Domain-owned interfaces — the data model
├── <name>.service.ts     # Business logic, data access
├── <name>.tools.ts       # MCP tools (when MCP layer active)
├── <name>.module.ts      # Hono routes (when Web layer active)
├── <name>.schema.ts      # Zod input/output schemas
└── <name>.test.ts        # Tests
```

Not every feature needs every file. Skip what's not needed:
- Pure internal service (no external API surface) → skip handlers/module
- Simple schemas → inline in handlers/module, skip schema file
- No domain types → skip types file

But `<name>.types.ts` is always present when a feature defines data structures.

### File Responsibilities

| File | Contains | NEVER contains |
|---|---|---|
| `<name>.types.ts` | Interfaces and types produced/owned by this feature | Types from other features |
| `<name>.service.ts` | Business logic, data access, domain operations | Layer concerns (HTTP, MCP protocol) |
| `<name>.tools.ts` | MCP tool factory, calls service | Business logic, direct data access |
| `<name>.module.ts` | Hono route factory, calls service | Business logic, direct data access |
| `<name>.schema.ts` | Zod schemas for input validation at boundaries | Business logic, type definitions without Zod |
| `<name>.test.ts` | Tests for this feature's service and handlers | Tests for other features |

### File Naming

Files are prefixed with the feature name for IDE tab identification. Eight tabs named `service.ts` is useless — `orders.service.ts` and `users.service.ts` is navigable.

---

## Project Layout

```
server/src/
├── index.ts              # Composition root (MCP: registerTool, Web: app.route)
├── config.ts             # Configuration resolution
├── lib/                  # Domain-agnostic utilities only
│   ├── errors.ts         # Generic AppError class
│   └── mcp.ts            # Generic MCP response helpers
└── features/             # ALL business logic
    ├── orders/
    │   ├── orders.types.ts
    │   ├── orders.service.ts
    │   ├── orders.tools.ts       # MCP (optional)
    │   ├── orders.module.ts      # Web (optional)
    │   ├── orders.schema.ts
    │   └── orders.test.ts
    ├── payments/
    │   └── ...
    └── notifications/
        ├── notifications.service.ts   # Internal service — no handlers/module
        └── notifications.test.ts
```

Infrastructure (`index.ts`, `config.ts`, `lib/`) stays at `src/` root.
Business logic goes in `features/`. No exceptions.

---

## Service Pattern

Services contain all business logic. They are **classes** (with constructor DI) or **factory functions** (returning method objects):

```typescript
// features/orders/orders.service.ts
export class OrdersService {
  constructor(private db: PrismaClient) {}

  async list(status?: string) {
    return this.db.order.findMany({ where: status ? { status } : undefined });
  }

  async create(input: CreateOrderInput) {
    return this.db.order.create({ data: input });
  }
}
```

---

## Layer-Specific Entry Points

### MCP Handlers (when MCP layer active)

Handler files are **factory functions** returning MCP tool methods:

```typescript
// features/orders/orders.tools.ts
import type { OrdersService } from "./orders.service";
import type { McpToolResult } from "../../lib/mcp";

export function createOrderTools(service: OrdersService) {
  return {
    listOrders: async (args: { status?: string }): Promise<McpToolResult> => {
      const orders = await service.list(args.status);
      return { content: [{ type: "text", text: JSON.stringify(orders) }] };
    },
  };
}
```

Wired in composition root:
```typescript
// index.ts
import { OrdersService } from "./features/orders/orders.service";
import { createOrderTools } from "./features/orders/orders.tools";
import { ListOrdersSchema } from "./features/orders/orders.schema";

const ordersService = new OrdersService(db);
const orderTools = createOrderTools(ordersService);

server.registerTool("list_orders", {
  description: "List orders with optional status filter",
  inputSchema: ListOrdersSchema.shape,
}, orderTools.listOrders);
```

### Web Module (when Web layer active)

Module files are **factory functions** returning a Hono app:

```typescript
// features/orders/orders.module.ts
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { OrdersService } from "./orders.service";
import { createOrderSchema } from "./orders.schema";

export function createOrdersModule(service: OrdersService) {
  const app = new Hono();

  app.get("/", async (c) => {
    return c.json(await service.list());
  });

  app.post("/", zValidator("json", createOrderSchema), async (c) => {
    return c.json(await service.create(c.req.valid("json")), 201);
  });

  return app;
}
```

Wired in composition root:
```typescript
// app.ts
const ordersService = new OrdersService(prisma);
app.route("/api/v1/orders", createOrdersModule(ordersService));
```

### Both Layers

A feature can have both `<name>.tools.ts` and `<name>.module.ts` if it's exposed via MCP and HTTP simultaneously. The service is shared — both entry points call the same business logic.

---

## Module Sizing

**When to use a directory** (`features/<name>/`):
- 3+ handlers/endpoints
- Complex input schemas (unions, refinements, multiple schemas)
- Dedicated service layer with business logic separate from handlers
- Feature owns its own type definitions

**When a flat file is acceptable** (`features/<name>.ts`):
- 1-2 handlers with simple schemas, under ~200 lines total
- Rare in practice — default to a directory

**Rule:** if in doubt, use a directory. Promoting a flat file to a directory later forces import rewiring across every consumer. Starting with a directory costs one extra folder.

---

## Type Ownership

**Types belong in the feature that defines and produces them.**

- `Order`, `OrderItem` → `features/orders/orders.types.ts`
- `AuditEntry` → `features/audit/audit.types.ts`
- `AppError` → `lib/errors.ts` (generic utility)

**Rules:**
1. **No root-level dump files.** Do NOT create `src/types.ts` as a catch-all. Every type has an owner.
2. **YAGNI for types.** Do not pre-create types for features that don't exist yet.
3. **Re-export if needed.** If feature A's types are used by feature B, import from `../a/a.types.js` — or receive the data via DI (see Cross-Feature Dependencies).
4. **`<name>.types.ts` is the feature entry point for understanding.** Read it first to understand the data model.

---

## `lib/` Scope

`lib/` contains **domain-agnostic utilities only** — code with no knowledge of business concepts.

**Belongs in `lib/`:**
- `errors.ts` — generic AppError class
- `mcp.ts` — generic MCP response helpers
- `logger.ts` — logging setup
- `http.ts` — generic HTTP helpers

**Does NOT belong in `lib/`:**
- Parsers for domain-specific file formats → feature's `<name>.service.ts`
- Domain data loaders → feature's `<name>.service.ts`
- Business validation logic → feature's `<name>.service.ts`

**Test:** if the code references a business concept (order, user, invoice, report), it's not a library — it belongs in a feature's service.

---

## Cross-Feature Dependencies

**Features never import directly from each other's service or handlers.** Cross-feature communication flows through the composition root via dependency injection.

```typescript
// WRONG — reports reaches into orders
import { getRecentOrders } from "../orders/orders.service.js";

// RIGHT — reports declares what it needs, composition root provides it
export interface ReportDeps {
  getRecentOrders: (since: Date) => Promise<Order[]>;
}
export function createReportTools(service: ReportService, deps: ReportDeps) { ... }

// Composition root wires the dependency
const reportHandlers = createReportTools(reportService, {
  getRecentOrders: ordersService.getRecentOrders.bind(ordersService),
});
```

**Allowed cross-feature imports:**
- `<name>.types.ts` — type-only imports for shared data structures
- `lib/*` — available to all features

**Forbidden cross-feature imports:**
- `<name>.service.ts` — use DI through composition root
- `<name>.tools.ts` / `<name>.module.ts` — never

---

## Import Rules

All cross-boundary imports use path aliases (see ADR-S02 "Path Aliases"):

- **Within a feature:** relative imports — `./orders.service.js`, `./orders.types.js`
- **Cross-feature types:** `@features/orders/orders.types.js` — type-only OK
- **Cross-feature service/handlers:** FORBIDDEN (use DI via composition root)
- **lib imports:** `@lib/errors.js`, `@lib/mcp.js`
- **Config imports:** `@config/config.js`
- **No circular imports** between features
- **Never** use `../../` relative paths to reach lib, config, or another feature

---

## Adding a New Feature

1. Create `src/features/<name>/` directory
2. Write `<name>.types.ts` — domain interfaces (if the feature defines data structures)
3. Write `<name>.schema.ts` — Zod schemas for input validation
4. Write `<name>.service.ts` — business logic
5. Write `<name>.tools.ts` (MCP) and/or `<name>.module.ts` (Web) — layer entry points
6. Wire in composition root: create service, register handlers/mount routes
7. Write `<name>.test.ts` — tests

## Consequences

**Positive:**
- One pattern to learn — works for MCP, Web, or both
- Predictable file locations for humans and LLMs
- Clear separation: infrastructure at `src/` root, business logic in `features/`
- Prefixed filenames navigable in IDE tabs
- Types discoverable — always in `<name>.types.ts`
- Layer-specific files are optional — same service works for MCP, Web, or pure internal use
- No dump-all files that grow unboundedly

**Negative:**
- More files per feature than a single-file approach
- Prefix naming creates longer filenames

## Related

- ADR-TS-S01: Repository structure (multi-repo layer composition)
- ADR-S02: TypeScript project setup
