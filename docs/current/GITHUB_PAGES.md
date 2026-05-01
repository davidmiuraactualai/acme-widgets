# Hosting acme-widgets on GitHub Pages (forks)

This project ships with a GitHub Pages deploy workflow (`.github/workflows/deploy.yml`) and a Vite config that honors a `VITE_BASE` env var (`vite.config.ts`). On the canonical public repo (`bryanhirsch/acme-widgets`) Pages "just works" once enabled. On a **fork**, a few manual steps are required because GitHub disables Actions and Pages on new forks by default, and the deployed asset paths depend on the fork's repository name.

These instructions apply to any fork of the public remote (`git@github.com:bryanhirsch/acme-widgets.git`). Pages is free only for **public** repos — keep the fork public.

---

## One-time setup per fork

### 1. Confirm the fork is public

Settings → General → Danger Zone → "Change visibility". GitHub Pages on the free tier requires a public repository. Forks of a public repo are public by default; only check this if you toggled visibility.

### 2. Enable GitHub Actions on the fork

Settings → Actions → General → "Allow all actions and reusable workflows" (or at minimum "Allow … actions created by GitHub" plus the third-party actions used by `deploy.yml`: `oven-sh/setup-bun`, `actions/checkout`, `actions/upload-pages-artifact`, `actions/deploy-pages`).

Forks have Actions **disabled by default** until you visit the Actions tab and click "I understand my workflows, go ahead and enable them."

### 3. Enable GitHub Pages with "GitHub Actions" as the source

Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Do **not** pick "Deploy from a branch." The shipped workflow uploads a Pages artifact and calls `actions/deploy-pages`; the branch-deploy mode will not work with it.

### 4. Fix the base path for your fork's repo name

This is the only step that requires a code edit on the fork.

GitHub Pages serves project sites at `https://<owner>.github.io/<repo>/`. The Vite build needs to know that prefix at compile time so asset URLs and the SPA router resolve correctly. The shipped workflow hardcodes the upstream repo name:

```yaml
# .github/workflows/deploy.yml
- name: Build with Pages base path
  env:
    VITE_BASE: /acme-widgets/
  run: bun run build
```

If your fork is **not** named `acme-widgets`, change `VITE_BASE` to `/<your-fork-repo-name>/` (leading and trailing slashes required). For example, a fork named `widgets-demo` would set `VITE_BASE: /widgets-demo/`.

**Recommended alternative — derive the base path from the repo name** so the workflow is fork-portable and no edit is needed:

```yaml
- name: Build with Pages base path
  env:
    VITE_BASE: /${{ github.event.repository.name }}/
  run: bun run build
```

If you make this change, every fork (including renamed forks) gets the right base path automatically.

### 5. (Optional) Configure a custom domain

Settings → Pages → Custom domain. If you set one, also set `VITE_BASE: /` in the workflow, since custom domains serve from the root, not from `/<repo>/`.

---

## Triggering the first deploy

The workflow runs on push to `main` and via manual dispatch. After steps 1–4:

- Push any commit to `main`, **or**
- Actions tab → "Deploy to GitHub Pages" → "Run workflow".

Once the run finishes, the deployed URL appears in Settings → Pages and on the workflow run summary. Expect `https://<owner>.github.io/<repo>/`.

---

## Things that are already wired up (no action needed)

- **SPA routing on Pages.** `package.json` has a `postbuild` script that copies `dist/index.html` to `dist/404.html`. GitHub Pages serves `404.html` for unknown paths, which lets the React Router app handle client-side routes on deep links and refreshes.
- **Pages permissions.** `deploy.yml` already requests `pages: write` and `id-token: write`, which `actions/deploy-pages@v4` requires.
- **Concurrency.** The workflow uses `concurrency: pages` with `cancel-in-progress: false` so overlapping pushes queue rather than clobber each other.

---

## Verifying it worked

1. Actions tab shows the "Deploy to GitHub Pages" run as green.
2. Settings → Pages shows "Your site is live at https://&lt;owner&gt;.github.io/&lt;repo&gt;/".
3. Open the URL. Hard-refresh a deep link (e.g. `/some-route`) — it should load, not 404. If you get a 404 on refresh, the `postbuild` step did not run; check the build log.
4. Open DevTools → Network. Asset requests should resolve under `/<repo>/assets/...`. If they 404 with paths like `/assets/...` (no repo prefix), `VITE_BASE` was wrong at build time — revisit step 4.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Workflow doesn't run on the fork | Actions disabled on forks by default | Step 2 |
| `actions/deploy-pages` fails with "Pages site not found" | Pages source not set to "GitHub Actions" | Step 3 |
| Site loads but assets 404 | `VITE_BASE` doesn't match `/<repo>/` | Step 4 |
| Deep-link refresh returns 404 | `postbuild` 404.html copy missing or Pages cache stale | Re-run the workflow; verify `dist/404.html` exists in build logs |
| Custom domain set but assets 404 | Base path still `/<repo>/` | Step 5 — set `VITE_BASE: /` |
| "Resource not accessible by integration" | Workflow `permissions:` block stripped or fork enforces read-only token | Settings → Actions → General → Workflow permissions: "Read and write permissions" |

---

## Related docs

- [HOSTING.md](./HOSTING.md) — overall remote / Dolt / Pages architecture for the canonical project
