# ADR-S01: Monorepo Structure

**Date:** 2026-04-22
**Status:** Accepted
**Deciders:** Development Team

## Problem

Choose repository structure for a TypeScript application that may include multiple components: server (Web API and/or MCP server), frontend, documentation, and tooling.

**Context:**
- Single developer/small team environment
- Components often change together (server + docs, tools + skills)
- Need shared types, utilities, and documentation
- Want simple development setup

## Decision

**Chosen Option:** Service-oriented Monorepo

**Why:** Enables atomic cross-component changes, shared tooling, and simplified development workflow. All project layers (server, docs, context, skills) co-located.

## Alternatives Considered

| Option     | Pros                                         | Cons                                       | Decision    |
|------------|----------------------------------------------|--------------------------------------------|-------------|
| Monorepo   | Atomic commits, shared tooling, simple setup | Large repo size, potential merge conflicts | Chosen   |
| Multi-repo | Independent deployments, team autonomy       | Complex coordination, tooling duplication  | Rejected |

## Implementation

### Project Layout

```
project/
├── server/                  # Application code
│   ├── src/                 # Source code
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript config
├── docs/                 # AI development context (SAID-ts)
│   ├── idea.md              # Business context (why)
│   ├── vision.md            # Technical architecture (what)
│   ├── conventions.md       # Code patterns (how)
│   ├── features/            # Feature specs + task logs
│   ├── adr/                 # Architecture decisions
│   └── working/             # Session-specific context
├── CLAUDE.md                # AI development guide (entry point)
└── README.md                # Project README
```

### Layer-Specific Additions

When **Web** layer is active:
```
server/
├── src/
│   ├── app.ts                # Composition root (Hono)
│   ├── features/             # Feature modules
│   │   └── <name>/           # <name>.module.ts, <name>.service.ts, <name>.schema.ts, <name>.test.ts
│   ├── lib/                  # Domain-agnostic utilities
│   └── middleware/           # Hono middleware
├── prisma/                   # Database schema + migrations (if Storage: DB)
└── Dockerfile                # Container build (if Deployment)
```

When **MCP** layer is active:
```
server/
├── src/
│   ├── index.ts              # Composition root (McpServer)
│   ├── config.ts             # Configuration
│   ├── lib/                  # Domain-agnostic utilities
│   └── features/             # Feature modules
│       └── <name>/           # <name>.tools.ts, <name>.service.ts, <name>.schema.ts, <name>.test.ts
└── <name>.config.json        # MCP-specific config
```

When **Frontend** layer is active:
```
ui/                           # React SPA
├── src/
├── public/
└── package.json
```

When **MCP Skills** layer is active:
```
.claude/commands/             # Claude Code slash commands
└── <skill>.md
```

### Action Items
- [x] Create monorepo structure with server/ separation
- [x] Set up context system (SAID-ts) in docs/
- [x] Create CLAUDE.md as AI development entry point

## Consequences

**Positive:**
- Atomic changes across all components
- Shared tooling and CI/CD pipeline
- Single clone for full development environment
- Context docs live next to the code they describe

**Negative:**
- Larger repository size
- Potential merge conflicts in shared files

**Monitoring:**
- Repository size stays manageable (< 100MB)
- Development setup time (< 5 minutes from clone to running)

## Related

**Features:** All FEAT-XXX files benefit from coordinated development
**ADRs:** Foundation for all subsequent architectural decisions
