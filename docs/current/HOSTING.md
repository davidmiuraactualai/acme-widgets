# Hosting & Repo Architecture

The acme-widgets training project is one local working tree synced to **two GitHub remotes** plus **one Dolt remote**. This split keeps the beads issue database private while letting the public site host on free GitHub Pages with free GitHub Actions CI.

## Remotes

| Name      | URL                                                  | Carries                                                             | Why                                                                    |
| --------- | ---------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `origin`  | `git@github.com:bryanhirsch/acme-widgets-private.git` | Source code + `.beads/` config + Dolt branches (issue data)         | Private repo holds the beads/Dolt data we don't want public            |
| `public`  | `git@github.com:bryanhirsch/acme-widgets.git`         | Source code only (same `main` branch contents, no Dolt branches)    | Public repo unlocks **free** GitHub Pages hosting + GitHub Actions CI  |
| Dolt      | `git+ssh://git@github.com/bryanhirsch/acme-widgets-private.git` (via `bd dolt remote`) | Dolt issue data on orphan branches inside the private repo          | Issue tracker (beads) data is sensitive; never goes to the public repo |

## Branch and push strategy

There is **one** branch — `main` — and the same commits go to both git remotes.

```bash
git push origin main      # push source + .beads/ config tracked files (private)
git push public main      # push source to public (Pages + CI run from here)
bd dolt push              # push Dolt issue data to private remote on Dolt branches
```

The Dolt branches (`build1.0.0/nyc1`, `workshop1.0.0/nyc1`, etc.) live on the **private** remote only and are managed by `bd dolt push`/`pull`. They are not part of the `main` branch history that the public remote sees.

## What ends up where

- **Public remote (`public`):** the `main` branch only. No Dolt branches. The `.beads/` config files (`config.yaml`, hooks, `metadata.json`) are technically present in tree, but they contain no issue content — only project bootstrap metadata. The actual issue data lives in Dolt and never reaches the public remote.
- **Private remote (`origin`):** the `main` branch **plus** the Dolt branches. This is the source of truth for both code and issue tracking.
- **GitHub Pages:** deploys from the **public** remote. Free tier requires a public repo.
- **GitHub Actions CI:** runs on the **public** remote. Free tier for public repos.

## Working with this setup

- For **issue tracking** (`bd ready`, `bd close`, etc.): operate normally; `bd dolt push` syncs to the private Dolt remote.
- For **shipping code**: push to both remotes. The deploy/CI workflows live on `public/main`.
- For **fresh clones**: clone the **private** repo first (`git@github.com:bryanhirsch/acme-widgets-private.git`) to get the beads bootstrap config, run `bd bootstrap` to clone the Dolt issue data, then add the `public` remote so you can push code there too.

## Why not one repo?

- A purely **public** repo would expose the beads issue database (issues, decisions, planning notes) to anyone.
- A purely **private** repo would require a paid GitHub plan for Pages and Actions on private repos.
- Splitting code (public) from issue tracker data (private, in Dolt branches on the private remote) keeps everything free while keeping the project notes private.

## Hosting the public repo (or a fork)

- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) — enabling and configuring Actions on a fork.
- [GITHUB_PAGES.md](./GITHUB_PAGES.md) — Pages setup, base-path config, and SPA routing.
