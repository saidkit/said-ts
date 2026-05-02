# FEAT-XXX: [Feature Name]

## What & Why
**User Story:** As a [user], I want [goal] so that [benefit]
**Business Value:** [Why this matters]

## Requirements

### Functional Requirements
- [ ] [Core functionality requirement 1]
- [ ] [Core functionality requirement 2]
- [ ] [Core functionality requirement 3]

### Technical Requirements
<!-- Include sections relevant to your project's active layers (see CLAUDE.md) -->

**MCP Tools** (if MCP layer):
- [ ] Tool: `[tool_name]` — input: [schema], output: [shape], side effects: [files/APIs]

**API Endpoints** (if Web layer):
- [ ] [METHOD] /api/v1/path — [description]

**Storage** (if applicable):
- [ ] Filesystem: [paths written/read]
- [ ] Database: [Prisma model changes]

**External APIs** (if applicable):
- [ ] [API name]: [what it's used for, auth method]

**Performance:**
- [ ] [Response time/throughput requirements]

## Acceptance Criteria
```gherkin
Given [initial state]
When [user action]
Then [expected outcome]

And [additional condition]
Then [additional outcome]
```

## Implementation Plan

### Structure
<!-- Use the pattern matching your active layer. See ADR-S03. -->

**MCP layer:**
```
server/src/
├── <domain>.ts            # Tool handlers
└── <domain>.test.ts       # Tests
```

**Web layer:**
```
server/src/features/<name>/
├── <name>.module.ts       # Hono routes (factory function)
├── <name>.service.ts      # Business logic
├── <name>.schema.ts       # Zod schemas
└── <name>.test.ts         # Tests
```

> If a stacked layer (e.g., a frontend cloned as `ui/`) is also implementing this feature, see that layer's own feature template for its file structure.

### Steps
- [ ] Create source files following active layer pattern
- [ ] Implement schemas (Zod)
- [ ] Implement business logic (service/handlers)
- [ ] Wire in composition root (`index.ts` for MCP / `app.ts` for Web)
- [ ] Write tests
- [ ] Verify functionality

## Definition of Done
- [ ] All functional requirements implemented
- [ ] All technical requirements met
- [ ] Tests pass (`cd server && make test`)
- [ ] Code formatted (`cd server && make format`)
- [ ] Type-check passes (`cd server && make typecheck`)
- [ ] Manual testing completed
- [ ] Feature spec updated

## Feature Tasks

<!-- Optional: for features that discover subtasks during implementation.
     Keep the summary table here; put detailed analysis in a companion file.
     Create: FEAT-XXX.tasks.md (same directory, same prefix).

| Task | Title | Status |
|---|---|---|
| FXXX-001 | [Short title] | Fixed / Open / Defer |

Detailed task log: [FEAT-XXX.tasks.md](FEAT-XXX.tasks.md)
-->

## Related
- **ADRs:** [Link to relevant architectural decisions]
- **Features:** [Link to dependent/related features]
- **Issues:** [Link to GitHub issues/tickets]

## Progress Tracking
**Status:** Not Started
**Assigned:** [Developer name]

### Completed Tasks
- [x] [Example completed task]

### Current Focus
- [ ] [What's being worked on now]

### Blocked/Issues
- [ ] [Any blockers or issues]

---
**Created:** [Date]
**Last Updated:** [Date]
