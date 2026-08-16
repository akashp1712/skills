#!/usr/bin/env python3
"""Scaffold the .mechanisms/ state directory for the team-of-one skill.

Existing files are never overwritten, so this is safe to re-run.

    python3 init.py                  # scaffold in the current directory
    python3 init.py --path ~/proj    # scaffold elsewhere
    python3 init.py --status         # report what exists, write nothing
"""

import argparse
import sys
from datetime import date
from pathlib import Path

TODAY = date.today().isoformat()

RESUME = f"""# Resume

Last session: {TODAY} · Branch: TBD

## The one thread
<the single outcome this session is buying>

## Next action (startable in 5 minutes)
<file path, function, line — could a stranger start this without asking?>

## State of play
- <what works, verified when>
- <what is half-built>

## Decided, do not re-open
- <closed decision> — see DECISIONS.md

## Tried and failed
- <negative result + commit SHA>

## Blocked / waiting
- <who or what, and the date to chase>

## Do not do this session
- <the refactor you keep eyeing>

## Parked
- <ideas that arrived mid-session — a list, not a branch>
"""

DECISIONS = f"""# Decisions

Append-only. Never edit an entry — supersede it with a newer one.
Type is `two-way` (reversible: decide in 10 min) or `ONE-WAY` (write a 1-pager).

Decide at ~70% of the information you wish you had. Waiting for 90% is slow.

## {TODAY} · Started keeping this log
Type: two-way · Deliberated: 0 min

Undo cost: none.

Ruled out: keeping decisions in my head — they do not survive a week away,
so they get re-debated at full price.
"""

BAR = """# Bar

Written in advance, before there is code to defend.
Changed only in a separate session — never at ship time.

## Ship bar (anything a customer touches)
- [ ] A stranger completes the core flow without asking me a question
- [ ] Works on a real device on mobile data, not just localhost
- [ ] Failure states show a human message, never a stack trace
- [ ] No hardcoded personal data, test accounts, or my own email
- [ ] Secrets are in env vars, verified not in the diff
- [ ] I have run the actual end-to-end path myself today

## Merge bar (internal, no customer impact)
- [ ] No TODO or commented-out block in the diff
- [ ] Readable in six weeks with no context
- [ ] Nothing broke that used to work

## Explicitly allowed to be bad
Naming these stops perfectionism from masquerading as standards.
- Test coverage below 100%
- Ugly internal code that works and is isolated
- Missing admin tooling — I am the only admin
"""

METRICS = """# Metrics

Manage inputs, not outputs. An input qualifies only if you can change it
this week by doing something specific, AND it plausibly moves the output.

Output (confirm monthly, do not manage to): <e.g. paying customers>. Now: <n>.

## Inputs (weekly, max 3)
1. <controllable action> — target <n>/wk
2. <controllable action> — target <n>/wk
3. <controllable action> — target <n>/wk

Test each: could I hit this number without helping anyone? If yes, it is
too crude — refine it.

Reviewed <day>, 15 minutes. Report variance only. Tactical, not strategic.

## Log
### week of <date>
  <input 1>   n / target
  <input 2>   n / target
Variance worth discussing: <the one binding constraint>
Action: <the one next thread>
"""

LEARNINGS = """# Learnings

Append-only. Every entry ends with a mechanism change, or it is just a loss.

The test for a correction: "be more careful next time" is a good intention,
not a mechanism. Ask instead — what makes this impossible next time?

Sources: COEs, weekly reviews, and anything a customer said that surprised you.
"""

FILES = {
    "RESUME.md": RESUME,
    "DECISIONS.md": DECISIONS,
    "BAR.md": BAR,
    "METRICS.md": METRICS,
    "LEARNINGS.md": LEARNINGS,
}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scaffold .mechanisms/ for the team-of-one skill."
    )
    parser.add_argument(
        "--path", default=".", help="repo root (default: current directory)"
    )
    parser.add_argument(
        "--status", action="store_true", help="report what exists, write nothing"
    )
    args = parser.parse_args()

    root = Path(args.path).expanduser().resolve()
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 1

    target = root / ".mechanisms"

    if args.status:
        if not target.is_dir():
            print(f"no .mechanisms/ in {root}")
            print("run without --status to scaffold it")
            return 0
        print(f".mechanisms/ in {root}")
        for name in FILES:
            path = target / name
            if path.exists():
                lines = len(path.read_text().splitlines())
                print(f"  present  {name:<15} {lines} lines")
            else:
                print(f"  MISSING  {name}")
        return 0

    target.mkdir(exist_ok=True)

    created, skipped = [], []
    for name, body in FILES.items():
        path = target / name
        if path.exists():
            skipped.append(name)
            continue
        path.write_text(body)
        created.append(name)

    for name in created:
        print(f"created  .mechanisms/{name}")
    for name in skipped:
        print(f"kept     .mechanisms/{name} (already exists)")

    if created:
        print()
        print("Commit these. They are the handoff between sessions.")
        print("Start with RESUME.md — fill it at the end of today's session.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
