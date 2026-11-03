# Claude.md - SAID-ts Development Guide

## Lane

Single lane — this project is one lane. Every path below is relative to this lane's root.

- SAID.lane:         said-ts
- SAID.version:      said-ts@0.1.0
- SAID.docs-root:    docs/
- SAID.code-mount:   server/
- SAID.feature-spec: docs/features/<id>.md
- SAID.task-log:     docs/features/<id>.tasks.md
- SAID.working:      docs/working/<id>/
- SAID.id-shape:     <FEAT><NN>-TS-<NN>
- SAID.adr-prefix:   ADR-TS-*
- SAID.surface:      api
- SAID.reviewers:    [api-schema]
- SAID.commands:     cd server && make pre-commit
- SAID.profile:      code

A **lane** is a tree that owns a full SAID cycle. Single-lane work is `said!`; `flow!` is for a feature spanning **two or more task logs**. A stacked layer (e.g. a frontend SPA in a sibling directory) is a separate lane with its own `CLAUDE.md`.

## Project Overview
**Project**: SAID-ts - Structured AI Delivery for TypeScript
**Vision**: Generic boilerplate for AI-native TypeScript development with structured workflows
**Architecture**: Composable layers - Core (Bun + Zod + Biome) + optional: Web, MCP, Storage, External API, Skills

**Composability**: Other layers (e.g., a frontend SPA) may be added as sibling directories with their own `CLAUDE.md`. Each stacked layer is fully self-contained - see that directory's `CLAUDE.md` when working there.

### The dual layer: one service, HTTP and/or MCP

A feature's business logic lives once in `<name>.service.ts` (+ `<name>.schema.ts`). The delivery layers are **optional adapters over that one service**, added per feature:

- **`<name>.module.ts`** — the HTTP layer (Hono routes, mounted under `/api/v1/<feature>`).
- **`<name>.tools.ts`** — the MCP layer (a `create<Feature>Tools(service)` factory whose methods wrap the service result in `ok()` / `err()` from `lib/mcp.ts`).

`features/health/` is the exemplar — it ships **both** adapters over one `health.service.ts`; `features/users/` ships **only** the HTTP module. A feature adds the MCP layer without duplicating the core; a behaviour is defined once and exposed per layer.

### Surface pick at roll time (SAID)

Which `SAID.surface:` a deploying project declares is a **deployment-topology** choice, not an architecture one:

- **Hosted server** (an HTTP API, optionally MCP-over-HTTP on the same transport) → `SAID.surface: api`, gated by the `api-schema` Checker (`http-call` capture) in `docs/ux/feature-ux-rules.md`.
- **Local tool server** (stdio MCP the client spawns) → `SAID.surface: mcp`, gated by the `mcp-schema` Checker (`process-spawn` capture) in the registry's `mcp` section.

**This starter ships `SAID.surface: api`** (see the `## Lane` block) — that stays as the default. A project that deploys said-ts as a stdio tool server flips its own lane to `surface: mcp` / `reviewers: [mcp-schema]`; a hosted deployment keeps `api`. Either way the registry ships both rule sets and both Checkers, so the consumer picks without re-authoring the contract.

## Quick Start
Start with **this file only**. Then load deeper context by task - see **Implementation References** (what to read before changing code) and **Context Loading** (what to load, when).

## Implementation References (Check BEFORE changing code)

| Creating/Changing...                        | Read First                                        |
|---------------------------------------------|---------------------------------------------------|
| Project structure                           | `docs/adr/ADR-TS-S01-repository-structure.md`     |
| TS setup / frameworks                       | `docs/adr/ADR-TS-S02-typescript-project-setup.md` |
| New business feature                        | `docs/adr/ADR-TS-S03-feature-structure.md`        |
| External API wrappers                       | `docs/adr/ADR-TS-S04-pure-service-modules.md`     |
| DI: deps, mocks, stubs                      | `docs/adr/ADR-TS-S05-dependency-injection.md`     |
| Coding conventions (how-to, code patterns)  | `docs/conventions.md`                             |
| Architecture overview                       | `docs/vision.md`                                  |
| Feature spec template                       | `docs/features/template.md`                       |

## Context Loading Strategy

**Start light → add as needed → keep the working set lean (< ~50k tokens).**
When this starter is stacked under a root orchestrator, the root owns progressive loading - trim this to a pointer.

**1. Session start (always):** this guide.

