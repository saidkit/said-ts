# ADR-XXX: [Decision Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Rejected | Deprecated
**Deciders:** [Name(s)]

## Problem

[What architectural issue needs to be decided? Keep it concise.]

**Context:**
- Current situation
- Technical constraints
- Business requirements

## Decision

**Chosen Option:** [Brief description of the decision]

**Why:** [Primary reason for this choice]

## Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Option A | [Benefits] | [Drawbacks] | Chosen |
| Option B | [Benefits] | [Drawbacks] | Rejected |

## Implementation

### Code Changes
```
server/src/features/     # Feature changes
server/src/lib/          # Infrastructure changes
docs/features/           # Update affected FEAT-XXX files
```

### Action Items
- [ ] [Specific implementation task 1]
- [ ] [Specific implementation task 2]
- [ ] [Update affected feature specs]
- [ ] [Update documentation]

## Consequences

**Positive:**
- [Key benefit 1]
- [Key benefit 2]

**Negative:**
- [Key tradeoff 1]
- [Key tradeoff 2]

**Monitoring:**
- [Success metric 1]
- [Success metric 2]

## Related

**Features:** [FEAT-XXX files affected by this decision]
**ADRs:** [Related architectural decisions]
**References:** [External links, RFCs, etc.]

---

## Template Notes

**For Claude Code:**
- Link this ADR from affected FEAT-XXX-name.md files
- Include code examples in Implementation section
- Keep Problem/Decision sections concise
- Use tables for option comparison
- Focus on actionable consequences