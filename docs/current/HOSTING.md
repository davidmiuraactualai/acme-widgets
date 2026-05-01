# Hosting & Repo Architecture

The acme-widgets training project is one local working tree synced to **two GitHub remotes** plus **one Dolt remote**. The Git source — all branches — is fully shared with the public remote; only the Dolt issue-tracker database stays private.

## Remotes

| Name     | URL                                                                                    | Carries                                                                | Why                                                                   |
| -------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `origin` | `git@github.com:bryanhirsch/acme-widgets-private.git`                                  | All Git branches + `.beads/` config + Dolt branches (issue data)       | Private repo holds the Dolt issue data we don't want public           |
| `public` | `git@github.com:bryanhirsch/acme-widgets.git`                                          | All Git branches (no Dolt branches)                                    | Public repo unlocks **free** GitHub Pages hosting + GitHub Actions CI |
| Dolt     | `git+ssh://git@github.com/bryanhirsch/acme-widgets-private.git` (via `bd dolt remote`) | Dolt issue data on orphan branches inside the private repo            | Issue tracker (beads) data is sensitive; never goes to the public repo |

## Branches

| Branch           | Purpose                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| `development`    | Main development branch — where the demo website for the workshop gets built         |
| `dev/start-here` | Workshop starting point for participants                                             |
| `dev/<slug>`     | Targeted starting points for individual modules and lessons (WIP scaffolds)          |

Every Git branch above is pushed to **both** remotes. Only the Dolt orphan branches (`build1.0.0/nyc1`, `workshop1.0.0/nyc1`, etc.) stay on the private remote; they're managed by `bd dolt push` / `bd dolt pull`.

## Pushing

```bash
git push origin <branch>     # private remote (also receives Dolt branches via bd dolt push)
git push public <branch>     # public remote (Pages + CI run from here)
bd dolt push                 # push Dolt issue data to the private remote
```

For convenience, configure a single `both` remote whose push URLs cover origin and public, so `git push both <branch>` updates both repos in one shot.

## What ends up where

- **Public remote (`public`):** every Git branch (`development`, `dev/start-here`, `dev/<slug>`, …). No Dolt branches. The `.beads/` config files are present in tree but contain no issue content — only project bootstrap metadata.
- **Private remote (`origin`):** every Git branch **plus** the Dolt branches. Source of truth for both code and issue tracking.
- **GitHub Pages:** deploys from the **public** remote. Free tier requires a public repo.
- **GitHub Actions CI:** runs on the **public** remote. Free tier for public repos.

## Working with this setup

- For **issue tracking** (`bd ready`, `bd close`, etc.): operate normally; `bd dolt push` syncs to the private Dolt remote.
- For **shipping code**: push the relevant branch to both remotes (or to a configured `both` remote). The deploy/CI workflows run on the public remote.
- For **fresh clones**: clone the **private** repo first (`git@github.com:bryanhirsch/acme-widgets-private.git`) to get the beads bootstrap config, run `bd bootstrap` to clone the Dolt issue data, then add the `public` remote so you can push code there too.

## Why not one repo?

- A purely **public** repo would expose the Dolt issue database (issues, decisions, planning notes) to anyone.
- A purely **private** repo would require a paid GitHub plan for Pages and Actions on private repos.
- Splitting Git history (public, all branches) from issue-tracker data (private, in Dolt branches on the private remote) keeps everything free while keeping the issue tracker private.

## Hosting the public repo (or a fork)

- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) — enabling and configuring Actions on a fork.
- [GITHUB_PAGES.md](./GITHUB_PAGES.md) — Pages setup, base-path config, and SPA routing.
