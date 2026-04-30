# Documentation Standard

In a mature software factory, agents read and write the code; humans read and
write plain English. Agents do code review; humans review functionality and
the plain-English descriptions in `docs/`. This document defines how those
plain-English documents are organized in this repository.

## Directory structure

```
docs/
  current/             # Authoritative docs for current state of code on the default branch (main)
  future/              # Proposed changes, drafted as ADRs awaiting approval
  roadmap → future     # Symlink for anyone looking for "the roadmap"
  decision-records/    # ADRs in flight or landed, moved here on a branch where the ADR is being implemented
  human-review-logs/   # Per-PR checklists for human functional review
```

## Lifecycle of an architecture decision

1. **Draft.** A proposed change is written as an ADR in `docs/future/`,
   numbered sequentially (e.g. `0001.ADR.TECH_STACK.md`).
2. **Approve & branch.** After approval if/when the work gets prioritized
    the ADR is moved from `docs/future/`
   to `docs/decision-records/` on the branch created to implement it.
3. **Evolve during implementation.** If the architecture evolves before
   merge, update the ADR in place in `docs/decision-records/` so the PR
   reflects what was actually built.
4. **Merge.** After merge, the ADR in `docs/decision-records/` is a frozen
   historical record — a decision made at a point in time, in a particular
   context. It does not change again. New decisions get new ADRs.
5. **Reflect current state.** The same PR updates `docs/current/` to describe
   the new state of the codebase.

## What goes where

| Directory                | Stable? | Purpose                                                   |
|--------------------------|---------|-----------------------------------------------------------|
| `docs/current/`          | Living  | What is true on the default branch right now.             |
| `docs/future/`           | Living  | What we are considering.                                  |
| `docs/decision-records/` | Frozen upon merge to main | ADRs get moved here as part of implementation.            |
| `docs/human-review-logs/`| Append  | One file per PR that warrants human functional review.    |

## When to update `docs/current/`

Any pull request that makes a meaningful change to technical architecture,
user experience, or information architecture must include corresponding
updates to `docs/current/`. If the docs and the code disagree, that is a bug
in either the code or the docs — never an acceptable steady state.

## Human review logs

Some changes deserve a human walkthrough before merge. For those, add a file
at `docs/human-review-logs/<bead-id>--<slug>.md` containing a checklist of
suggested functional reviews. Where a review item corresponds to an
automated test, reference the test so the reviewer has context. The goal is
to let a human verify, as efficiently as possible, that the change does what
it was intended to do.

A review log is appropriate when:
- The change is user-visible and an automated test cannot fully cover the
  intent (e.g. copy, layout, motion).
- The change crosses subsystem boundaries in a way a single PR diff is hard
  to evaluate.
- The change is a milestone the team wants captured for posterity.

Skip the review log for routine refactors, dependency bumps, and other
changes whose intent is fully captured by tests and the diff itself.
