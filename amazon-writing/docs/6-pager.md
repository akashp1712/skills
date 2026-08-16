# 6-Pager

Narrative memo for **silent-read meetings** — and for agents needing deep context on a complex initiative.

Max **6 pages** narrative (single-spaced 11pt equivalent). Appendices allowed; not required reading in the meeting.

Source culture: [About Amazon — narratives](https://www.aboutamazon.com/news/workplace/an-insider-look-at-amazons-culture-and-processes)

---

## When to use

| Use 6-pager | Use something else |
|-------------|-------------------|
| Strategy, investment, operating plan | Net-new product bet → PR/FAQ |
| Quarterly business review narrative | Fast decision → 1-pager |
| Multi-team alignment on complex initiative | Single principle → Tenets |
| Agent needs rich context across sprints | One-sprint gate → 1-pager |

---

## Meeting protocol (humans)

| Phase | Duration | Rules |
|-------|----------|-------|
| Silent read | 20 min | Everyone reads; no questions |
| Discussion | 35 min | Hardest questions first; line-by-line on disagreements |
| Decision | 5 min | **FUND / KILL / REVISE** spoken aloud |

No pre-read assumed. Doc must stand alone.

---

## Structure (required sections)

### 1. Executive summary (½ page max)

Conclusion first. A busy reader could stop here and know your ask.

Include: recommendation, key number, decision requested.

### 2. Context & background

Why this doc exists now. What changed. Link to prior decisions if any.

### 3. Problem / opportunity

Customer or business pain. **Rank problems** by severity. Data per problem.

Write from customer perspective where applicable. No solution in this section.

### 4. Analysis

Options considered. Tradeoffs. Evidence. Charts support prose — don't replace it.

For each option: benefits, costs, risks, why in/out.

### 5. Proposal

What you recommend. How it solves each ranked problem. Resource ask.

### 6. Risks & mitigations

Name the **biggest risk** explicitly. Premortem: "Six months from now this failed because..."

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|

### 7. Ask

Resources, timeline, decision. Same as 1-pager but may be larger in scope.

---

## Writing rules (6-pager specific)

- **Full paragraphs** — not slide bullets with periods
- **One idea per sentence** — under 30 words
- Each section passes "so what?" alone
- Cross-references: "As shown in Section 4.2..." — agents need explicit pointers
- Page budget: if section runs long, cut analysis before cutting risks

---

## Agent spec blocks

For initiatives spanning multiple agent sessions:

### Stable identifiers

Name the initiative once. Use same name in repo `specs/` path.

### Milestones

| Milestone | Acceptance signal | Target date |
|-----------|-------------------|-------------|

Agents implement one milestone at a time; 6-pager is the map.

### Non-goals

What this initiative explicitly does not include.

### Decision log

Major forks: date, decision, rationale (four-answer form).

---

## Anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| Slide deck pasted as memo | Rewrite as connected prose |
| Risks section generic | Name one risk that kills the project |
| No ask | Add explicit FUND/KILL/REVISE |
| 8 pages narrative | Cut or move to appendix |
| "We believe customers want..." | Customer data or IDK BY [interview date] |

---

## vs PR/FAQ

| 6-pager | PR/FAQ |
|---------|--------|
| Internal strategy / ops | Customer-facing product launch |
| Existing initiative deep dive | Net-new product Working Backwards |
| May assume reader knows company | Must stand alone for external customer test |

---

## Lint checklist

- [ ] Readable in 20 minutes
- [ ] Executive summary stands alone
- [ ] Problems ranked with data
- [ ] Biggest risk named with owner
- [ ] Full prose, not bullet slides
- [ ] All sentences <30 words
- [ ] Agent milestones if multi-sprint
- [ ] Ends FUND / KILL / REVISE
