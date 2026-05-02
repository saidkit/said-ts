# Claude.md - AI Development Guide

## Project Overview
**Project**: SAID-ts - Smart AI Development for TypeScript
**Vision**: Generic boilerplate for AI-native TypeScript development with structured workflows
**Architecture**: Composable layers — Core (Bun + Zod + Biome) + optional: Web, MCP, Storage, External API, Skills

**Stackable layers**: Other layers (e.g., a frontend SPA) may be added as sibling directories with their own `CLAUDE.md`. Each stacked layer is fully self-contained — see that directory's `CLAUDE.md` when working there.

## Quick Start
```bash
@CLAUDE.md                         # Start with this file only
# Then load context progressively based on task
```

## Implementation References (Check BEFORE changing code)

| Creating/Changing...        | Read First                                    |
|-----------------------------|-----------------------------------------------|
| Project structure           | `@docs/adr/ADR-S01-monorepo-structure.md`     |
| TS setup / frameworks       | `@docs/adr/ADR-S02-typescript-project-setup.md` |
| New business feature        | `@docs/adr/ADR-S03-feature-structure.md`      |
| External API wrappers       | `@docs/adr/ADR-S04-pure-service-modules.md`   |
| DI: deps, mocks, stubs      | `@docs/adr/ADR-S05-dependency-injection.md`    |
| Feature spec                | `@docs/features/template.md`                  |

## Context Loading Strategy

### Progressive Context Loading
**Start Light -> Add as Needed -> Stay Under 50k tokens**

#### 1. **Session Start** (Always)
```bash
@CLAUDE.md                         # This guide (required)
```

#### 2. **Add Context by Task Type**
```bash
# Code Review/Understanding
+ @docs/conventions.md

# Feature Development
+ @docs/conventions.md + @docs/features/FEAT-XXX-name.md

# New Feature Creation
+ @docs/conventions.md + @docs/adr/ADR-S03-feature-structure.md + @docs/features/template.md

# Architecture Work
+ @docs/vision.md + @docs/adr/
```

#### 3. **Load Implementation Files** (Only when editing)
```bash
# Feature work
+ @server/src/features/xxx/

# Infrastructure
+ @server/src/lib/ + @server/src/middleware/
```

> **Stacked layers** (e.g., `ui/`): If working in a sibling layer directory, use that layer's `CLAUDE.md` as the entry point instead.

## File Structure
```
docs/
├── idea.md                # Business context (why)
├── vision.md              # Technical architecture (what)
├── conventions.md         # Code patterns (how)
├── features/
│   ├── README.md          # Feature structure reference
│   ├── template.md        # Feature template
│   └── FEAT-XXX-name.md   # Feature specs
└── adr/
    └── ADR-XXX-topic.md   # Architecture decisions
```

## Navigation Map

| Type              | Location                          | Load When                    |
|-------------------|-----------------------------------|------------------------------|
| Features          | `docs/features/FEAT-XXX-name.md` | Working on that feature      |
| Feature code      | `server/src/features/<name>/`     | Editing feature code         |
| Infrastructure    | `server/src/lib/`                 | Editing shared libraries     |
| Configuration     | `server/src/config/`              | Editing config resolution    |
| Middleware        | `server/src/middleware/`          | Web layer: editing middleware |
| Database schema   | `server/prisma/schema.prisma`     | Storage DB layer: changing data model |
| Tests             | Alongside code (`*.test.ts`)      | Writing/debugging tests      |
| ADRs              | `docs/adr/ADR-XXX-topic.md`      | Making architectural decisions |

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
4. **Implement** - Follow conventions.md
5. **Test** - Verify functionality
6. **Update** - Update feature progress
7. **Commit** - Save to branch (only when asked)

## Core Principles
- **Context Efficiency** - Load only what you need
- **KISS** - Simple solutions over complex
- **MVP First** - Working version, then improve
- **Test Everything** - Untested code is broken code
- **Type Safety** - Zod schemas for runtime validation, TypeScript for compile-time

## Claude Code Reminders
- **Context Management**: Start with @CLAUDE.md only, add incrementally
- **File Loading**: Only load files you're actively editing
- **Quality Gates**: Always run `cd server && make format && make typecheck` before marking complete
- **Commit Policy**: NEVER commit without explicit user request
- **Read First**: Always read files before editing them
- **Diagrams**: Use Mermaid or nested outlines - NEVER ASCII art/pseudographics

## Task Log Rules (FEAT-XXX.tasks.md)

**CRITICAL: Task logs are append-only historical records.**

- **NEVER overwrite or strip detail** from existing task entries. Task logs serve as the backtracking reference for what was decided, why, and what happened during implementation.
- **When updating task status**: Change only `Status:` line and add/update the `### Fix` section. Do NOT rewrite the `### Problem` or `### Approach` sections — they capture the original plan. You may add `### Implementation` section to save implementation nuances or lessons learned.
- **When adding new tasks**: Append new `## FXXX-NNN` sections at the end. Never reorganize or renumber existing tasks.
- **Fix sections**: Document what was actually done, including deviations from the approach, bugs found, and outcomes. This is the implementation record.
- **Keep all detail**: Source file lists, line counts, adaptation notes, decisions, trade-offs — all of this is historical context that future sessions need to understand why things were done a certain way.

## Diagram Rules

IMPORTANT: NEVER use ASCII/Unicode box-drawing characters for diagrams.
Use instead:
1. **Mermaid** (preferred for complex flows)
2. **Nested outlines** (simpler alternative)

## Critical Rule: Dependency Injection

**All dependencies flow through the composition root (entry point file).**

Services receive dependencies via constructor injection. Modules are factory functions.
Never import singletons directly — always pass through the composition root.

- **Web layer**: composition root is `app.ts` via `createApp()`
- **MCP layer**: composition root is `index.ts` where services are created and tools registered

## Quality Gates
Before marking complete:
- [ ] Tests pass (`cd server && make test`)
- [ ] Code formatted (`cd server && make format`)
- [ ] Type-check passes (`cd server && make typecheck`)
- [ ] Feature spec updated (if applicable)
- [ ] No merge conflicts

---

**Usage Philosophy**: Start minimal, expand thoughtfully, clean up regularly.
