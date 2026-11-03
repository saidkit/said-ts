# Architecture Decision Records

Point-in-time records of **why** a non-obvious decision was made. ADRs are history, not live state - read the relevant one when working in that area; **don't preload all of them**, and verify against the actual code (an ADR may have been superseded).

All ADRs here are **STARTER ADRs** (`ADR-TS-S0x`) - cross-cutting decisions
**portable across SAID TS projects** (repository anatomy, stack, patterns). This is a starter template, so it ships **no application ADRs**: project- and product-specific decisions live in **feature specs** (`docs/features/TS-0x-*.md`), not here.

## Quick Reference

| Load this                           | When you need to                              |
|-------------------------------------|-----------------------------------------------|
| ADR-TS-S01-repository-structure     | Understand project layout                     |
| ADR-TS-S02-typescript-project-setup | Understand stack choices, path aliases        |
| ADR-TS-S03-feature-structure        | Create new feature module                     |
| ADR-TS-S04-versions-and-upgrades   | Stamp or read the starter's release; walk its upgrade playbooks |
| ADR-TS-S05-dependency-injection     | Wire cross-feature deps, test with mocks      |
| ADR-TS-S06-pure-service-modules     | Wrap an external API (Stripe, S3, etc.)       |

## Index

| ADR        | Topic                        |
|------------|------------------------------|
| ADR-TS-S01 | Repository structure         |
| ADR-TS-S02 | TypeScript project setup     |
| ADR-TS-S03 | Feature structure            |
| ADR-TS-S04 | Versions and upgrades        |
| ADR-TS-S05 | Dependency injection         |
| ADR-TS-S06 | Pure service modules         |

## Naming

- **ADR-TS-S0x** = STARTER ADR - cross-cutting, portable across SAID TS projects.
- **ADR-TS-00x** = Project- / application-specific decisions

## Creating a new ADR

1. Propose next sequential number (separate sequences for STARTER ADRs and application's ADRs)
2. Use `template.md`
3. Create an ADR when the decision **affects multiple features or is hard to reverse**.Record the decision and its *why*; link the feature / working notes that drove it.
4. **Cross-reference** related ADRs in the Relationships section.
5. **After landing:** add a row to the Index (and Quick Reference) and update Relationships. Don't list an ADR file that doesn't exist (**no dangling pointers**).
