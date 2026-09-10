# Surface-contract rules — `api` surface

<!-- SC-HEADER: feature-ux-rules · surface=api · token UXR-API-A1 · 6 rules
     Proof-of-load sentinel. A consumer LOADs this file WHOLE and echoes
     `UXR-API-A1 · 6 rules` before reasoning over it. token + count are both
     required; count is the number of `- **R-API-NN**` entries below.
     No token/count echoed → the consumer HALTs. Never grep/derive a single entry. -->

An `api` lane's shipped **surface** is its HTTP endpoints — their request/response schemas, error envelope, routing and status discipline. The `[api-schema]` reviewer (recipe-form, defined at the foot of this file) gates that surface: it observes the endpoints (`said-capture: http-call`) and judges conformance deterministically (`said-judge: oracle`) by re-running the endpoint test suite.
This file is the registry it reasons over. A consumer LOADs this file WHOLE and echoes the `SC-HEADER` token + count first (the **proof-of-load**), then reasons only over what it loaded.

Never grep a single row.

Per entry: `**id** — summary`, then `applies-to`. There is no `order` field — cheapest-first blast-radius ordering is implementer judgment.

- **R-API-01** — Input validation: every endpoint validates its request data (`param` / `json` / `query`) with a Zod schema via `zValidator`; the schema lives in `<feature>.schema.ts`. No unvalidated request data reaches a service.
  - applies-to: every endpoint
- **R-API-02** — Response serialization: a handler returns a domain object only through an explicit serializer that maps it to the wire shape — never a raw ORM/Prisma entity; dates render as ISO-8601 strings.
  - applies-to: every endpoint that returns a resource
- **R-API-03** — Uniform error envelope: a domain error is raised as the typed `AppError` (its factories set the HTTP status + a machine code) and rendered `{ error, code }` at that status; an unhandled error is the 500 `INTERNAL_ERROR` envelope. No ad-hoc error JSON.
  - applies-to: every endpoint + the global error handler
- **R-API-04** — Versioned routing + DI: feature routes mount under the versioned prefix `/api/v1/<feature>` via `app.route()`; a feature module is a factory function receiving its service (+ optional auth) — all wiring at the composition root (`app.ts` / `index.ts`), no imported singletons.
  - applies-to: every feature module + the composition root
- **R-API-05** — Status + auth discipline: read is `200`, create is `201` (returns the created resource), delete is `204` (empty body); a mutating verb (`POST` / `PUT` / `PATCH` / `DELETE`) sits behind the auth middleware unless the endpoint is explicitly public.
  - applies-to: every endpoint
- **R-API-06** — Surface-agnostic core: business logic lives in the surface-independent service + schema; the Web (Hono) and MCP layers are thin adapters over that one core, so a behavior is defined once and exposed per layer (a typed error carries both an HTTP status and a code for exactly this reason).
  - applies-to: every feature (service, Web module, MCP tools)

## The `api-schema` Checker — recipe-form instance

The reviewer this lane names in `SAID.reviewers:`. It is a **recipe-form** Checker (no agent file, no `SAID.checkers-dir:`): the reviewer gate indexes the `said-*` block below when invoked with `--recipe-rules docs/ux/feature-ux-rules.md`. Its capture is an HTTP call against the endpoints and its judge is an `oracle` — the deterministic `said-recompute` re-runs the endpoint test suite (which issues the requests and asserts each response against its Zod schema), so a fabricated PASS is caught.

```
said-checker:   api-schema
said-governs:   surface=api                 # fires on a feature that bears the api surface (per the feature `Surface:`)
said-capture:   http-call                   # requests issued against the endpoints by the test suite
said-judge:     oracle
said-recompute: cd server && make test       # bun test — endpoint tests assert responses against the Zod schemas; exit 0 = conformant
```

---

# Surface-contract rules — `mcp` surface

<!-- SC-HEADER: feature-ux-rules · surface=mcp · token UXR-MCP-M1 · 8 rules
     Proof-of-load sentinel. A consumer whose lane declares `SAID.surface: mcp`
     LOADs this file WHOLE and echoes `UXR-MCP-M1 · 8 rules` before reasoning over
     the mcp section. token + count are both required; count is the number of
     `- **R-MCP-NN**` entries below. No token/count echoed → the consumer HALTs.
     Never grep/derive a single entry. -->

