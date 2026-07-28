# ADR-S05: Dependency Injection

**Date:** 2026-04-22
**Status:** Accepted

## Rule

All cross-feature dependencies flow through the composition root (`index.ts` / `app.ts`). Features declare what they need. The entry point wires implementations. Tests wire mocks.

## 1. Declare Deps

Every handler factory that needs functions from other features declares a `Deps` interface:

```typescript
// features/reports/reports.tools.ts
export interface ReportDeps {
  // from features/orders/orders.service.ts
  getRecentOrders: (since: Date) => Promise<Order[]>;
  // from features/storage/storage.service.ts
  getStorageClient: (credentialsPath: string) => Promise<StorageClient>;
  // from future feature (stub for now)
  sendNotification: (to: string, message: string) => Promise<void>;
}

export function createReportTools(service: ReportService, deps: ReportDeps) {
  return {
    generateReport: async (args) => { /* use deps.getRecentOrders(...) */ },
  };
}
```

**Where `Deps` lives:** In the handler file, next to the factory. Not in `<name>.types.ts` — it's this feature's contract, not a shared type.

## 2. Wire in Composition Root

The entry point is the ONLY file that imports from multiple feature services:

```typescript
// index.ts
import { OrdersService } from "./features/orders/orders.service.js";
import { getStorageClient } from "./features/storage/storage.service.js";
import { ReportService } from "./features/reports/reports.service.js";
import { createReportTools } from "./features/reports/reports.tools.js";

const ordersService = new OrdersService(config);
const reportService = new ReportService(config);

const reports = createReportTools(reportService, {
  getRecentOrders: ordersService.getRecentOrders.bind(ordersService),
  getStorageClient,
  sendNotification: async () => {},  // stub — see section 4
});

server.registerTool("generate_report", { ... }, reports.generateReport);
```

## 3. Test with Mocks

Create handlers with mock deps. No transport, no HTTP — just function calls:

```typescript
function makeMockDeps(): Parameters<typeof createReportTools>[1] {
  return {
    getRecentOrders: mock(async () => [makeOrder("ORD-001")]),
    getStorageClient: mock(async () => ({} as StorageClient)),
    sendNotification: mock(async () => {}),
  };
}

it("generateReport returns file path", async () => {
  const service = new ReportService(testConfig);
  const handlers = createReportTools(service, makeMockDeps());
  const result = await handlers.generateReport({ month: "2026-04" });
  const data = JSON.parse(result.content[0].text);
  expect(data.reportPath).toBeDefined();
});
```

**Key pattern:** `Parameters<typeof createReportTools>[1]` as the return type of `makeMockDeps` — TypeScript enforces every dep is provided.

## 4. Stub Missing Deps

When a dep doesn't exist yet, write a no-op stub in the composition root:

```typescript
// index.ts
const sendNotification = async (_to: string, _msg: string): Promise<void> => {};
// TODO: replace with real import when notifications feature ships
```

When the real feature ships: delete stub, add import. Zero changes to consumers.

## 5. When NOT to Use DI

- Feature has no cross-feature deps (only uses `config` + own service) → skip `Deps`, just pass `config` or `service`
- Function is domain-agnostic utility (`lib/errors.ts`, `lib/mcp.ts`) → import directly, no DI needed

## DO / DON'T

| DO | DON'T |
|----|-------|
| Declare `Deps` interface in handler file | Put deps in `<name>.types.ts` |
| Wire everything in `index.ts` / `app.ts` | Import another feature's `service.ts` from handlers |
| Use `mock()` from `bun:test` for assertable deps | Build complex mock frameworks |
| Use `Parameters<typeof factory>[1]` for mock type | Manually type mock objects |
| Import `<name>.types.ts` cross-feature (type-only) | Import `<name>.service.ts` or `<name>.tools.ts` cross-feature |
| Stub missing deps as inline no-ops in composition root | Use feature flags or placeholder modules |
| Pass `config`/`service` alone when no cross-feature deps | Add empty `Deps` interface for consistency |

## Allowed Cross-Feature Imports

```
<name>.tools.ts  → own service, own schemas, own types, lib/*
<name>.module.ts    → own service, own schemas, own types, lib/*
<name>.service.ts   → own types, lib/*
<name>.schema.ts    → zod only
<name>.test.ts      → anything (but prefer DI pattern for handler tests)
index.ts / app.ts   → everything (composition root)

Cross-feature: <name>.types.ts only (type-only imports)
Cross-feature: <name>.service.ts, <name>.tools.ts → FORBIDDEN (use DI)
```

## Related

- ADR-S03 (declares DI principle and cross-feature rules — this ADR explains the mechanics)
- ADR-S04 (external API modules — follows the same DI pattern)
