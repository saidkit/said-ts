# Changelog — said-ts

The releases of this TypeScript SAID starter, newest first. A cloned project records which release it is based on in its `## Lane` block (`SAID.version:`, the line under `SAID.lane:`); this file says what each release is. Versions follow [semver](https://semver.org/).

## said-ts@0.2.0 - 2026-11-04

- The `## Lane` block is stamped `said@0.26.0`: the lane passes the said upgrade checks up to that release.
- The task template carries the operator-question hold: the `**Blocked-on question:**` field and the `## Lifted holds` section, lifted only by a recorded ruling.
- `SAID.code-mount` is now the list key `SAID.mounts: [server/]`.
- Each earned rule ends with one link to its record.
- Prose no longer spells the surface key a second time.

## said-ts@0.1.0 - 2026-09-09

Initial versioned release of the **said-ts** TypeScript-core SAID starter.

- The `ADR-TS-S01..S05` spine (repository structure, TypeScript project setup, feature structure, pure service modules · dependency injection).
- The `server/` core: a Bun + Hono + Zod feature-based backend with an HTTP API layer (`app.ts`) and an MCP layer (`index.ts`), Prisma storage, and per-feature modules under `server/src/features/`.
- The `docs/` context spine (conventions, ADRs · feature specs) and the append-only task-log discipline.
- Full SAID surface-contract shape: 
  - `SAID.key:` lane block with `SAID.surface: api` + `SAID.reviewers: [api-schema]`, 
  - the `docs/ux/feature-ux-rules.md` representation registry, 
  - a per-feature `Surface:` field, 
  - and the `## Earned rules` contract with `SAID.profile: code`.
