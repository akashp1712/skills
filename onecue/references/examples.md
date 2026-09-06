# Examples

The north-star fixture. If this fails, M1 is not done.

## Session A — remember

User:

```text
Remember that the queue uses Postgres SKIP LOCKED instead of Redis.
Redis reconnect duplicated jobs.
```

Write `.onecue/memories/2026-09-06-0941-decision-queue-skip-locked.md`:

```md
---
kind: decision
project: unknown
captured_at: 2026-09-06T09:41:00Z
source: claude-code
tags: [queue, postgres, redis]
---

# Queue uses SKIP LOCKED, not Redis

The queue intentionally uses Postgres SKIP LOCKED instead of Redis.

## Why it mattered

Redis reconnect behaviour caused duplicate queued jobs.

## Revisit when

Someone proposes making the queue faster, switching brokers, or introducing Redis.
```

Reply:

```text
Remembered — queue uses SKIP LOCKED because Redis reconnect duplicated jobs.
```

## Session B — resurface

Days later, a new session, related prompt:

```text
Claude, make the queue faster.
```

Cue:

```text
OneCue · 2026-09-06

The queue uses Postgres SKIP LOCKED instead of Redis. Redis reconnect duplicated jobs.

Why now: this prompt asks to make the queue faster, which is the condition that previously rejected Redis.
```

## Session B — silence

Same store, unrelated prompt:

```text
Tighten the landing-page hero spacing.
```

Return nothing about OneCue. Do not mention that memories exist.

## Explicit search

User:

```text
What did we previously decide about the queue?
```

Multiple matches are allowed. Still include the reason. Still do not invent files.
