# ADR-TS-S01: Repository Structure

**Date:** 2026-04-22
**Revised:** 2026-07-28 — decision label corrected from "monorepo" to multi-repo composition; the prescribed layout was already multi-repo, only the label and rationale were wrong.
**Status:** Accepted
**Deciders:** Development Team

## Problem

Choose the repository structure for a TypeScript application composed of layers: a server (Web API and/or MCP server), its context docs, and optionally stacked layers such as a frontend SPA.

**Context:**
- Single developer / small team environment.
- said-ts ships as a **clonable starter** — whatever layout this ADR prescribes is inherited by every downstream project.
- Stacked layers are themselves self-contained templates: the SPA layer must stack onto backends written in any language, not only TypeScript.
- Layers share no code at runtime — the only cross-layer contract is the HTTP API.
- Context budget matters: each layer's `CLAUDE.md` and `docs/` must load independently, without dragging in sibling layers.

## Decision

**Chosen Option:** Multi-repo composition — one repository per layer, co-located as sibling directories inside one working directory.

**Why:** Layers version, test, and deploy independently, each carrying its own tooling and context spine. A stacked layer stays droppable onto a backend in any language. A workspace monorepo would require a JavaScript root on both sides and forfeit that.

**What this repository is:** said-ts is a **single-layer repository** — `server/` (one deployable app) plus `docs/` (its context spine). It is not a monorepo: no workspace root, no shared lockfile, no second package.

## Alternatives Considered

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Multi-repo composition (siblings) | Independent versioning and deploy; layers stack onto any backend; per-layer context loads in isolation; imposes nothing on downstream clones | Tooling duplicated per layer; no atomic cross-layer commit; contract types need codegen to stay in sync | **Chosen** |
| Workspace monorepo (bun/npm workspaces + Turbo/Nx) | Atomic cross-layer commits; shared types via a contract package; one install | Requires JS on both sides — kills polyglot stacking; forces a workspace root onto every downstream project; pulls AI context toward a shared root | Rejected |
| Git submodules | Pins layer versions; single clone command | Poor day-to-day DX (detached HEADs, easy-to-miss updates); submodule ceremony leaks into every workflow | Rejected |

## Implementation

### Composition Rules

1. **One repo per layer.** Each layer is a complete project: its own `package.json`, lockfile, `Makefile`, formatter config, `CLAUDE.md`, and `docs/`.
2. **Layers are siblings, not members.** A stacked layer is cloned into a subdirectory of the base repo — never added as a workspace member or a submodule.
3. **No cross-layer imports.** Nothing in a stacked layer's `src/` reaches into another layer's `src/`. Relative paths never escape a layer root.
4. **The HTTP API is the only cross-layer contract**, described by `api/openapi.yaml`.
5. **Stacked layer directories are ignored by the base repo.** Add each to the base `.gitignore` so `git status` stays clean.

### Project Layout

The base repo owns the working-directory root; stacked layers live beneath it, untracked.

- `project/` — working directory; the **base repo** root
  - `server/` — application code (this repo's deployable): `src/`, `package.json`, `tsconfig.json`
  - `docs/` — AI development context (SAID-ts)
    - `idea.md` — business context (why)
    - `vision.md` — technical architecture (what)
    - `conventions.md` — code patterns (how)
    - `features/` — feature specs + task logs
    - `adr/` — architecture decisions
    - `working/` — session-specific context
  - `api/openapi.yaml` — HTTP contract, generated from server Zod schemas
  - `CLAUDE.md` — AI development guide (entry point)
  - `README.md` — project README
  - `web/` — **stacked layer**, separate repo, gitignored here (optional)

### Layer-Specific Additions

When the **Web** layer is active, `server/` adds:
- `src/app.ts` — composition root (Hono)
- `src/features/<name>/` — `<name>.module.ts`, `<name>.service.ts`, `<name>.schema.ts`, `<name>.test.ts`
- `src/lib/` — domain-agnostic utilities
- `src/middleware/` — Hono middleware
- `prisma/` — database schema + migrations (if Storage: DB)
- `Dockerfile` — container build (if Deployment)

When the **MCP** layer is active, `server/` adds:
- `src/index.ts` — composition root (McpServer)
- `src/config/` — configuration resolution
- `src/lib/` — domain-agnostic utilities
- `src/features/<name>/` — `<name>.tools.ts`, `<name>.service.ts`, `<name>.schema.ts`, `<name>.test.ts`
- `<name>.config.json` — MCP-specific config

When the **MCP Skills** layer is active:
- `.claude/commands/<skill>.md` — Claude Code slash commands

### The Contract Seam

Multi-repo means the server's types are not importable by a stacked layer. The seam is generated, not hand-mirrored:

1. The server owns the contract — Zod schemas are the single source of truth.
2. `@hono/zod-openapi` (see ADR-TS-S02) emits `api/openapi.yaml` from those schemas.
3. A stacked layer generates its request/response types from that file (e.g. `openapi-typescript`) — it never retypes them by hand.

**Ordering for a breaking API change:** land the server change and regenerate `api/openapi.yaml` first, then update the stacked layer against the new contract. There is no atomic cross-layer commit; the contract file is the handoff.

**Starter status:** the starter ships the seam but not the codegen wiring. Wire step 3 in the consuming project — see Consequences.

### Documentation Ownership

When creating or placing documentation, follow these rules:

- **ADRs** → `docs/adr/` — base-repo (server) architectural decisions
- **Feature specs** → `docs/features/` — feature descriptions and acceptance criteria
- **Conventions** → `docs/conventions.md` — server coding patterns
- **Vision, idea** → `docs/` — project-level context

**Stacked layers** (e.g. a frontend SPA cloned as `web/`): each is fully self-contained with its own `CLAUDE.md`, `docs/adr/`, `docs/conventions.md`, `docs/features/`. The base repo does not document layer specifics — refer to the stacked layer's `CLAUDE.md` when working there.

**Context loading rule:** server work → load `@CLAUDE.md` + `@docs/`. Stacked-layer work → `cd <layer>/` and load that layer's `CLAUDE.md`. Never duplicate content between base and stacked layers.

### Action Items

- [x] Structure the base repo as a single layer — `server/` + `docs/`
- [x] Set up the context system (SAID-ts) in `docs/`
- [x] Create `CLAUDE.md` as the AI development entry point
- [ ] Add stacked layer directories to the base `.gitignore` when a layer is stacked
- [ ] Wire OpenAPI codegen across the contract seam in consuming projects

## Consequences

**Positive:**
- Layers version, test, and deploy independently — one layer's release does not gate another's.
- A stacked layer drops onto any backend, TypeScript or not.
- Each layer's context spine loads on its own, keeping the AI working set small.
- No workspace tooling is imposed on downstream clones of this starter.

**Negative:**
- Tooling is duplicated per layer (Makefile, formatter config, lockfile) and can drift.
- No atomic cross-layer commit — an API change spans two repos and must be ordered.
- **Contract types are duplicated unless codegen is wired.** This is the real cost of the choice; the Contract Seam section is the mitigation, and it is unwired in the starter.
- Full setup is N clones, not one.

**Monitoring:**
- No import crosses a layer boundary — a search for parent-relative paths escaping a layer root returns nothing.
- `api/openapi.yaml` is regenerated whenever server routes or schemas change.
- Each layer's quality gates run green from its own directory, with no root-level orchestration.

## Related

**ADRs:** ADR-TS-S02 (stack choices; `@hono/zod-openapi` supplies the contract seam) · ADR-TS-S03 (feature structure within a layer)
