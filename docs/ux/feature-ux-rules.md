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
