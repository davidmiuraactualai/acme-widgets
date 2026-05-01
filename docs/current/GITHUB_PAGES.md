# Hosting acme-widgets on GitHub Pages (forks)

This project ships with a Pages deploy workflow (`.github/workflows/deploy.yml`) preconfigured for the default repo name `acme-widgets`. On a fork, you only need to flip two switches in the GitHub UI.

Pages is free only for **public** repos — keep the fork public.

## Prerequisite

Actions must be enabled on the fork — see [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md).

## One-time setup

1. **Set Pages source to "GitHub Actions".** Settings → Pages → Build and deployment → Source: **GitHub Actions**. Do not pick "Deploy from a branch."
2. **Trigger a deploy.** Push to `main`, or run the workflow manually: Actions tab → "Deploy to GitHub Pages" → "Run workflow".

## Your site URL

```
https://<your-github-username>.github.io/acme-widgets/
```

(Same form on the canonical repo: <https://bryanhirsch.github.io/acme-widgets/>.)

The URL also appears in Settings → Pages and on the workflow run summary once the deploy succeeds.

## Already wired up (no action needed)

- **SPA routing.** `package.json`'s `postbuild` copies `dist/index.html` to `dist/404.html` so React Router handles deep-link refreshes.
- **Base path.** `VITE_BASE: /acme-widgets/` is set in `deploy.yml` so assets resolve under `/acme-widgets/...`.
- **Pages permissions** (`pages: write`, `id-token: write`) and **concurrency** (`pages` group) are set in `deploy.yml`.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Workflow doesn't run on the fork | Actions disabled | See [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) |
| `actions/deploy-pages` fails with "Pages site not found" | Source not set to "GitHub Actions" | Step 1 |
| Deep-link refresh returns 404 | `dist/404.html` missing | Re-run the workflow; verify `postbuild` ran |

## Related

- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) — enabling and configuring Actions on a fork
- [HOSTING.md](./HOSTING.md) — overall remote / Dolt / Pages architecture
