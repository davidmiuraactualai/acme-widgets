# Testing

Acme Widgets uses two test runners, each scoped to a different layer of the
application. Both run on every PR via GitHub Actions and must be green before
merge.

## Unit & component tests — Vitest

Vitest runs unit tests for pure functions and component tests for React
components in isolation. It uses the same Vite transform pipeline as the app
itself, so tests see the code exactly as the bundler sees it.

- **Location:** co-located with source as `*.test.ts` / `*.test.tsx`.
- **Run locally:** `bun run test`
- **Watch mode:** `bun run test --watch`

Use Vitest when:
- The unit under test is a pure function, hook, or component.
- The test does not need a real browser DOM, network, or routing.

## End-to-end tests — Playwright

Playwright drives a real headless browser against a built copy of the site.
E2E tests cover the user-visible flows defined in
[`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md): landing on `/`,
browsing `/widgets`, reading `/orders`.

- **Location:** `e2e/` at the repo root.
- **Run locally:** `bun run test:e2e`
- **Headed (debug):** `bun run test:e2e -- --headed`

Use Playwright when:
- The behavior depends on routing, real network fetches, or browser APIs.
- The test verifies a user-visible flow end to end.

## Choosing between the two

Default to Vitest. Reach for Playwright only when the value of the test
depends on real browser behavior. Every Playwright test costs CI time, so
each one should justify itself with a flow a unit test cannot cover.

## What we do not test

- Visual regression. Out of scope for the training example.
- Performance / load. The site is static and the catalog is small.
- Accessibility audits beyond what Playwright + axe-core can assert in a
  regular E2E run.
