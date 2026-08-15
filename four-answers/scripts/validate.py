#!/usr/bin/env python3
"""Validate Four Answers output format."""

from __future__ import annotations

import re
import sys

VALID_STATES = ("YES", "NO", "DATA", "I DON'T KNOW")

HEDGING_PATTERNS = re.compile(
    r"\b("
    r"maybe|perhaps|probably|likely|unlikely|potentially|"
    r"could|might|seems|appears|arguably|generally|usually"
    r")\b",
    re.IGNORECASE,
)

OPINION_PATTERNS = re.compile(
    r"\b(i think|i believe)\b",
    re.IGNORECASE,
)


def validate(text: str) -> list[str]:
    errors: list[str] = []
    stripped = text.strip()

    if not stripped:
        return ["Empty response"]

    first_line = stripped.splitlines()[0].strip().upper()
    normalized = first_line.replace("’", "'")

    if normalized not in VALID_STATES:
        errors.append(
            "First line must be exactly one of: YES, NO, DATA, I DON'T KNOW"
        )

    body = "\n".join(stripped.splitlines()[1:]).strip()
    if not body:
        errors.append("Response must include an explanation after the state line")

    for match in HEDGING_PATTERNS.finditer(body):
        errors.append(f"Hedging word found: {match.group(0)}")

    for match in OPINION_PATTERNS.finditer(body):
        errors.append(f"Opinion phrase found: {match.group(0)}")

    return errors


def main() -> int:
    text = sys.stdin.read()
    errors = validate(text)

    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        return 1

    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
