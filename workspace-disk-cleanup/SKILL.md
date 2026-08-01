---
name: workspace-disk-cleanup
description: Scan a development workspace and remove regenerable dev caches (node_modules, .next, .venv, .turbo, etc.) from projects that have not been edited recently. Never deletes source code or .git. Use when the user asks to free disk space, clean stale node_modules, prune build artifacts, or tidy a monorepo/workspace.
user_invocable: true
---

# workspace-disk-cleanup

Safely reclaim disk space by deleting **only** regenerable dependency and build folders from **inactive** projects the user selects, with **one confirmation** before anything is removed.

## What gets deleted

Only these directory names at **project roots** (folders with `package.json`, `pyproject.toml`, etc.):

| Folder | Typical restore |
|--------|-----------------|
| `node_modules` | `pnpm install` / `npm install` |
| `.next` | `pnpm dev` / `next build` |
| `.turbo` | next Turbo run |
| `dist` / `build` | package build script |
| `.venv` / `venv` | `uv sync` / `pip install -r requirements.txt` |
| `.pytest_cache` / `.mypy_cache` | recreated on test/typecheck |

## What is never deleted

- Source trees, manifests, lockfiles, `.git`, or entire project folders

## Script

`workspace-disk-cleanup/scripts/clean_dev_artifacts.py` (stdlib + `du` on macOS/Linux)

### Options

| Flag | Default | Meaning |
|------|---------|---------|
| `--workspace` | `~/workspace` | **Any** directory to scan |
| `--threshold-days N` | `14` | Stale = no source file changes in the last **N** days |
| `--exclude` | (none) | Skip paths containing substring; repeat flag |
| `--list-only` | off | Numbered list only; no selection or delete |
| `--select` | (none) | `1,3,5` or `all` — which rows from the list |
| `--yes` | off | Skip final prompt (only after user confirmed in chat) |

“Last active” = latest mtime of non-artifact files under that project root.

## Interactive (human in terminal)

```bash
python3 scripts/clean_dev_artifacts.py --workspace ~/workspace --threshold-days 14
```

1. Prints numbered stale projects with sizes and cache types  
2. Prompts: `Select projects (1,3 / all / none)`  
3. Prompts once: `Type 'yes' to confirm`  
4. Deletes only selected projects’ artifact folders  

## Workflow for the agent (Claude)

1. Agree on **`--workspace`** (any path), **`--threshold-days`** (user may say e.g. “30 days”), and **`--exclude`** (active repo).
2. Run **`--list-only`** and show the numbered list to the user.
3. User picks numbers (or “all”) in chat.
4. Run again with **`--select <their choice>`** — do **not** pass `--yes` until the user explicitly confirms deletion in chat.
5. On confirmation, run the same command with **`--yes`** to perform deletion (non-interactive).
6. Summarize freed space and how to restore deps (`pnpm install`, `uv sync`, etc.).

**Example:**

```bash
# Step 1 — discover (threshold is configurable)
python3 scripts/clean_dev_artifacts.py \
  --workspace ~/workspace \
  --threshold-days 30 \
  --exclude voice/evercall \
  --list-only

# Step 2 — after user says "clean 1 and 3" and then "yes, go ahead"
python3 scripts/clean_dev_artifacts.py \
  --workspace ~/workspace \
  --threshold-days 30 \
  --exclude voice/evercall \
  --select 1,3 \
  --yes
```

## Install

```bash
npx skills add akashp1712/skills --skill workspace-disk-cleanup
```

## Safety rules

- Never delete without user selection + explicit confirmation (`--yes` or interactive `yes`).
- Do not change `--threshold-days` or removes `--exclude` without the user asking.
- Prefer **exclude** for the project they are actively working in.