**2. Add by task type:**
- Code review / understanding → `docs/conventions.md`
- Feature development → `docs/conventions.md` + `docs/features/FEAT-XXX-name.md`
- New feature → `docs/conventions.md` + `ADR-TS-S03` + `docs/features/template.md`
- Architecture → `docs/vision.md` + `docs/idea.md` + `docs/adr/`

**3. Load implementation files (only when editing):**
- Feature work → `server/src/features/xxx/`
- Infrastructure → `server/src/lib/` + `server/src/middleware/`

## File Structure
```
docs/
├── idea.md                  # Business context (why)
├── vision.md                # Technical architecture (what)
├── conventions.md           # Code patterns (how)
├── features/
│   ├── README.md            # Feature structure reference
│   ├── template.md          # Feature template
│   └── FEAT-XXX-name.md     # Feature specs
└── adr/
    └── ADR-TS-XXX-topic.md  # Architecture decisions
```

## Navigation Map

| Type              | Location                         | Load When                             |
|-------------------|----------------------------------|---------------------------------------|
| Feature specs     | `docs/features/FEAT-XXX-name.md` | working on that feature               |
| Feature code      | `server/src/features/<name>/`    | building a feature                  |
| Infrastructure    | `server/src/lib/`                | editing shared libraries              |
| Configuration     | `server/src/config/`             | editing config resolution             |
| Middleware        | `server/src/middleware/`         | web layer: editing middleware         |
| Database schema   | `server/prisma/schema.prisma`    | storage DB layer: changing data model |
| Tests             | Alongside code (`*.test.ts`)     | writing/debugging tests               |
| ADRs              | `docs/adr/ADR-TS-XXX-topic.md`   | an architectural decision             |

## Development Commands

All commands run from `server/` directory:

```bash
cd server && make dev            # Start dev server (Web) or MCP server
cd server && make test           # Run all tests
cd server && make format         # Format code (Biome)
cd server && make lint           # Lint code (Biome)
cd server && make typecheck      # Type-check (tsc --noEmit, catches deprecations)
cd server && make db-studio      # Storage DB layer: Open Prisma Studio
```

## Workflow Process
1. **Analyze** - Understand the task (load minimal context)
2. **Plan** - Propose implementation (add relevant context)
3. **Wait** - Get approval before coding
4. **Implement** - Follow `docs/conventions.md`
5. **Test** - Verify functionality
6. **Update** - Update feature progress
7. **Commit** - Save to branch (only when asked)

## SAID workflow - the `said:` plugin
This template is the **context spine** (`docs/conventions.md`, `docs/adr/`, `docs/features/`, `docs/wokring/`); the **`said:` plugin** drives the phases *over* that spine. Each command reads/writes the specific part of the context - invoke the phase you're in.

- **Triage** (find where a bug/behavior lives) → `/said:triage`
- **Phase 1 - Scope** → `/said:scope-refine` (from a handoff / current branch) or `/said:scope-grill` (ideate a thin idea) → writes `docs/working/<feature>/scope.md`
- **Phase 1.5 - Spec TOC** → `/said:uxtoc` (descriptive outline of a UX spec, for fast iteration)
- **Phase 2 - Architect** → `/said:architect` (`scope.md` → `docs/features/SRV-XX-*.md` + `SRV-XX.tasks.md`); `/said:add-task` to append a task discovered mid-flight
- **Phase 3 - Implement** → `/said:impl` (drive a task `Todo → Done` under TDD); `/said:review-ux` (per-task UX gate for web/UI)
- **Phase 3.5 - Verify** → `/said:review-qa` (quality gates + `### Fix` integrity) then `/said:accept` (acceptance-criteria contract)
- **Phase 4 - Debrief** → `/said:debrief` (feature retro; backport lessons into `docs/adr/` + `docs/conventions.md`)

The **Workflow Process** above is the lightweight per-change loop; the `said:` phases are the full feature lifecycle. Both land in the same spine.

## Significant ADRs (skill-referenced)

The `said:` skills refer to STARTER ADRs by descriptive shortname so the skill text stays project-agnostic. This table binds shortname → this lane's concrete ADR file. Update when a referenced ADR is renamed or renumbered.

| Skill shortname | This project's ADR file | Consumed by |
|---|---|---|
| feature-structure-ADR | `docs/adr/ADR-TS-S03-feature-structure.md` | `/said:impl` |
| service-adapter-ADR | `docs/adr/ADR-TS-S05-dependency-injection.md` | `/said:impl` |
| earn-its-place-ADR | — not yet promoted; the threshold is stated in `docs/adr/README.md` | `/said:review-qa`, `/said:debrief` |

