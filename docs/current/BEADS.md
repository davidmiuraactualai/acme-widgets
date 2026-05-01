# Beads setup for this repo

Beads (`bd`) is the issue tracker used by this project. This document covers **how to set up beads on a new clone** — see `.beads/README.md` and `bd prime` for everyday usage.

## Three setup modes

Beads supports three storage layouts. Pick whichever fits how you work — they all read and write the same issues, and **different developers on the same repo can use different modes** (see "Per-developer override" below).

The committed `.beads/metadata.json` records the team default. If you cloned this repo and that default works for you, just run `bd bootstrap`. If you want a different local layout, set the override in `.beads/.env` (gitignored) before running `bd bootstrap`.

| Mode | Where data lives | Concurrency | When to pick it |
|---|---|---|---|
| **1. Embedded (default)** | `.beads/embeddeddolt/` (per project) | Single writer | One project, one developer, no coordination needed |
| **2. Stand-alone server** | `~/.beads/shared-server/dolt/` | Multi-writer | One project on this machine, but you want concurrent agents/processes (e.g. multiple Claude sessions) |
| **3. GC rig (shared server)** | `~/.beads/shared-server/dolt/` (joins existing) | Multi-writer | This is one of several beads-tracked projects on your machine — they all share one local dolt server |

Modes 2 and 3 use the same `bd` command and the same `~/.beads/shared-server/` location — the only difference is whether the shared server already exists on your machine. `bd init --shared-server` and `bd bootstrap` both auto-detect and do the right thing.

## Mode 1: Stand-alone with embedded dolt

**Starting fresh (this repo doesn't have beads yet):**
```bash
bd init
```
Creates `.beads/` with `metadata.json` showing `"dolt_mode": "embedded"`, plus the embedded database under `.beads/embeddeddolt/`.

**Cloning a repo that already uses beads:**
```bash
bd bootstrap
```
Reads the committed `metadata.json`, sets up your local `.beads/embeddeddolt/` from the repo's tracked state. Never destroys data — safe to run on first clone or to repair a broken setup.

## Mode 2: Stand-alone with shared dolt server

**Starting fresh:**
```bash
bd init --shared-server
```
Starts (or reuses) the dolt sql-server at `~/.beads/shared-server/`, registers this project there, and writes `metadata.json` with the shared-server config.

**Cloning a repo that already uses beads:**
```bash
bd bootstrap
```
If the committed `metadata.json` says shared-server, `bd bootstrap` will start your local shared server (if not already running) and register this project. If the committed `metadata.json` says embedded but you want shared-server locally, see "Per-developer override" below before running `bootstrap`.

## Mode 3: GC rig — joining an existing shared server

This is the same setup as Mode 2 — the only thing that changes is that `~/.beads/shared-server/` already exists from another project on your machine. `bd init --shared-server` and `bd bootstrap` both detect the running server and connect to it; you don't pass any extra flags.

**To verify your rig is healthy after adding this project:**
```bash
bd dolt status        # should show the shared server is running
bd dolt show          # shows host/port/database for this project
ls ~/.beads/shared-server/
```

If the shared server isn't running yet, `bd dolt start` will bring it up.

## Per-developer override (`.beads/.env`)

`metadata.json` is committed and represents the team default. To use a different mode locally **without** changing what's committed, create `.beads/.env` (already gitignored). bd loads it on every command.

**Switch from embedded → shared-server locally:**
```bash
# .beads/.env
BEADS_DOLT_SERVER_MODE=1
BEADS_DOLT_SERVER_HOST=127.0.0.1
BEADS_DOLT_SERVER_PORT=3307     # or whatever your shared server is on
BEADS_DOLT_SERVER_USER=root
# BEADS_DOLT_PASSWORD=...        # only if you set one
```

**Override just the port** (e.g. another service is squatting on 3307):
```bash
# .beads/.env
BEADS_DOLT_SERVER_PORT=3317
```

The committed `metadata.json` stays untouched — other developers see the team default; you see your override. Confirm with `bd dolt show` (server modes only; embedded mode rejects this command).

## What's committed vs. local-only

Already configured by `.beads/.gitignore` — you don't need to change anything:

- **Committed:** `metadata.json`, `config.yaml`, `.beads/.gitignore`, `README.md`
- **Gitignored (per-machine):** `.beads/.env`, `embeddeddolt/`, `dolt/`, `dolt-server.port`, `dolt-server.pid`, `dolt-server.log`, `*.lock`, `push-state.json`, `last-touched`, `interactions.jsonl`

Port numbers are never shared — bd writes the live port to `dolt-server.port` at runtime, which is gitignored.
