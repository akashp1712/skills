# Memory file template

Filename:

`YYYY-MM-DD-HHMM-<kind>-<short-slug>.md`

Kinds: `decision` | `discovery` | `insight` | `open_loop` | `reference`

```md
---
kind: decision
project: <repo name or unknown>
captured_at: <ISO timestamp when known>
source: claude-code
tags: [queue]
---

# <short descriptive title>

<one self-contained paragraph: what was learned>

## Why it mattered

<the reason, trade-off, evidence, or future condition>

## Revisit when

<concrete trigger, or Unknown>
```

Rules:

- One learning per file.
- The reason is required. A conclusion without a reason is not a memory.
- Do not invent `captured_at`, `project`, or `source`.
- Never write secrets.
