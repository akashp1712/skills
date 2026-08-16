# Spec-driven development with Amazon documents

These formats are not legacy corporate paperwork. In the agent era they function as **structured specs** — readable by humans in meetings and by agents before implementation.

## The problem spec-driven development solves

| Failure mode | Without a spec | With Amazon-format spec |
|--------------|----------------|-------------------------|
| Agent builds wrong thing | Vague prompt | PR/FAQ problem paragraph → traceable requirements |
| Human approves vague idea | Slide deck | Narrative memo → silent read exposes gaps |
| Scope creep | "While we're at it…" | Internal FAQ: what we are **not** building |
| Hedged requirements | "probably need auth" | Yes / No / number / IDK BY Friday |
| No kill switch | Sunk cost continues | FUND / KILL / REVISE gate |

## How each doc type maps to agent work

| Doc type | Human use | Agent use |
|----------|-----------|-----------|
| **PR/FAQ** | Working Backwards product review | **Primary feature spec** — PR = outcome, FAQ = requirements + risks |
| **1-pager** | Fast leadership decision | **Gate** before agent spends tokens on implementation |
| **6-pager** | Strategy / investment meeting | Multi-milestone context; agent reads once per initiative |
| **Tenets** | Team alignment | Hard constraints in system prompt or agent rules |
| **COE** | Post-incident learning | Update specs, tenets, or mechanisms after failure |

## Recommended repo layout (optional)

When user has a codebase:

```
specs/
  feature-x-prfaq.md      # PR/FAQ — source of truth
  feature-x-1pager.md     # decision gate (optional)
docs/
  tenets.md               # team principles
```

Agent workflow:

1. Human + agent draft PR/FAQ → lint with amazon-writing
2. Meeting → FUND / KILL / REVISE
3. On FUND: agent implements against PR/FAQ only; flags drift
4. On REVISE: agent does not implement until spec updated

## What to add for agents (beyond classic Amazon)

Classic Amazon docs target human leadership. For agents, each spec should also include:

### In scope

Bullet list of what this spec authorizes building. Verbs + objects. Testable.

### Out of scope

Explicit non-goals. Prevents agent scope creep. "We are not building mobile app in v1."

### Acceptance signals

How humans and agents know done:

- Metric threshold (e.g. p90 < 200 ms)
- User-visible behavior (e.g. plumber receives SMS within 30s)
- Automated test category (e.g. integration tests for booking flow)

### Kill criteria

When to stop:

- Metric does not move after N weeks
- Unit economics below X
- Customer quote test fails in interviews

### Open questions

Each: question + owner + **I DON'T KNOW BUT I'LL KNOW IT BY [X]**

## Lint: agent readiness checklist

Before FUND or before handing to coding agent:

- [ ] Every requirement traces to problem paragraph or internal FAQ answer
- [ ] No weasel words in requirements
- [ ] Non-goals section exists
- [ ] Acceptance signals are testable
- [ ] Biggest risk named with mitigation or IDK-by-X
- [ ] Four-answer form on all factual claims

## PR/FAQ as the flagship agent spec

Why PR/FAQ beats a generic `spec.md`:

- **Press release** forces customer outcome first (agents often start with solution)
- **External FAQ** = user-facing requirements
- **Internal FAQ** = engineering, economics, risks — where agents usually fail silently
- **Customer quote test** — if quote is unbelievable, spec is not ready

See [pr-faq.md](pr-faq.md) for full template.

## Relationship to four-answers

[four-answers](../../four-answers/SKILL.md) enforces Rule 5 during Q&A and inline claims.

amazon-writing enforces full document structure + Rules 1–4 + agent spec blocks.

Use both when building spec-driven workflows.
