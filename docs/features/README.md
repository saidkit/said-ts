# Feature Development

## Quick Reference
**Pattern**: `FEAT-XXX-name` (e.g., `FEAT-001-auth`, `FEAT-012-payments`)
**Branch**: `feature/FEAT-XXX-name`
**Commands**: `make test` -> `make format` -> Update spec -> Ready for merge

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
```
server/src/features/<name>/
├── <name>.module.ts       # Hono routes (Zod-validated)
├── <name>.service.ts      # Business logic (constructor DI)
├── <name>.schema.ts       # Zod schemas
└── <name>.test.ts         # Tests
```

See **ADR-S03-feature-structure.md** for complete details.

### Quick Start (New Feature)
```bash
# 1. Create feature directory
mkdir -p server/src/features/<name>

# 2. Create files following ADR-S03 pattern
# <name>.schema.ts -> <name>.service.ts -> <name>.module.ts -> <name>.test.ts

# 3. Wire in app.ts
# Create service, mount module via app.route()
```

## Quality Gates
| Gate           | Command        | Required |
|----------------|----------------|----------|
| Tests Pass     | `make test`    | yes      |
| Code Formatted | `make format`  | yes      |
| Spec Updated   | Check FEAT-XXX | yes      |
| No Conflicts   | `git status`   | yes      |

## Development Principles
- **MVP First**: Ship working version, iterate
- **Test-Driven**: Write tests with implementation
- **Branch Isolation**: One feature per branch
- **Spec Updates**: Keep FEAT-XXX-name.md current

---

**Key Rule**: Never merge without passing quality gates.
