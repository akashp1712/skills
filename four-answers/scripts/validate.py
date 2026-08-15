#!/usr/bin/env python3
"""Validate Four Answers output format (Bezos framework)."""

from __future__ import annotations

import re
import sys

YES_NO = frozenset({"YES", "NO"})

NUMBER_PATTERN = re.compile(
    r"^("
    r"\$?-?[\d,]+(?:\.\d+)?%?"  # 37, $12,400, 15%
    r"|"
    r"\d{4}-\d{2}-\d{2}"  # 2026-03-08
    r"|"
    r"[\d,]+(?:\.\d+)?[a-zA-Z/%]+"  # 4m12s, 1000/min, 5 frameworks shorthand
    r")$",
    re.IGNORECASE,
)

IDK_BY_X_PATTERN = re.compile(
    r"^I DON'T KNOW, BUT I'LL KNOW IT BY .+$",
    re.IGNORECASE,
)

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


def is_valid_first_line(line: str) -> bool:
    normalized = line.strip().upper().replace("’", "'")
    if normalized in YES_NO:
        return True
    if NUMBER_PATTERN.match(line.strip()):
        return True
    if IDK_BY_X_PATTERN.match(normalized):
        return True
    return False


def validate(text: str) -> list[str]:
    errors: list[str] = []
    stripped = text.strip()

    if not stripped:
        return ["Empty response"]

    first_line = stripped.splitlines()[0].strip()
    normalized = first_line.upper().replace("’", "'")

    if not is_valid_first_line(first_line):
        errors.append(
            "First line must be YES, NO, a number/measurement, or "
            "I DON'T KNOW, BUT I'LL KNOW IT BY X"
        )

    if normalized == "I DON'T KNOW":
        errors.append(
            "Bare I DON'T KNOW is not allowed — commit to when you'll know it"
        )

    body = "\n".join(stripped.splitlines()[1:]).strip()
    if not body and normalized not in YES_NO and not NUMBER_PATTERN.match(first_line):
        errors.append("Response should include context after the first line")

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
