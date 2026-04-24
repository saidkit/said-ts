# Feature Development

## Quick Reference
**Pattern**: `FEAT-XXX-name` (e.g., `FEAT-001-auth`, `FEAT-012-payments`)
**Branch**: `feature/FEAT-XXX-name`
**Commands**: `cd server && make test` -> `cd server && make format` -> `cd server && make typecheck` -> Update spec -> Ready for merge

## Feature Workflow

### Starting New Feature
```bash
# 1. Create spec from template
cp docs/features/template.md docs/features/FEAT-XXX-name.md

# 2. Create branch
git checkout -b feature/FEAT-XXX-name

# 3. Load context in Claude
@docs/conventions.md @docs/features/FEAT-XXX-name.md
```

### Feature File Structure

Depends on active layer (see `CLAUDE.md` Active Layers):

**Web layer:**
```
server/src/features/<name>/
├── <name>.types.ts        # Domain-owned interfaces (when needed)
├── <name>.service.ts      # Business logic
├── <name>.tools.ts        # MCP tools (when MCP layer active)
├── <name>.module.ts       # Hono routes (when Web layer active)
├── <name>.schema.ts       # Zod schemas
└── <name>.test.ts         # Tests
```

Same structure for all layers. Layer-specific files are optional. See **ADR-S03-feature-structure.md**.

### Quick Start (New Feature)

```bash
# 1. Create feature directory
mkdir -p server/src/features/<name>

# 2. Create files following ADR-S03 pattern
# <name>.types.ts → <name>.schema.ts → <name>.service.ts → <name>.tools.ts → <name>.test.ts
# (order: types → schema → service → handlers/module → test)

# 3. Wire in composition root
# MCP: create service + handlers, registerTool() in index.ts
# Web: create service + module, app.route() in app.ts
```

## Quality Gates
| Gate           | Command        | Required |
|----------------|----------------|----------|
| Tests Pass     | `cd server && make test`      | yes      |
| Code Formatted | `cd server && make format`    | yes      |
| Type-check     | `cd server && make typecheck` | yes      |
| Spec Updated   | Check FEAT-XXX                | yes      |
| No Conflicts   | `git status`                  | yes      |

## Development Principles
- **MVP First**: Ship working version, iterate
- **Test-Driven**: Write tests with implementation
- **Branch Isolation**: One feature per branch
- **Spec Updates**: Keep FEAT-XXX-name.md current

---

**Key Rule**: Never merge without passing quality gates.
