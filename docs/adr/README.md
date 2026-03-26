# Architecture Decision Records

## Quick Reference

| Load This                          | When You Need To                              |
|------------------------------------|-----------------------------------------------|
| ADR-S01-monorepo-structure         | Understand project layout                     |
| ADR-S02-typescript-project-setup   | Understand stack choices (Bun, Hono, Prisma)  |
| ADR-S03-feature-structure          | Create new feature module                     |

## All ADRs

| ID      | Topic                        |
|---------|------------------------------|
| ADR-S01 | Monorepo structure           |
| ADR-S02 | TypeScript project setup     |
| ADR-S03 | Feature structure            |

## Naming

- **ADR-S0x** = System (infrastructure, cross-cutting)
- **ADR-00x** = Application (domain-specific)

## Creating New ADR

1. Propose next sequential number
2. Use `template.md`
3. Create ADR when decision affects multiple features or is hard to reverse.
