# COE (Correction of Errors)

Post-incident or post-failure learning document. Updates **mechanisms** — and often **specs** — so agents and humans don't repeat the failure.

Focus: what broke, why, how to prevent. **No blame by name.**

---

## When to use

| Use COE | Use something else |
|---------|-------------------|
| Production incident | Near-miss with no impact → lighter doc |
| Spec led agent to build wrong thing | Planned decision → 1-pager |
| Process failure with customer impact | New product idea → PR/FAQ |
| Repeated class of errors | Single principle gap → add Tenet |

---

## Structure

### 1. Summary (5 sentences max)

What happened. Customer/business impact in **numbers**. Duration. Current status.

### 2. Timeline

| Time (UTC) | Event |
|------------|-------|
| | |

Factual. No adjectives.

### 3. Root cause

One primary cause. Use 5 Whys if needed.

- Bad: "Human error"
- Good: "Deploy pipeline did not run integration tests on config-only changes"

### 4. What went well

What limited blast radius. Credit mechanisms that worked.

### 5. Corrective actions

| Owner | Action | Due date | Verification |
|-------|--------|----------|--------------|

Every action: measurable verification ("add test X passes in CI").

### 6. Lessons / mechanism changes

What changes in specs, tenets, monitors, or agent rules.

---

## Spec-driven COE (agent failures)

When an agent built the wrong thing because the spec was wrong:

| Section | Content |
|---------|---------|
| Root cause | Spec ambiguity — quote the sentence |
| Corrective action | Update PR/FAQ § internal FAQ Q[n] |
| Agent rule | Add tenet or lint blocker |
| Verification | Re-lint spec; re-run agent on FUND only |

Do not "retrain the agent" without fixing the spec.

---

## Writing rules

- Impact in numbers: downtime minutes, users affected, $ at risk
- No individual blame — roles and mechanisms
- "We will try to" → committed date or IDK BY [date]
- Sentences under 30 words

---

## Anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| Vague root cause | Name mechanism gap |
| Actions without owners | Every row complete |
| COE with no spec update | Link to PR/FAQ/tenet change |
| Blame by name | Role + process only |

---

## Lint checklist

- [ ] Impact quantified
- [ ] Timeline complete
- [ ] Root cause is mechanism
- [ ] Corrective actions verifiable
- [ ] Spec/tenet updates linked if applicable
- [ ] No weasel words
