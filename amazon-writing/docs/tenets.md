# Tenets

Durable **decision principles** for a team, product, or agent system. Outlive any single PR/FAQ.

Format: **Unless [condition], always [rule].**

Humans use tenets to align in meetings. Agents use tenets as **hard constraints** when judgment is required.

---

## When to use

| Use tenets | Use something else |
|------------|-------------------|
| Recurring debates need a default | One-off decision → 1-pager |
| Agent must not violate team values | Single feature → PR/FAQ |
| Principles survive personnel changes | Incident → COE |

---

## Structure per tenet

### 1. Statement

Unless X, always Y.

- Bad: "We value quality"
- Good: "Unless latency regresses p90 by >10%, always ship experiments to 5% of users before full rollout"

### 2. Rationale (2–4 sentences)

Why this prevents bad decisions. Include one data point if possible.

### 3. Example

Real decision this tenet resolved. Date + outcome.

### 4. Exception (optional)

When the tenet does not apply. Narrow — not "when leadership says so."

---

## Agent integration

Tenets belong in:

- `docs/tenets.md` or `AGENTS.md` constraint section
- Agent system prompt: "When in conflict, tenets override local optimization"
- PR/FAQ internal FAQ: "Which tenets does this feature test?"

Agent behavior: if action violates a tenet, **stop and ask** — do not silently comply with user prompt.

---

## Quality bar

| Count | Guidance |
|-------|----------|
| 5–7 tenets | Ideal — memorable |
| 8–10 | Max before dilution |
| 10+ | Split into product vs engineering tenets |

Each tenet must be **testable** — reader can check violation.

---

## Examples

**Unless** a change touches customer billing data, **always** deploy behind a feature flag with automatic rollback.

**Unless** we have 2 weeks of retention data, **always** treat growth metrics as directional, not decisive.

**Unless** the doc passes Amazonian lint, **always** block agent implementation (spec-driven teams).

---

## Anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| Leadership principles copy-paste | Team-specific tradeoffs only |
| "Move fast" without boundary | Unless [safety condition], always... |
| Untestable values | Rewrite as decision rule |
| Tenets never cited in decisions | Reference in 1-pagers and PR/FAQs |

---

## Lint checklist

- [ ] Unless/always form on every tenet
- [ ] Testable
- [ ] Example per tenet
- [ ] 5–10 total
- [ ] No weasel words
- [ ] Agent constraint section if used in repo
