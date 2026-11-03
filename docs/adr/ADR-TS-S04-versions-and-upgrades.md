# ADR-TS-S04: Versions and upgrades

**Date:** 2026-11-03
**Status:** Accepted
**Tier:** STARTER ADR, provided by the starter

## Problem

A lane needs to say on disk which releases it stands on, so that an operator and a session can tell whether it is current and which upgrades it owes. The stamp rule is the said plugin's versioning record, `ADR-SAID-S04`; this record states how this starter applies it.

## Decision

1. **The stamp.** The `## Lane` block carries two keys, set by hand after the lane walks its upgrades; nothing derives them:
   - `SAID.version: said@<semver>` - the said plugin release the lane was last brought to.
   - `SAID.starter: said-ts@<semver>` - this starter's own release, the release of its `CHANGELOG.md` head.
   Every version carries its id (`<id>@<semver>`); a bare semver is refused. An absent key means unversioned, never a halt.
2. **The release history.** `CHANGELOG.md` at the starter root, newest first, one entry per release headed `## said-ts@<semver> - <YYYY-MM-DD>`. A release that requires an instance to act names the playbook id in its entry.
3. **Upgrade playbooks.** A playbook ships in the starter's `upgrade/` folder. Its header, under the title, is five key lines in this order: `rollout` (its id), `plugin` (the engine floor), `from`, `to`, `after` (the playbooks it presupposes, or `none`). A lane owes every starter playbook whose `to` is above its `SAID.starter`, in `after` order; a kit playbook is compared with `SAID.version` the same way.
4. **Marker, not migration.** The stamp makes an upgrade legible; it does not perform one. Each upgrade is a playbook walk, then the stamp is set by hand.

## Consequences

**Positive:** "which release is this lane on, and what does it owe?" is answerable from the lane block and the playbook headers.
**Negative:** the stamp is kept by hand; a walk that forgets the stamp leaves the lane looking behind.
**Monitoring:** `grep -nE "SAID\.(version|starter):" CLAUDE.md` prints the two keys, each `<id>@<semver>`.

## Related

**ADRs:** `ADR-SAID-S04` (the stamp rule: the marker, the release history, marker not migration).
