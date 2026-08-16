# 1-Pager

One-page **decision spec**. Use when leadership or an agent needs a fast **recommendation with an explicit ask** — not full product discovery.

**Human:** escalation, go/no-go, budget approval.  
**Agent:** decision gate — do not implement until 1-pager ends in FUND or REVISE with clear scope.

---

## When to use

| Use 1-pager | Use something else |
|-------------|-------------------|
| Approve/reject a bounded decision | Net-new product → PR/FAQ |
| Choose between 2–3 known options | Deep strategy → 6-pager |
| Gate before agent sprint on a feature | Post-incident → COE |
| Weekly leadership sync decision | Durable rules → Tenets |

---

## Structure (required sections)

### 1. Title

Decision in one line. Not a topic — a verdict request.

- Bad: "Database migration"
- Good: "Approve PostgreSQL migration for billing service by Q2"

### 2. Context (3–5 sentences max)

Only what the reader needs to decide today. No history lecture.

State: current state, why now, what happens if we don't decide.

### 3. Problem

What is broken or at risk. **Data required.**

- Bad: "Performance is unacceptable"
- Good: "Billing API p90 latency is 840 ms; SLA is 200 ms. 12 enterprise accounts flagged in QBR."

### 4. Recommendation

Lead with the answer. First sentence = your proposal.

- Bad: "After analysis, we might consider..."
- Good: "Migrate billing read path to PostgreSQL read replica by May 15."

### 5. Alternatives considered

| Option | Why rejected |
|--------|--------------|
| A — do nothing | Continues SLA breach; churn risk on 3 accounts |
| B — cache layer only | Fixes 40% of reads; does not address write path |
| C — **full migration (recommended)** | Meets SLA; 6-week effort |

### 6. Next steps

| Owner | Action | Date |
|-------|--------|------|
| [name] | [verb + object] | [date] |

Every row needs all three columns.

### 7. Ask

One sentence. What you need from the reader **today**.

- "Approve $40k contractor budget and May 15 target date."
- "Reject option B and authorize PR/FAQ for full platform rebuild."

---

## Agent spec blocks (add for spec-driven work)

When this 1-pager gates agent implementation:

### In scope (if FUND)

What the agent may build after approval.

### Out of scope

What the agent must not build even if "related."

### Acceptance signals

Testable done criteria.

### Open questions

IDK BY [X] format only.

---

## Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| Recommendation on page 2 | Busy reader decides without it |
| "We should explore..." | Not a decision — REVISE or KILL |
| Bullets without verbs | Agents can't parse actions |
| No ask | Meeting ends with no FUND/KILL/REVISE |
| Weasel words in recommendation | "Probably migrate" → not executable |

---

## Example (abbreviated)

**Title:** Approve 2-week experiment: AI missed-call SMS for Sydney plumbers

**Context:** Evercall pilots with 3 plumbing businesses. Missed calls average 4.2/day per shop. Competitors use generic AI receptionists not tuned for trades.

**Problem:** Without automated SMS recovery, shops lose an estimated $320–$800 per missed emergency call ([Evercall](https://evercall.ai) pilot data).

**Recommendation:** Run 2-week SMS recovery experiment with 10 Sydney plumbers. Measure booked-job rate from missed calls.

**Alternatives:** (1) Full AI voice — rejected, 6-week build. (2) Manual callback — rejected, doesn't scale.

**Next steps:** Akash — ship SMS flow by Apr 1. Pilot lead — recruit 10 shops by Mar 28.

**Ask:** Approve experiment and $2k SMS spend cap.

---

## Lint checklist

- [ ] Recommendation in first half of doc
- [ ] Problem has numbers
- [ ] Alternatives table complete
- [ ] Next steps have owner + date
- [ ] Clear ask
- [ ] No weasel words
- [ ] Agent blocks present if spec-driven gate
- [ ] Decision: FUND / KILL / REVISE
