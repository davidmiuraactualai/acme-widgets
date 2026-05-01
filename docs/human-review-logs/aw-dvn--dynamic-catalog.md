# Human review — aw-dvn: dynamic widget catalog (Google Sheets)

**Bead:** [`aw-dvn`](../../README.md) (epic) — see also `aw-dvn.1` through `aw-dvn.11`.
**ADR:** [`0002.ADR.DYNAMIC_WIDGET_CATALOG.md`](../decision-records/0002.ADR.DYNAMIC_WIDGET_CATALOG.md).
**Branch:** `aw-dvn/dynamic-catalog`.

The diff is small per file but spans data, routing, UI, config, and docs.
Most of the runtime behavior is exercised by unit tests (referenced inline
below) — this log focuses on what the tests *cannot* verify: copy quality,
end-to-end UX of each failure mode, and the human-only setup items.

## Editorial — copy and writing

The new producer-facing doc and the new error UI are user-visible to
non-engineers. Tests assert they exist; they cannot tell us whether the
writing is clear, accurate, or appropriately scoped.

- [ ] [`docs/current/EDITING_THE_CATALOG.md`](../current/EDITING_THE_CATALOG.md)
      reads cleanly to a non-engineer producer/employee. The column table is
      accurate. The "do not rename headers" warning is unmistakable. The
      "what to do when something looks wrong" section matches the actual
      failure modes.
- [ ] `WidgetsRouteError` copy in
      [`src/pages/Widgets.tsx`](../../src/pages/Widgets.tsx) is the right
      tone for the brand and points users somewhere useful. Both link
      destinations (Home, How to order) make sense as fallbacks for a
      catalog outage.
- [ ] [`README.md`](../../README.md) "Editing the catalog" section is
      accurate. The reframing of `widgets.csv` as "fallback only, editing it
      does not change the live site" lands clearly.
- [ ] [`docs/current/STACK.md`](../current/STACK.md) "Catalog data source"
      section accurately describes what shipped (not what was originally
      planned).

## Failure-mode walkthrough

The fetch path has six discrete branches. Each is unit-tested in isolation,
but the *user-facing experience* of each is worth a one-time manual pass.
Test names are referenced so you don't redo what's already covered — this
is about confirming the test contract feels right when seen in a real
browser, not about catching regressions.

- [ ] **Live sheet, 200, valid CSV** — visit `/widgets` against the live
      site (or `bun run dev`). All 15 widgets render. No `console.warn`
      from the fetch path. *Covered by:* `fetches the sheet, parses it,
      and caches the result` in `src/lib/widgets.test.ts`.
- [ ] **Sheet network down → fallback succeeds.** In `.env.local`, set
      `VITE_WIDGETS_SHEET_URL=https://invalid.example.invalid/`. Restart
      `bun run dev`. `/widgets` should render the bundled snapshot, and the
      browser console should show the "Sheet catalog unreachable; falling
      back to bundled widgets.csv" warning. *Covered by:* `falls back to
      the bundled CSV with a console.warn on a network error`.
- [ ] **Sheet 404 → fallback succeeds.** Set
      `VITE_WIDGETS_SHEET_URL=http://localhost:5173/no-such-file.csv`.
      Same expected outcome. *Covered by:* `falls back when the sheet
      returns a non-OK HTTP response`.
- [ ] **Sheet OK, malformed CSV → fail loud.** Temporarily rename the
      `price` column header in the live sheet (e.g. to `Price ($)`).
      `/widgets` should show the `WidgetsRouteError` page within ~5 minutes
      (Google's edge cache window) — *not* the bundled snapshot, *not*
      every row showing $0. **Restore the header immediately after.**
      *Covered by:* `does NOT fall back when the sheet returns 200 but
      the CSV is malformed` and `throws when a required column is missing
      or renamed in the header`.
- [ ] **Both sources fail.** With the bad `.env.local` URL above, also
      delete or rename `public/data/widgets.csv` locally. `/widgets`
      should render `WidgetsRouteError`. (Restore the file when done.)
- [ ] **Cached → no re-fetch within a session.** Open `/widgets`, then
      navigate Home → Widgets again. The sheet should not be fetched a
      second time within the same page session. *Covered by:* the cache
      assertion in `fetches the sheet, parses it, and caches the result`.

## Setup / governance items

These cannot be verified from the diff and should be confirmed by someone
with access to the canonical Google account.

- [ ] The URL in `.env`'s `VITE_WIDGETS_SHEET_URL` points at the canonical
      "Acme Widgets — Catalog" sheet — not a personal scratch sheet, not a
      copy.
- [ ] Editor access on that sheet is restricted to people who already have
      merge rights on `main`, per ADR 0002. Anyone outside that group is
      "viewer" only.
- [ ] The sheet contains catalog data only — no internal notes, no draft
      copy, no customer info. (The published-CSV URL is publicly readable.)

## Out of scope for this review

- Whether the *architecture* is right: that's ADR 0002, which was
  reviewed separately before this branch was cut.
- Visual design of `WidgetCard`, the category chips, or the catalog page
  layout: unchanged in this PR.
- Changes to the test runner setup or CI: none.
