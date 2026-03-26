# ADR-S01: Monorepo Structure for Full-Stack Development

**Date:** 2025-12-16  
**Status:** Accepted  
**Deciders:** Development Team

## Problem

Choose repository structure for a full-stack application (Go backend + React frontend) with shared documentation and tooling.

**Context:**
- Single developer/small team environment
- Backend and frontend often change together
- Need shared types, utilities, and documentation
- Want simple development setup and deployment

## Decision

**Chosen Option:** Service-oriented Monorepo

**Why:** Enables atomic cross-service changes, shared tooling, and simplified development workflow for coordinated full-stack features.

## Alternatives Considered

| Option     | Pros                                         | Cons                                       | Decision    |
|------------|----------------------------------------------|--------------------------------------------|-------------|
| Monorepo   | Atomic commits, shared tooling, simple setup | Large repo size, potential merge conflicts | ✅ Chosen   |
| Multi-repo | Independent deployments, team autonomy       | Complex coordination, tooling duplication  | ❌ Rejected |
| Monolith   | Simple deployment, tight coupling            | Hard to scale, technology lock-in          | ❌ Rejected |

## Implementation

### Code Changes
```
project/
├── server/                  # Go backend (Fiber)
│   ├── cmd/app/          # Application entrypoints
│   ├── internal/            # Private application code
│   ├── pkg/                 # Public packages
│   ├── go.mod               # Go module definition
│   └── Dockerfile
├── ui/                      # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/                    # Shared documentation
│   ├── features/
│   ├── adr/
│   └── conventions.md
├── Makefile                 # Shared commands
├── docker-compose.yml       # Local development
└── CLAUDE.md                # AI development guide
```

### Action Items
- [x] Create monorepo structure with server/ui separation
- [x] Set up shared documentation in docs/
- [x] Create unified development commands in Makefile
- [x] Configure Docker Compose for local development

## Consequences

**Positive:**
- Atomic changes across frontend/backend
- Shared tooling and CI/CD pipeline
- Single clone for full development environment
- Easy code sharing between services

**Negative:**
- Larger repository size
- Potential merge conflicts in shared files
- Single point of failure for entire codebase

**Monitoring:**
- Repository size stays manageable (< 100MB)
- Development setup time (< 5 minutes from clone to running)
- Cross-service feature development velocity

## Related

**Features:** All FEAT-XXX files benefit from coordinated development  
**ADRs:** Foundation for all subsequent architectural decisions  
**References:** [Monorepo best practices](https://monorepo.tools/)

---

## Decision Rationale

This structure supports the project's core principle of **AI-assisted feature development** where backend APIs and frontend components are developed together as cohesive features, documented in single FEAT-XXX specifications.