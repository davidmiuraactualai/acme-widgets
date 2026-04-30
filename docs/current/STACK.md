# As-Built Stack

This file is the ground truth for what the default branch actually ships.
It is the companion to [`../decision-records/0001.ADR.TECH_STACK.md`](../decision-records/0001.ADR.TECH_STACK.md):
the ADR captures the decision and its rationale; this file captures the
versions and conventions that won during implementation.

If the code and this file disagree, that is a bug in the file.

## Pinned versions

| Layer            | Choice                            | Notes                                                      |
| ---------------- | --------------------------------- | ---------------------------------------------------------- |
| Runtime / pm     | Bun `>=1.2`, currently `1.3.11`   | Pinned in CI to `1.3.11` via `oven-sh/setup-bun@v2`.       |
| Bundler          | Vite `^6`                         | `@vitejs/plugin-react`.                                    |
| Language         | TypeScript `^5.7`                 | Strict + `noUncheckedIndexedAccess`.                       |
| UI               | React `^19`                       |                                                            |
| Routing          | React Router `^7` (data router)   | `createBrowserRouter` + `<RouterProvider>`.                |
| Styling          | **Tailwind CSS v4** (CSS-first)   | `@tailwindcss/vite` plugin; no `tailwind.config.js`.       |
| Icons            | `@heroicons/react/24/{solid,outline}` |                                                        |
| CSV parsing      | `papaparse`                       | Used for RFC 4180 quote handling.                          |
| Unit / component | Vitest `^4`, jsdom, testing-library | Config in `vite.config.ts`, setup in `src/test/setup.ts`. |
| E2E              | Playwright `^1.59`, chromium-only | Config at repo root. webServer wraps `bun run preview`.    |

The `engines.bun` floor lives in `package.json`. The CI bun version is
pinned in `.github/workflows/ci.yml` (and `deploy.yml`) — bump both at
the same time when you upgrade the runtime.

## Tailwind variant — v4, not v3

Tailwind v4 was chosen during implementation of aw-l0r.2 over v3, per
the bead's own NOTES which named v4 as the recommended default. The
practical implications:

- **No `tailwind.config.js` and no `postcss.config.js`.** Both files
  intentionally do not exist. v4 reads its theme from a `@theme` block
  in CSS.
- **Single source of truth for design tokens** is `src/index.css`. The
  brass / paper / jewel-tone palette and the Fraunces + Inter font
  stacks live in that one `@theme` block. Reach into that block to add
  or change tokens; do not introduce a JS config.
- **Plugin pipeline** is the `@tailwindcss/vite` plugin registered in
  `vite.config.ts`. There is no PostCSS config in the repo.
- **`@apply` still works** inside the `@layer base` block in
  `src/index.css`; we use it for the small set of base styles
  (`html { @apply bg-paper text-ink … }`).

If you ever switch back to v3, write a new ADR. Don't silently mix the
two — every preset in `src/components/widgetPresets.tsx` assumes v4
arbitrary-value syntax (`text-[clamp(40px,6vw,72px)]`,
`bg-brass-600`, etc.).

## `BASE_URL` convention

The site has to work in two places: at `/` in dev and at
`/acme-widgets/` on GitHub Pages (the public remote — see
[`HOSTING.md`](HOSTING.md)). One vite build serves both, controlled
by `import.meta.env.BASE_URL`:

- **Vite config:** `base: process.env.VITE_BASE ?? '/'` in
  `vite.config.ts`. CI sets `VITE_BASE=/acme-widgets/` for the deploy
  job; local dev/preview leaves it unset.
- **Router basename:** `createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })`
  in `src/routes.tsx`. **Do not** double-prefix in `<Link to>` calls —
  pass app-relative paths only (e.g. `to="/widgets"`).
- **Asset fetches:** prefix with `import.meta.env.BASE_URL`. Example:
  `fetch(\`${import.meta.env.BASE_URL}data/widgets.csv\`)` in
  `src/lib/widgets.ts`. `BASE_URL` already has a trailing slash; do
  not double up.

If you add a new fetch of a `public/` asset, follow the same pattern.

## GitHub Pages SPA fallback (`404.html`)

GitHub Pages serves `404.html` for any path it can't find on disk.
For an SPA, that means a hard refresh on `/widgets` would 404 unless
we hand it the SPA shell. The fix is one line in `package.json`:

```json
"postbuild": "cp -f dist/index.html dist/404.html"
```

Bun runs lifecycle scripts, so `bun run build` produces both files
without any extra wiring. **Do not strip this.** If you change the
build pipeline, make sure `dist/404.html` continues to exist in
production.

## Test runner split

- **Vitest** (`bun run test`) — pure functions, hooks, components in
  isolation. Excludes the `e2e/` directory.
- **Playwright** (`bun run test:e2e`) — flows that depend on routing,
  real network fetches (yes, the live `widgets.csv`), or browser APIs.

See [`TESTING.md`](TESTING.md) for the policy on when to reach for
each.