This file carries **one section per surface** — `api` above, `mcp` here. A consuming lane declares one
`SAID.surface:` and echoes the token of **that** surface's `SC-HEADER` before reasoning over its rules
(the starter ships `surface: api`; a stdio tool-server deployment flips its own lane to `surface: mcp`).

An `mcp` lane's shipped **surface** is its MCP tools — their naming, input schema, result envelope, and
idempotency. The `mcp` reviewer (recipe-form, defined at the foot of this section) gates that surface by
re-running the tool test suite (`said-recompute: cd server && make test`). MCP tools are a **per-feature
optional layer** (`<feature>.tools.ts`) over the same service the HTTP layer uses — a behaviour is defined
once in the service and exposed per layer.

Per entry: `**id** — summary`, then `applies-to`. There is no `order` field — cheapest-first blast-radius
ordering is implementer judgment.

- **R-MCP-01** — Feature-factory: a feature's MCP layer is `create<Feature>Tools(service)` returning `{ method: async(args) => McpToolResult }`, wired from the composition root (`index.ts`).
  - applies-to: every feature's MCP layer
- **R-MCP-02** — Input schema: each tool has a Zod input schema whose `.shape` is passed to `registerTool`; the schema lives with the feature (`<feature>.schema.ts`).
  - applies-to: every tool
- **R-MCP-03** — Result envelope: a tool returns the `McpToolResult` envelope `{ content: [{ type: "text", text: <json> }], isError? }` via the shared `ok()` / `err()` helpers (`lib/mcp.ts`).
  - applies-to: every tool
- **R-MCP-04** — Errors returned, never thrown: a domain error is returned as a result with `isError: true` (via `err()`), **not** thrown — the inverse of the HTTP path, which throws `AppError` at a status. The single most MCP-specific rule.
  - applies-to: every tool
- **R-MCP-05** — Tool naming: `<namespace|feature>_<action>` (a server-namespace or feature prefix + the action), so tool names stay collision-free and self-describing.
  - applies-to: every registered tool
- **R-MCP-06** — Surface-agnostic core: the MCP tools are a thin adapter over the shared service + schema — no business logic in `<feature>.tools.ts`; the service is the one source of behaviour (the same rule the HTTP layer obeys).
  - applies-to: every feature (service · Web module · MCP tools)
- **R-MCP-07** — Deterministic recompute: a `bun test` suite exercises ≥1 tool (a `*.tools.test.ts` asserting the `ok()` envelope), so the mcp reviewer's `make test` recompute re-derives a real verdict rather than a nominal pass.
  - applies-to: the feature test suite
- **R-MCP-08** — Idempotency (mutating tools): a mutating tool (create / update / delete) guards duplicate application — a duplicate-id / already-exists check returns a domain error (`err()`), never a second write. A read-only query tool is idempotent by nature and needs no guard.
  - applies-to: mutating tools only

## The `mcp-schema` Checker — recipe-form instance

The reviewer an `mcp` lane names in `SAID.reviewers:`. It is a **recipe-form** Checker (no agent file, no
`SAID.checkers-dir:`): the reviewer gate indexes the `said-*` block below when invoked with
`--recipe-rules docs/ux/feature-ux-rules.md`. Its capture is a process-spawn (the stdio MCP server and its
tool suite) and its judge is an `oracle` — the deterministic `said-recompute` re-runs the tool test suite
(the `*.tools.test.ts` exercising each tool through the `ok()` envelope), so a fabricated PASS is caught.

A lane deploying said-ts as a stdio tool server declares `SAID.surface: mcp` + `SAID.reviewers: [mcp-schema]`;
a hosted deployment keeps `SAID.surface: api` + `[api-schema]`. The registry ships both, the lane picks one.

```
said-checker:   mcp-schema
said-governs:   surface=mcp                  # fires on a feature that bears the mcp surface (per the feature `Surface:`)
said-capture:   process-spawn                # the stdio MCP server + its tool test suite
said-judge:     oracle
said-recompute: cd server && make test        # bun test — the *.tools.test.ts exercise each tool through the ok() envelope; exit 0 = conformant
```
