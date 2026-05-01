# GitHub Actions on forks

The repo ships with two workflows under `.github/workflows/`:

- **`ci.yml`** — typecheck, build, Vitest, Playwright. Runs on PRs and pushes to `main`.
- **`deploy.yml`** — builds and publishes the site to GitHub Pages. See [GITHUB_PAGES.md](./GITHUB_PAGES.md).

Actions are free for public repos. Keep the fork public.

## One-time setup per fork

### 1. Enable Actions on the fork

Forks have Actions **disabled by default**. Open the **Actions** tab and click "I understand my workflows, go ahead and enable them."

### 2. Allow the actions used by the workflows

Settings → Actions → General → Actions permissions. The simplest option is "Allow all actions and reusable workflows." If you prefer a stricter allowlist, the workflows use:

- `actions/checkout`
- `actions/cache`
- `actions/upload-artifact`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`
- `oven-sh/setup-bun`

### 3. Workflow permissions

Settings → Actions → General → Workflow permissions. The shipped workflows declare the permissions they need (`contents: read`, plus `pages: write` and `id-token: write` for `deploy.yml`), so the default "Read repository contents and packages permissions" is fine. If a run fails with "Resource not accessible by integration," switch to "Read and write permissions."

## Verifying CI runs

Push a commit to `main` or open a PR against `main`. The Actions tab should show a green "CI" run. The Playwright report and `test-results/` artifacts upload only on failure (7-day retention).

## Related

- [GITHUB_PAGES.md](./GITHUB_PAGES.md) — Pages-specific setup (the deploy workflow)
- [HOSTING.md](./HOSTING.md) — overall remote / Dolt / Pages architecture
