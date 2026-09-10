# <FEAT>-<NN>: [Feature Name]

**Surface:** <api | none>
<!-- Inherits the lane `SAID.surface:` (`api`). 
     Set `none` for a feature that ships no HTTP endpoints 
     (e.g. an internal-library feature) — the `api-schema` reviewer then
     SKIPs it. An `api` feature is gated against `docs/ux/feature-ux-rules.md`. -->

## Context to load alongside this spec
- `docs/adr/<ADR-TS-XXX>.md` - <why it applies>
- `src/features/<related>/` - <related code>
- `docs/features/<FEAT>-<NN>.tasks.md` - implementation log

(Load these before authoring or modifying code in this feature.)

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
- [ ] Tool: `[tool_name]` - input: [schema], output: [shape], side effects: [files/APIs]

**API Endpoints** (if Web layer):
- [ ] [METHOD] /api/v1/path - [description]

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
     Create: <FEAT>-<NN>.tasks.md (same directory, same prefix).

| Task | Title | Status |
|---|---|---|
| <FEAT><NN>-TS-01 | [Short title] | Fixed / Open / Defer |

Detailed task log: [<FEAT>-<NN>.tasks.md](<FEAT>-<NN>.tasks.md)
-->

## Related
- **ADRs:** [Link to relevant architectural decisions]
- **Features:** [Link to dependent/related features]
- **Issues:** [Link to GitHub issues/tickets]
