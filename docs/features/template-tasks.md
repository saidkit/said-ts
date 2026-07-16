# <FEAT><NN>-TS-<NN> Task Log: [Feature Name]

<!-- Legend for the heading above and the stencils below:
       <FEAT>, <NN>  - placeholders (filled per project / task; task counter is 2-digit, zero-padded)
       TS            - literal: this project's app-segment vocab token
     Skills read these stencils to learn the project's vocab.
     Change `TS` here to change task-ID vocab project-wide. -->

**CRITICAL: This file is an append-only historical record.**

- Never overwrite or strip detail from existing task entries
- When updating task status: change only `Status:` line; add/update `### Fix`, optionally `### Deviations` and `### Gotchas`
- **Pre-commit amendment carve-out**: task entries not yet referenced in any commit (`git log --all --grep <task-id>` empty) MAY be amended in place - extend Approach, Acceptance, add `### Deviations` note documenting the late fold-in. Never delete prior detail. Once a commit references the task-id, append-only is strict.
- Keep all detail: decisions, trade-offs, lessons learned

## Authoring discipline (read before writing or closing tasks)

**Working folder vs task body.** `docs/working/<feature-id>/` is operator workspace - handoff drafts, scope refinements, wire-probe captures, transient authoring. Skills may read/write there as input/output across phases; task body MUST NOT cite working-folder paths in `Refs:` / `Reading list` / `### Fix`. Task body cites only durable artifacts: ADR / feature-spec / committed code.

**What goes here:** episodes - Problem / Approach / Reading list / Acceptance, then Fix / Deviations? / Gotchas? at close. Section order is canonical - don't reorder.

**What does NOT go here:**
- Forward-looking rules (`must`, `always`, `never`, `frozen`, `convention`, `spec change`). → ADR. Leave only `Refs:` pointer in the task.
- References to `docs/working/<feature-id>/` paths in `Refs:` / `Reading list` / `### Fix`. → See "Working folder vs task body" above.
- `**Files added:**` / `**Files modified:**` blocks in `### Fix`. Files are derivable from `git log --name-only`.
- TDD red-green narratives. → tests are the source of truth.
- Mid-task amendments (`Follow-up`, `Fix (post-review #2)`, `Re-attempt plan`). → new task IDs, append at the end of the file.
- Sentences that repeat content from a referenced ADR/spec instead of pointing at it. → `Refs:` and a one-line cite, not a paraphrase.
- "Alternatives considered" entries for options no reasonable reader would have picked. → keep alternatives only when the rejected option is plausible to a reader who doesn't know the codebase.
- Historical narration of how the task evolved (`first I tried X, then user changed mind, then…`). → git log + commit messages are canonical for sequencing.
- Cosmetic Deviations (sub-30-min friction, no downstream impact, plan-vs-actual on positions / sizes / order). → drop entirely; they're noise.
- Gotchas visible from the diff, test names, or commit message alone. → keep Gotchas only when non-obvious from the artifact-under-review.

**Close-of-task review** (run before changing Status to Done):

1. **Leak scan.** Read the entry. Any sentence reading as a forward-looking rule (words: `must`, `always`, `never`, `frozen`, `convention`, `spec change`)? Move that content to the relevant ADR. Leave only a `Refs:` pointer in the task.
2. **Gotcha harvest.** List anything non-obvious learned during implementation that wasn't in Approach - failed first attempts, surprising constraints, library/browser quirks. Add as bullets under `### Gotchas`. Then drop any bullet that's visible from the diff / test names / commit message alone.
3. **Deviation check.** Did the implementation depart from Approach? If yes, write `### Deviations` as `Plan: X / Actual: Y / Reason: Z`. Drop cosmetic deviations (sub-30-min friction, no downstream impact, sizing / positioning / order trivia) - they're noise.
4. **Fill `### Fix`** as a single verification line (`Tests N → M; typecheck + lint clean.`) plus optional one-line pointers to spec edits. Drop file enumeration - git is canonical.
5. **Bloat scan.** Re-read the entry as someone who didn't write it and only has access to the linked ADR/spec + the diff + git log. Cut every sentence that doesn't add information beyond those sources. Specifically:
   - Sentences that repeat content from a referenced ADR/spec instead of pointing at it
   - "Alternatives considered" entries for options no reasonable reader would have picked
   - File-path enumerations (`git log --name-only` is canonical)
   - Historical narration of how the task evolved
   - Repetition between Approach / Reading list / Acceptance - each section serves a different question; if two sections say the same thing, one of them is wrong
   - Target the verbosity of the lightest entries in this file's recent history. If a section is twice as long as the equivalent in adjacent tasks, justify or cut.

Report what moved, was added, or was cut before saving.

**Depth varies by task type:**

- **Planned tasks** (from feature pass-2 grilling): fill all five mandatory sections (Problem / Approach / Reading list / Acceptance / Fix). Deviations and Gotchas as needed at close.
- **Ad-hoc tasks** (bug fixes, small follow-ups discovered mid-feature): may carry only Problem + Fix + Gotchas. The template tolerates both shapes - don't pad to fit ceremony.

**`Refs:` discipline.** Mandatory when the task creates or edits an ADR / feature-spec - list all touched paths there. Empty otherwise.

---

## Summary Table

| Task | Title | Status |
|---|---|---|
| <FEAT><NN>-TS-01 | [Short title] | Todo / Done / Backlog / Canceled |

---

## <FEAT><NN>-TS-01: [Task Title]

**Status:** (Todo | Done | Canceled | Backlog) (YYYY-MM-DD)
**Priority:** (High | Medium | Low)
**Refs:** (ADR / feature-spec paths the task created or edited; mandatory when the task touches any, otherwise empty)

### Problem
[What needs to be solved? Include context - why is this an issue? For bugs, add a `### Root cause` subsection.]

### Approach
[What to build, not how. Include alternatives considered and why this was chosen. Frozen at pass-2 close - if implementation departs from this, log under Deviations.]

### Reading list
[Files / ADRs / specs an implementer must load before starting this task. Often short - feature spec's `## Context to load` already covers most.]

### Acceptance
[How "done" is judged - observable outcomes, not implementation steps.]

### Fix
<!-- Filled at close. Single verification line. Example:
  Tests 142 → 145 (3 cases - X / Y / Z); typecheck + lint clean.
Plus optional one-liners for spec edits. No file enumeration (git is canonical). No test-output dumps. -->

### Deviations
<!-- Optional. Only if implementation departed from Approach. Plan / Actual / Reason. -->

### Gotchas
<!-- Optional. Non-obvious things learned during implementation. Bullets. -->

### Out of scope
<!-- Optional. What was decided to skip during work on this task. -->

---------------------------------------

## <FEAT><NN>-TS-02: [Next Task Title]

**Status:** Todo
**Priority:** Medium
**Refs:**

### Problem
...

### Approach
...

### Reading list
...

### Acceptance
...

---------------------------------------
