# Acme Widgets

Example website for Software Factory Intensive training. Live at
**<https://bryanhirsch.github.io/acme-widgets-private/>**.

The training guide — including setup for the components around this repo —
lives in the Google Doc:
<https://docs.google.com/document/d/1zZhUPXKH-U3Z0FOqGXTU4hbP6o43WA0vnIU1bA_9jWM/edit?tab=t.0>.

## Quick Start

Prerequisites: [Bun](https://bun.sh) `>=1.2`.

```bash
git clone git@github.com:bryanhirsch/acme-widgets-private.git
cd acme-widgets-private
bun install
bun run dev          # http://localhost:5173
```

Other useful scripts:

```bash
bun run typecheck    # tsc --noEmit
bun run build        # production build to dist/ (also writes 404.html)
bun run preview      # serve the built output on http://localhost:4173
bun run test         # Vitest, one shot
bun run test:watch   # Vitest, watch mode
bun run test:e2e     # Playwright (chromium); spins up `bun run preview`
```

## Stack

TypeScript + React 19 + Vite 6 + Tailwind v4 + React Router v7,
hosted on GitHub Pages, CI on GitHub Actions. See
[`docs/current/STACK.md`](docs/current/STACK.md) for as-built versions
and conventions, and
[`docs/decision-records/0001.ADR.TECH_STACK.md`](docs/decision-records/0001.ADR.TECH_STACK.md)
for the decision record.

## Repo layout

- [`docs/current/`](docs/current) — what is true on `main` right now.
- [`docs/decision-records/`](docs/decision-records) — frozen ADRs.
- [`docs/future/`](docs/future) — proposed changes drafted as ADRs.
- `src/` — application source. `pages/` contains the three routes;
  `components/` contains shared chrome and the 15 widget presets;
  `lib/widgets.ts` is the CSV parser + cache.
- `e2e/` — Playwright specs.
- `public/data/widgets.csv` — last-resort fallback for the catalog if the
  Google Sheet can't be reached. Editing this file does **not** change
  the live site; see below.

## Editing the catalog

Widget data (prices, stock counts, descriptions) lives in a Google Sheet,
not in this repo. Producers and employees edit the sheet directly; changes
appear on the live site within a few minutes — no PR, no deploy.

See [`docs/current/EDITING_THE_CATALOG.md`](docs/current/EDITING_THE_CATALOG.md)
for the sheet location and editing rules. The architecture choice is
captured in
[`docs/decision-records/0002.ADR.DYNAMIC_WIDGET_CATALOG.md`](docs/decision-records/0002.ADR.DYNAMIC_WIDGET_CATALOG.md).
