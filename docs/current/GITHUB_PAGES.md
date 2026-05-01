# Hosting acme-widgets on GitHub Pages (forks)

This project ships with a Pages deploy workflow (`.github/workflows/deploy.yml`) and a Vite config that honors `VITE_BASE` (`vite.config.ts`). On the canonical public repo Pages "just works" once enabled. Forks need a few manual steps because Pages must be turned on per-repo and the build needs the fork's repo name as a base path.

Pages is free only for **public** repos — keep the fork public.

## Prerequisite

Actions must be enabled on the fork — see [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md).

## One-time setup per fork

### 1. Set Pages source to "GitHub Actions"

Settings → Pages → Build and deployment → Source: **GitHub Actions**. Do not pick "Deploy from a branch" — the shipped workflow uploads a Pages artifact and calls `actions/deploy-pages`, which is incompatible with branch-deploy.

### 2. Set `VITE_BASE` to match the fork's repo name

GitHub Pages serves project sites at `https://<owner>.github.io/<repo>/`. Vite needs that prefix at compile time. The shipped workflow hardcodes the upstream name:

```yaml
# .github/workflows/deploy.yml
- name: Build with Pages base path
  env:
    VITE_BASE: /acme-widgets/
  run: bun run build
```

If the fork is **not** named `acme-widgets`, change `VITE_BASE` to `/<your-fork-repo-name>/` (leading and trailing slashes required).

**Recommended — derive the base path from the repo name** so the workflow is fork-portable and no edit is ever needed:

```yaml
    VITE_BASE: /${{ github.event.repository.name }}/
```

### 3. (Optional) Custom domain

Settings → Pages → Custom domain. If you set one, also set `VITE_BASE: /` in the workflow — custom domains serve from the root, not from `/<repo>/`.

## Triggering the first deploy

The workflow runs on push to `main` and via manual dispatch (Actions tab → "Deploy to GitHub Pages" → "Run workflow"). When the run finishes, the deployed URL appears in Settings → Pages.

## Already wired up (no action needed)

- **SPA routing.** `package.json`'s `postbuild` copies `dist/index.html` to `dist/404.html` so React Router handles deep-link refreshes.
- **Pages permissions** (`pages: write`, `id-token: write`) and **concurrency** (`pages` group, no cancel-in-progress) are set in `deploy.yml`.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Workflow doesn't run on the fork | Actions disabled | See [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) |
| `actions/deploy-pages` fails with "Pages site not found" | Source not set to "GitHub Actions" | Step 1 |
| Site loads but assets 404 | `VITE_BASE` doesn't match `/<repo>/` | Step 2 |
| Deep-link refresh returns 404 | `dist/404.html` missing | Re-run the workflow; verify `postbuild` ran |
| Custom domain set but assets 404 | Base path still `/<repo>/` | Step 3 — set `VITE_BASE: /` |

## Related

- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) — enabling and configuring Actions on a fork
- [HOSTING.md](./HOSTING.md) — overall remote / Dolt / Pages architecture
