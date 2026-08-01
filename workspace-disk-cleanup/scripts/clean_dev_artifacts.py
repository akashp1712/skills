#!/usr/bin/env python3
"""
Remove regenerable dev/build caches from inactive projects under a workspace root.

Deletes only known artifact directory names (node_modules, .next, etc.) — never source
files, lockfiles, or .git.

Usage:
  python3 clean_dev_artifacts.py --list-only
  python3 clean_dev_artifacts.py --workspace ~/code --threshold-days 30
  python3 clean_dev_artifacts.py --workspace ~/workspace --select 1,3 --yes
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

ARTIFACT_NAMES = frozenset(
    {
        "node_modules",
        ".next",
        "dist",
        "build",
        ".turbo",
        ".venv",
        "venv",
        ".pytest_cache",
        ".mypy_cache",
    }
)
PROJECT_MARKERS = ("package.json", "pyproject.toml", "Cargo.toml", "go.mod", "Gemfile")
PRUNE_DIRS = frozenset({".git", "node_modules", ".next", ".venv", "venv"})


@dataclass
class ArtifactDir:
    path: Path
    size_bytes: int


@dataclass
class StaleProject:
    root: Path
    last_active: datetime
    artifacts: list[ArtifactDir] = field(default_factory=list)

    @property
    def total_bytes(self) -> int:
        return sum(a.size_bytes for a in self.artifacts)


def du_bytes(path: Path) -> int:
    try:
        out = subprocess.check_output(["du", "-sk", str(path)], text=True)
        return int(out.split()[0]) * 1024
    except (subprocess.CalledProcessError, ValueError, FileNotFoundError):
        return 0


def path_is_excluded(path: Path, workspace: Path, exclude_substrings: list[str]) -> bool:
    rel = str(path.resolve())
    ws = str(workspace.resolve())
    if not rel.startswith(ws):
        return True
    for sub in exclude_substrings:
        if sub and sub in rel:
            return True
    return False


def find_project_roots(workspace: Path, exclude_substrings: list[str]) -> list[Path]:
    roots: list[Path] = []
    for dirpath, dirnames, filenames in os.walk(workspace):
        current = Path(dirpath)
        if path_is_excluded(current, workspace, exclude_substrings):
            dirnames[:] = []
            continue
        dirnames[:] = [
            d
            for d in dirnames
            if d not in PRUNE_DIRS and not d.startswith(".")
        ]
        if any(m in filenames for m in PROJECT_MARKERS):
            roots.append(current)
    return sorted(set(roots))


def latest_source_mtime(root: Path, workspace: Path, exclude_substrings: list[str]) -> float:
    latest = 0.0
    for dirpath, dirnames, filenames in os.walk(root):
        current = Path(dirpath)
        if path_is_excluded(current, workspace, exclude_substrings):
            dirnames[:] = []
            continue
        if set(current.parts) & ARTIFACT_NAMES:
            dirnames[:] = []
            continue
        dirnames[:] = [
            d
            for d in dirnames
            if d not in ARTIFACT_NAMES and d not in PRUNE_DIRS and not d.startswith(".")
        ]
        for name in filenames:
            try:
                latest = max(latest, (current / name).stat().st_mtime)
            except OSError:
                pass
    return latest


def artifacts_at_root(root: Path) -> list[Path]:
    return [root / name for name in ARTIFACT_NAMES if (root / name).is_dir()]


def scan_stale_projects(
    workspace: Path,
    threshold_days: int,
    exclude_substrings: list[str],
) -> list[StaleProject]:
    cutoff = time.time() - threshold_days * 86400
    stale: list[StaleProject] = []

    for root in find_project_roots(workspace, exclude_substrings):
        if path_is_excluded(root, workspace, exclude_substrings):
            continue
        act_ts = latest_source_mtime(root, workspace, exclude_substrings)
        if act_ts >= cutoff:
            continue
        dirs = artifacts_at_root(root)
        if not dirs:
            continue
        artifacts = [
            ArtifactDir(path=p, size_bytes=du_bytes(p)) for p in dirs
        ]
        stale.append(
            StaleProject(
                root=root,
                last_active=datetime.fromtimestamp(act_ts),
                artifacts=artifacts,
            )
        )

    stale.sort(key=lambda p: p.total_bytes, reverse=True)
    return stale


def format_size(n: int) -> str:
    if n >= 1_000_000_000:
        return f"{n / 1_000_000_000:.2f} GB"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.0f} MB"
    return f"{n / 1000:.0f} KB"


def print_stale_list(workspace: Path, projects: list[StaleProject]) -> None:
    if not projects:
        print("No stale projects with dev caches found.")
        return
    print(f"Found {len(projects)} stale project(s):\n")
    for i, proj in enumerate(projects, start=1):
        rel = proj.root.relative_to(workspace)
        names = ", ".join(a.path.name for a in proj.artifacts)
        print(
            f"  [{i}] {rel}\n"
            f"      last active: {proj.last_active.date()}  |  "
            f"~{format_size(proj.total_bytes)}  |  {names}"
        )
    total = sum(p.total_bytes for p in projects)
    print(f"\nTotal if all selected: ~{format_size(total)}")


def parse_selection(raw: str, count: int) -> list[int]:
    text = raw.strip().lower()
    if not text or text in ("none", "n", "q", "quit"):
        return []
    if text == "all":
        return list(range(1, count + 1))
    indices: list[int] = []
    for part in re.split(r"[\s,]+", text):
        if not part:
            continue
        if not part.isdigit():
            raise ValueError(f"invalid selection: {part!r}")
        n = int(part)
        if n < 1 or n > count:
            raise ValueError(f"out of range: {n} (1–{count})")
        if n not in indices:
            indices.append(n)
    return sorted(indices)


def prompt_selection(count: int) -> list[int]:
    print(
        "\nSelect projects to clean (comma-separated numbers, 'all', or 'none'): ",
        end="",
        flush=True,
    )
    try:
        raw = input().strip()
    except EOFError:
        return []
    try:
        return parse_selection(raw, count)
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr)
        return []


def confirm_once(selected: list[StaleProject]) -> bool:
    total = sum(p.total_bytes for p in selected)
    n_dirs = sum(len(p.artifacts) for p in selected)
    print(
        f"\nRemove dev caches from {len(selected)} project(s) "
        f"({n_dirs} folders, ~{format_size(total)})?"
    )
    print("Type 'yes' to confirm: ", end="", flush=True)
    try:
        answer = input().strip().lower()
    except EOFError:
        return False
    return answer in ("yes", "y")


def remove_projects(projects: list[StaleProject]) -> int:
    freed = 0
    for proj in projects:
        for art in proj.artifacts:
            shutil.rmtree(art.path, ignore_errors=False)
            freed += art.size_bytes
    return freed


def main() -> int:
    parser = argparse.ArgumentParser(
        description="List stale dev caches, let you choose projects, confirm once, then delete."
    )
    parser.add_argument(
        "--workspace",
        type=Path,
        default=Path.home() / "workspace",
        help="Root directory to scan (any path; default: ~/workspace)",
    )
    parser.add_argument(
        "--threshold-days",
        type=int,
        default=14,
        metavar="N",
        help="Treat projects as stale if no source file changed in N days (default: 14)",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        help="Skip paths containing this substring (repeatable), e.g. voice/evercall",
    )
    parser.add_argument(
        "--list-only",
        action="store_true",
        help="Only list stale projects (numbered); do not delete",
    )
    parser.add_argument(
        "--select",
        metavar="NUMS",
        help="Project numbers from the list, e.g. 1,3,5 or 'all' (non-interactive)",
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip the final yes/no prompt (use only after the user already confirmed)",
    )
    args = parser.parse_args()

    workspace = args.workspace.expanduser().resolve()
    if not workspace.is_dir():
        print(f"error: workspace not found: {workspace}", file=sys.stderr)
        return 1

    projects = scan_stale_projects(workspace, args.threshold_days, args.exclude)

    print(f"Workspace: {workspace}")
    print(f"Stale if inactive for: {args.threshold_days} days")
    if args.exclude:
        print(f"Exclude: {', '.join(args.exclude)}")
    print()

    print_stale_list(workspace, projects)

    if args.list_only or not projects:
        return 0

    selected: list[StaleProject] = []

    if args.select is not None:
        try:
            indices = parse_selection(args.select, len(projects))
        except ValueError as e:
            print(f"error: {e}", file=sys.stderr)
            return 1
        selected = [projects[i - 1] for i in indices]
    elif sys.stdin.isatty():
        indices = prompt_selection(len(projects))
        selected = [projects[i - 1] for i in indices]
    else:
        print(
            "\nNot interactive: use --list-only to inspect, then "
            "--select 1,2,... and --yes after the user confirms.",
            file=sys.stderr,
        )
        return 0

    if not selected:
        print("Nothing selected. No changes made.")
        return 0

    print("\nSelected:")
    for proj in selected:
        rel = proj.root.relative_to(workspace)
        print(f"  - {rel} (~{format_size(proj.total_bytes)})")

    if not args.yes:
        if sys.stdin.isatty():
            if not confirm_once(selected):
                print("Cancelled. No changes made.")
                return 0
        else:
            print(
                "error: non-interactive run requires --yes after user confirmation",
                file=sys.stderr,
            )
            return 1

    freed = remove_projects(selected)
    print(f"\nDone. Freed ~{format_size(freed)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
