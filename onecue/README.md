# OneCue

Durable project memory for Claude Code.

**Stop re-teaching Claude your project.**

```bash
npx skills add akashp1712/skills --skill onecue
```

Same skill from the dedicated repo:

```bash
npx skills add akashp1712/onecue-skill
```

Browse: [skills.sh/akashp1712/skills](https://skills.sh/akashp1712/skills)

## Store your first learning

Tell Claude:

```text
Remember that the queue uses Postgres SKIP LOCKED instead of Redis.
Redis reconnect duplicated jobs.
```

## Get it back

Later, in a new session:

```text
make the queue faster
```

OneCue returns **one** sourced cue, or stays silent.

Silence is success.

## What it is

[Memorable](https://memorable.sh) stores how the agent solved a task.

OneCue stores what **this repository** learned, and whether that learning deserves to interrupt Claude now.

Local files only for M1:

```text
.onecue/memories/
```

No account. No cloud. No dashboard.

## What gets remembered

- decisions and why they were made
- approaches tried and rejected
- debugging discoveries
- architectural constraints
- open loops worth resuming

Routine chatter stays disposable. A conclusion without a reason is not a memory.

## Try it

```text
Remember that we decided not to turn the product into a CRM until customer demand proves it.
The reason is to protect the narrow after-hours booking wedge.
```

Later:

```text
What did we previously decide that is relevant to the job-management code I'm changing?
```

A strong match returns one concise cue. A weak match returns nothing.

## Status

Ask Claude: `OneCue status`

It should report only whether `.onecue/memories/` exists and how many files are there.

## What M1 does not do

Hooks, CLI, cloud sync, browser capture, and automatic prompt injection come later. Canonical spec: OneCue 6-pager in the product repo.

## License

MIT
