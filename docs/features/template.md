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
- [ ] API endpoint: [METHOD] /api/v1/path
- [ ] Database: [Prisma model changes]
- [ ] Authentication: [Auth requirements]
- [ ] Performance: [Response time/load requirements]

### UI/UX Requirements
- [ ] [UI component/screen description]
- [ ] [User interaction flow]
- [ ] [Responsive design requirements]
- [ ] [Error handling/validation]

## Acceptance Criteria
```gherkin
Given [initial state]
When [user action]
Then [expected outcome]

And [additional condition]
Then [additional outcome]
```

## Implementation Plan

### Backend (`server/src/features/xxx/`)
Structure: See ADR-S03 for full details.

```
server/src/features/xxx/
├── xxx.schema.ts      # Zod schemas (request/response)
├── xxx.service.ts     # Business logic (Prisma queries)
├── xxx.module.ts      # Hono routes (factory function)
└── xxx.test.ts        # Tests
```

- [ ] Create feature directory structure
- [ ] Schema: Define Zod schemas in `xxx.schema.ts`
- [ ] Service: Implement business logic in `xxx.service.ts`
- [ ] Module: Create route factory in `xxx.module.ts`
- [ ] Wire in `app.ts`: create service, mount module via `app.route()`
- [ ] Tests: Feature test coverage in `xxx.test.ts`

### Frontend (`ui/src/features/xxx/`)
- [ ] Components: [React components]
- [ ] Hooks: [Custom hooks]
- [ ] Utils: [Helper functions]
- [ ] Tests: [Frontend test coverage]

## Definition of Done
- [ ] All functional requirements implemented
- [ ] All technical requirements met
- [ ] Frontend and backend tests pass
- [ ] Code passes `cd server && make format`
- [ ] Manual testing completed
- [ ] Documentation updated

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
**Status:** In Progress
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
