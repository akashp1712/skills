---
name: amazon-writing
description: Write and lint Amazon-style specs and narratives — 1-pager, 6-pager, PR/FAQ, tenets, COE — for humans and agents in spec-driven development. Enforces Write Like an Amazonian rules (under 30 words per sentence, data over adjectives, no weasel words, four answers). Auto-applies when drafting or reviewing decision memos, Working Backwards PR/FAQs, agent specs, or leadership documents. Triggered by /amazon-writing.
user_invocable: true
---

# Amazon Writing

One skill for Amazon narrative document types — shared **spec format** for humans reviewing in meetings and **agents executing** in spec-driven development.

**Companion wedge:** [four-answers](../four-answers/SKILL.md) — answer-only enforcement on Q&A.  
**Companion operating layer:** [team-of-one](../team-of-one/SKILL.md) — Amazon mechanisms for a solo builder.

Deep guides: [docs/](docs/) · Rules reference: [reference.md](reference.md) · Spec-driven context: [docs/spec-driven.md](docs/spec-driven.md)

---

## Why this matters now (spec-driven development)

In spec-driven development, the document **is** the contract:

- **Humans** read it in narrative meetings (silent read → FUND / KILL / REVISE)
- **Agents** read it as the source of truth before writing code, tests, or implementation plans
- **Both** need the same properties: precise language, testable claims, explicit risks, no weasel words

A PR/FAQ is not just a product ritual — it is a **structured spec** that an agent can:

1. Parse into requirements and non-goals
2. Lint for ambiguity before implementation starts
3. Trace decisions back to customer problem statements
4. Fail fast when internal FAQ questions lack four-answer form

Amazon's formats predate AI agents, but they solve the same problem as modern `spec.md` / `AGENTS.md` workflows: **force clarity before execution.**

When drafting for agents, add:

- Explicit **in scope / out of scope**
- **Acceptance signals** — how humans and agents know the spec is satisfied
- **Kill criteria** — when to stop building
- File paths or artifacts agents should produce (when user provides a repo)

---

## Universal rules (every doc type, human + agent)

Apply on **draft** and **review**:

### 1. Fewer than 30 words per sentence

One idea per sentence. Agents parse long sentences into wrong requirements.

| Bad (43 words) | Good |
|----------------|------|
| Due to the fact that customers were experiencing significant delays, we made the system much faster. | We cut server-side p90 latency from 10 ms to 1 ms. |

### 2. Replace adjectives with data

Subjective adjectives are untestable for agents and misleading for humans.

| Bad | Good |
|-----|------|
| significantly better conversion | conversion +2.3 pp (4.1% → 6.4%) |
| most customers | 87% of Prime members |
| much faster | p90 latency 10 ms → 1 ms |

### 3. Eliminate weasel words

Weasel words let agents hallucinate compliance and let humans nod without deciding.

Banned in conclusions: maybe, perhaps, probably, likely, potentially, could, might, seems, appears, I think, I believe, arguably, generally, usually, nearly all, significantly, substantially, would help, might bring clarity.

**Exception:** quoting a third party's hedged statement — label it as their view.

### 4. "So what?" test

Before every paragraph: if deleted, would the reader (human or agent) miss it? If no, cut it.

### 5. Four answers

On substantive questions: **Yes**, **No**, **a number**, or **I don't know but I'll know it by X**.

Bare "I don't know" is invalid. Agents must either have evidence or a named artifact/date that will produce evidence.

---

## Pick a document type

| User wants | Doc type | Read |
|------------|----------|------|
| Fast decision, go/no-go | **1-pager** | [docs/1-pager.md](docs/1-pager.md) |
| Deep narrative, silent-read meeting | **6-pager** | [docs/6-pager.md](docs/6-pager.md) |
| New product / agent feature spec | **PR/FAQ** | [docs/pr-faq.md](docs/pr-faq.md) |
| Durable decision principles | **Tenets** | [docs/tenets.md](docs/tenets.md) |
| Post-incident / failed spec | **COE** | [docs/coe.md](docs/coe.md) |
| Agent + human spec workflow | **Meta** | [docs/spec-driven.md](docs/spec-driven.md) |
| Review existing doc | **Lint** | Rules above + doc-type checklist |

If unspecified, ask once: **decision (1-pager), deep dive (6-pager), new product/spec (PR/FAQ), principles (tenets), incident (COE), or lint?**

---

## Workflow

### Draft (human or agent-authored)

1. Confirm doc type
2. **Read the full matching `docs/*.md`** — do not improvise structure from memory
3. Gather evidence: customer problem, metrics, competitive context, risks
4. Draft in **full prose** — not bullet slides with periods
5. Add agent-facing blocks when spec-driven: scope, non-goals, acceptance signals
6. Run lint pass before delivering

### Review / lint (human or agent reviewer)

Output this format:

```
AMAZONIAN LINT

Doc type: PR/FAQ
Audience: human leadership + implementation agent
Score: 72/100

BLOCKERS (must fix before FUND or agent execution)
- Internal FAQ Q3: "probably" → number or IDK BY [date]
- Problem paragraph: "significantly better" → +25 bps or delete
- No explicit out-of-scope section for agent

FIXES (should fix)
- Sentence 4 (42 words): split
- Missing kill criteria in internal FAQ

AGENT READINESS
- [ ] Requirements traceable to problem paragraph
- [ ] Non-goals stated
- [ ] Testable acceptance signals present
- [ ] Risks have owners and dates
```

**Blockers** = weasel words, hedged answers, untestable claims, missing four-answer form.  
**Fixes** = sentence length, weak data, "so what?" failures.

### Meeting / spec gate decision

End with exactly one:

- **FUND** — proceed to build / agent may implement
- **KILL** — do not build; state why
- **REVISE** — named owner + return date + what evidence is missing

---

## When this skill applies

**Apply when:**
- Drafting or reviewing 1-pager, 6-pager, PR/FAQ, tenets, COE
- User says "Amazon memo," "narrative," "Working Backwards," "Write Like an Amazonian"
- Spec-driven: PR/FAQ as feature spec, 1-pager as decision gate before agent work
- Linting docs before human review or before handing spec to coding agent

**Do not apply when:**
- Pure code implementation with an approved spec already in context
- Creative writing unrelated to business decisions
- Quick Yes/No only → [four-answers](../four-answers/SKILL.md)

---

## Doc type index (summaries — read full docs before drafting)

| Type | Max size | Primary audience | Agent use |
|------|----------|------------------|-----------|
| 1-pager | ~1 page | Decision maker | Decision gate before sprint |
| 6-pager | 6 pages | Leadership meeting | Strategy context for multi-sprint work |
| PR/FAQ | 6 pages total | Customer + leadership | **Feature/product spec** |
| Tenets | 5–10 rules | Team | Constraint layer for agent judgment |
| COE | 2–4 pages | Engineering + ops | Postmortem; update specs/mechanisms |

Full templates, examples, anti-patterns, and agent mapping in each `docs/*.md` file.

---

## Final check

- Read the full doc-type guide for this format?
- Human-readable **and** agent-parseable?
- Every sentence <30 words?
- Data instead of adjectives?
- Zero weasel words in conclusions?
- Four-answer form on substantive claims?
- PR/FAQ: believable customer quote + internal FAQ names biggest risk?
- Spec-driven: scope, non-goals, acceptance signals, kill criteria?
- Ends with FUND / KILL / REVISE when appropriate?