`service-adapter-ADR` companion: `docs/adr/ADR-TS-S04-pure-service-modules.md` defines the external-API wrapper shape; S05 carries the injection/mocking discipline the skills actually cite (mock services are runtime-selected production code — tests wire deps at the composition root, **never** `vi.mock()`).

A task's `Refs:` line may cite either the shortname or the ADR path — `/said:review-qa` matches both against `docs/qa/feature-qa-checklist.md`. That checklist does not exist in this starter, so `Refs:` cites currently surface as WARN (operator-verify) rather than mechanical PASS/FAIL; the mechanical gates come from **Quality Gates** below (`R-GATE-*`).

## Core Principles
- **Context Efficiency** - Load only what you need
- **KISS** - Simple solutions over complex
- **MVP First** - Working version, then improve
- **Test Everything** - Untested code is broken code
- **Type Safety** - Zod schemas for runtime validation, TypeScript for compile-time

## Claude Code Reminders
- **Before each implementation step, re-read `## Earned rules` and name the ids you apply.**
- **Context Management**: Start with this guide only, add incrementally
- **File Loading**: Only load files you're actively editing
- **Quality Gates**: Always run `cd server && make format && make typecheck` before marking complete
- **Commit Policy**: NEVER commit without explicit user request
- **Read First**: Always read files before editing them
- **Diagrams**: Use Mermaid or nested outlines - NEVER ASCII art/pseudographics
- **Markdown**: one line per paragraph; bullets one line each; no hard-wrap; prefer lists over tables - use tables only when necessary

## Task Log Rules (FEAT-XXX.tasks.md)
**CRITICAL: Task logs are append-only historical records.** Authoring discipline + close-of-task review live in `docs/features/template-tasks.md` - canonical source. Read it before writing or closing any task entry.

Critical rules (full set in template-tasks.md):
- **NEVER overwrite or strip detail** from existing entries
- **New tasks get new IDs** appended at the end (no mid-task amendments)
- **`### Fix` = one verification line** + optional one-liners (spec edits, working artifacts) - never `**Files added:**` blocks; files are derivable from `git log --name-only`
- **When updating status**: change only `Status:` line; add/update `### Fix`, optionally `### Deviations` and `### Gotchas`. You may add `### Implementation` section to save implementation nuances or lessons learned.
- **When adding new tasks**: Append new `## FEATXX-TS-NN` sections at the end. Never reorganize or renumber existing tasks.
- **Fix sections**: Document what was actually done, including deviations from the approach, bugs found, and outcomes. This is the implementation record.
- **Keep all detail**: Source file lists, line counts, adaptation notes, decisions, trade-offs - all of this is historical context that future sessions need to understand why things were done a certain way.

## Documentation Rules
IMPORTANT: NEVER use ASCII/Unicode box-drawing characters for diagrams.
Use instead:
1. **Mermaid** (preferred for complex flows)
2. **Nested outlines** (simpler alternative)

## Quality Gates
Before marking complete:
- [ ] `make test` pass - R-GATE-TEST
- [ ] `make typecheck` clean - R-GATE-TYPECHECK
- [ ] `make lint` clean - R-GATE-LINT
- [ ] `make format` clean - R-GATE-FORMAT
- [ ] `make build` succeeds - R-GATE-BUILD
- [ ] Feature / task log updated
- [ ] No merge conflicts

---

**Usage Philosophy**: Start minimal, expand thoughtfully, clean up regularly.

---

## Earned rules (full context in linked ADR)
- **R-TS-01** — Dependency injection: all dependencies flow through the composition root (entry-point file) → ADR-TS-S05-dependency-injection.md
- **R-TS-02** — Services receive dependencies via constructor injection; modules are factory functions → ADR-TS-S05-dependency-injection.md
- **R-TS-03** — Never import singletons directly — always pass through the composition root → ADR-TS-S05-dependency-injection.md
- **R-TS-04** — Web layer: composition root is `app.ts` via `createApp()` → ADR-TS-S05-dependency-injection.md
- **R-TS-05** — MCP layer: composition root is `index.ts`, where services are created and tools registered → ADR-TS-S05-dependency-injection.md


<!-- PROJECT-SPECIFIC SECTION - intentionally empty in the said-ts starter.
     A consuming app appends its Route Map / Data model / Key Files here
     (Model A: one file = template + project section). -->
