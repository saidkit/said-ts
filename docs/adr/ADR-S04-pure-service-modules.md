# ADR-S04: Pure Service Modules for External APIs

**Date:** 2026-04-22
**Status:** Accepted

## Rule

**When a module wraps an external API (Google Sheets, Stripe, S3, etc.) but has no MCP tools or HTTP routes of its own** — create a pure service module in `features/`: no handlers, no module, no schemas.

## Directory Structure

```
features/<api-name>/
├── <api-name>.types.ts         # Client type alias, request/response shapes
├── <api-name>.service.ts       # All functions accept client as first param
└── <api-name>.test.ts          # Tests with mock client object
```

This is a standard feature directory (per ADR-S03) that happens to have no layer-specific entry point. It's not an exception — ADR-S03 says "not every feature needs every file."

## How to Write the Service

Every function takes the API client as its first parameter. Never create singletons.

```typescript
// features/storage/storage.service.ts

// Auth — returns a client, called once in composition root
export async function getStorageClient(credentialsPath: string): Promise<StorageClient> { ... }

// Operations — always receive client as first param
export async function uploadFile(
  client: StorageClient,
  bucket: string,
  key: string,
  data: Buffer,
): Promise<{ url: string }> { ... }

export async function listFiles(
  client: StorageClient,
  bucket: string,
  prefix: string,
): Promise<FileEntry[]> { ... }
```

## Fallback Wrapper

External APIs fail. Provide a typed fallback wrapper that catches only API errors:

```typescript
export async function withApiFallback<T>(
  apiOp: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<{ value: T; warning?: string }> {
  try {
    return { value: await apiOp() };
  } catch (e) {
    if (isExternalApiError(e)) {  // check e.code is numeric, e.errors is array, etc.
      const value = await fallback();
      return { value, warning: `API unavailable: ${e.message}. Used fallback.` };
    }
    throw e;  // non-API errors propagate
  }
}
```

**Error discrimination lives in the API module**, not in consumers. Check error shape (numeric `code`, `errors` array), not message strings.

## How Consumers Use It (via DI)

Consumers declare deps matching the service signatures. Composition root wires them. See ADR-S05.

```typescript
// features/uploads/uploads.tools.ts — declares what it needs
export interface UploadDeps {
  getStorageClient: (credentialsPath: string) => Promise<StorageClient>;
  uploadFile: (client: StorageClient, ...) => Promise<{ url: string }>;
  withStorageFallback: <T>(op: () => Promise<T>, fb: () => Promise<T>) => Promise<{ value: T; warning?: string }>;
}

// index.ts — wires real implementations
import { getStorageClient, uploadFile, withStorageFallback } from "./features/storage/storage.service.js";
const uploads = createUploadTools(config, { getStorageClient, uploadFile, withStorageFallback });
```

## How to Test

Pass a mock client object — no HTTP calls:

```typescript
function makeMockClient(): StorageClient {
  return {
    upload: mock(() => Promise.resolve({ url: "https://..." })),
    list: mock(() => Promise.resolve([])),
  } as unknown as StorageClient;
}

it("uploads file", async () => {
  const client = makeMockClient();
  const result = await uploadFile(client, "bucket", "key", Buffer.from("data"));
  expect(result.url).toBeDefined();
  expect(client.upload).toHaveBeenCalledTimes(1);
});
```

## DO / DON'T

| DO | DON'T |
|----|-------|
| Accept client as first param | Create singleton clients |
| Export `isExternalApiError` for consumers that need it | Catch errors by message string |
| Keep all API-specific logic in the service module | Leak API response shapes into handler code |
| Type-only imports from `<name>.types.ts` cross-module | Import `<name>.service.ts` from consuming handlers |

## Related

- ADR-S03 (feature structure — pure service modules are features without handlers)
- ADR-S05 (DI mechanics — how consumers wire these services)
