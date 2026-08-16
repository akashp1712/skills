# PR/FAQ

Amazon **Working Backwards** document — the **flagship spec** for new products, features, and agent-built systems.

Write **before** code. Customer outcome first. Press release ≤ **1 page**. FAQ ≤ **5 pages**. Total ≤ 6 pages.

Sources:
- [Working Backwards PR/FAQ template](https://workingbackwards.com/resources/working-backwards-pr-faq/)
- [About Amazon — PR/FAQ process](https://www.aboutamazon.com/news/workplace/an-insider-look-at-amazons-culture-and-processes)

---

## When to use

| Use PR/FAQ | Do NOT use PR/FAQ |
|------------|-------------------|
| Net-new product or major feature | Small bug fix, reversible tweak |
| One-way door / quarter-scale bet | Tech debt unless customer-facing |
| Agent feature spec (recommended) | Internal refactor with no customer story |
| Need FUND/KILL/REVISE before build | Already funded; use 6-pager for updates |

Amazon teams often write **10+ drafts** before FUND. Expect iteration.

---

## Spec-driven role (agents + humans)

| Section | Human reader gets | Agent reader gets |
|---------|-------------------|-------------------|
| Press release | Customer value story | **Outcome spec** — what "done" looks like for users |
| Problem paragraph | Empathy + priority | **Requirements source** — trace every feature here |
| Solution paragraph | Experience design | **Behavior spec** — not implementation |
| External FAQ | GTM, pricing, support | User-facing constraints |
| Internal FAQ | Economics, risks | **Engineering spec + kill criteria** |
| Customer quote | Viability test | If quote fails, agent should not build |

Add agent blocks from [spec-driven.md](spec-driven.md): in scope, out of scope, acceptance signals, kill criteria.

---

## Press release (write as if product launched)

Future tense. Customer-readable. No internal jargon in headline.

### Required elements (in order)

1. **Heading** — Product name + primary customer benefit (one line)

   Template: `[Product] helps [customer] to [outcome]`

2. **Subheading** — Who it's for, what it does, single most important outcome (2–3 sentences)

3. **Summary paragraph** — Dateline, product name, problem, high-level solution (≤5 sentences)

4. **Problem paragraph** — Customer pain only. Specific. Ranked. No solution yet.

   - Bad: "Teams struggle with reporting"
   - Good: "PMs at 50–200 engineer companies spend 3 hours/week reformatting spreadsheets into slides for stakeholder updates"

5. **Solution paragraph** — How product changes customer experience. Maps 1:1 to problems above.

6. **Customer quote** — Fictional but believable. Named role + company type. If you can't write it, value prop is unclear.

7. **Leader quote** — Why company built this. Why now.

8. **How to get started** — URL, signup, pricing entry point

### Press release lint

- [ ] Headline understandable outside your industry
- [ ] Problem paragraph has no feature names
- [ ] Solution answers every ranked problem
- [ ] Customer quote sounds spoken, not marketing
- [ ] Zero weasel words

---

## FAQ — external (customer / press)

3–5 questions customers would actually ask:

- How much does it cost?
- How is this different from [alternative]?
- What are the limits?
- What data do you store?
- How do I get started?

Answers: four-answer form. Numbers where possible.

---

## FAQ — internal (the spec agents need)

**This section matters most.** Teams skip it; agents fail here.

Required question themes (adapt wording):

### Economics

- What does it cost per customer outcome at scale?
- When does this pay back?

### Quality bar

- How do we measure success? (metric + threshold)
- For AI features: what is the eval? What fails the bar?

### Biggest risk + premortem

- What kills this in 6 months?
- What did we assume that might be wrong?

### Scope boundary

- What are we explicitly **not** building in v1?

### Why now

- Why not last year? Why not wait?

### Dependencies

- What must be true for this to work? (team, API, legal)

Each answer: Yes / No / number / IDK BY [date]. No hedging.

---

## Agent spec appendix (recommended)

After internal FAQ, add:

```markdown
## Agent implementation spec

### In scope
- [verb + object, testable]

### Out of scope
- [explicit non-goals]

### Acceptance signals
- [metric or behavior + threshold]

### Kill criteria
- [when to stop]

### Open questions
| Question | Owner | IDK BY |
```

---

## Review meeting

Same as 6-pager: 20 min silent read → discussion → **FUND / KILL / REVISE**.

On REVISE: named owner + return date + missing evidence.

On FUND: agent may implement only against approved PR/FAQ text.

---

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| PR/FAQ for every ticket | Team learns to skim; format dies |
| Internal FAQ softball only | Real risks hidden from agents |
| Feature list in PR | Belongs in solution paragraph as outcomes |
| "Significantly better" | +X% or delete |
| Customer quote = marketing fluff | Fails believability test |
| Agent starts coding before FUND | Spec-driven violation |

---

## Example problem paragraph (good)

> Small plumbing businesses in Australia miss 30–40% of inbound calls while crews are on site. Each missed emergency call represents $320–$800 in lost booked work. Owners currently rely on voicemail; 70% of voicemail callers do not leave a callback number. Shops that respond within 5 minutes convert 3× more often than shops that respond after 30 minutes.

(Evercall-shaped — ties human story to agent-testable metrics.)

---

## vs 6-pager vs 1-pager

| | PR/FAQ | 6-pager | 1-pager |
|--|--------|---------|---------|
| **Trigger** | New product/feature | Complex ongoing initiative | Single decision |
| **Customer test** | Yes (press release) | Optional | Rare |
| **Agent primary spec** | **Yes** | Context doc | Gate only |
| **Max length** | 6 pages | 6 pages | 1 page |

---

## Lint checklist (full)

- [ ] Press release ≤ 1 page
- [ ] FAQ ≤ 5 pages
- [ ] Customer quote believable
- [ ] Internal FAQ has economics, risk, non-goals, why now
- [ ] All substantive answers: four-answer form
- [ ] Agent appendix if spec-driven
- [ ] No weasel words
- [ ] Sentences <30 words
- [ ] Decision: FUND / KILL / REVISE
