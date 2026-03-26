# Claude.md - AI Development Guide

## Project Overview
**Project**: Smart AI Development Template (TypeScript)
**Vision**: Boilerplate for AI-assisted development with structured workflows
**Architecture**: Monorepo (Bun + Hono + Prisma) with feature-based development

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
| Features          | `docs/features/FEAT-XXX-name.md`  | Working on that feature      |
| Feature code      | `server/src/features/xxx/`        | Editing feature code         |
| Infrastructure    | `server/src/lib/`                 | Editing shared libraries     |
| Middleware        | `server/src/middleware/`          | Editing middleware           |
| Database schema   | `server/prisma/schema.prisma`     | Changing data model          |
| Tests             | Alongside code (`*.test.ts`)      | Writing/debugging tests      |
| ADRs              | `docs/adr/ADR-XXX-topic.md`       | Making architectural decisions |

## Development Commands
```bash
make dev                   # Start development server (hot reload)
make test                  # Run all tests
make format                # Format code
make lint                  # Lint code
make db-studio             # Open Prisma Studio
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
- **Quality Gates**: Always run `make format` before marking complete
- **Commit Policy**: NEVER commit without explicit user request
- **Read First**: Always read files before editing them
- **Diagrams**: Use Mermaid or nested outlines - NEVER ASCII art/pseudographics

## Diagram Rules

IMPORTANT: NEVER use ASCII/Unicode box-drawing characters for diagrams.
Use instead:
1. **Mermaid** (preferred for complex flows)
2. **Nested outlines** (simpler alternative)

## Critical Rule: Dependency Injection

**All dependencies flow through the composition root (`app.ts`).**

Services receive dependencies via constructor injection. Modules are factory functions.
Never import singletons directly — always pass through `createApp()`.

## Quality Gates
Before marking complete:
- [ ] Tests pass (`make test`)
- [ ] Code formatted (`make format`)
- [ ] Feature spec updated (if applicable)
- [ ] No merge conflicts

---

**Usage Philosophy**: Start minimal, expand thoughtfully, clean up regularly.
