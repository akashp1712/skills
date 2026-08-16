---
name: team-of-one
description: Amazon operating mechanisms ported to a solo builder shipping around a day job — re-entry after days away, a bar raiser with real veto power, one-way vs two-way door decisions, single-bet focus with pre-committed kill gates, and weekly retros. Maintains .mechanisms/ state files so decisions and context survive between short sessions. Auto-applies when resuming work after a gap, before shipping, when choosing between projects, or when spread across too many. Triggered by /team-of-one.
user_invocable: true
---

# Team of One

Amazon keeps quality high with **mechanisms**, not willpower: the bar raiser, the narrative review, the COE, tenets, one-way and two-way doors. Every one assumes a team.

You are one person with a day job and eight hours a week. You have no reviewer, no PM pushing back on a mushy plan, and no one asking whether this is the most important thing. Generation is free now. Judgment is the scarce part.

This skill ports those mechanisms to **scale = 1**.

**Companions:** [amazon-writing](../amazon-writing/SKILL.md) for the document formats · [four-answers](../four-answers/SKILL.md) for answer discipline.

---

## What makes this a mechanism, not advice

A mechanism has a **tool, an owner, and an inspection cadence**. Advice has none of those, which is why it does not survive contact with a tired Saturday morning.

So this skill reads and writes real files in `.mechanisms/` at the repo root:

| File | Written by | Read by | Lifecycle |
|------|-----------|---------|-----------|
| `RESUME.md` | Landing (end of session) | Boot (start of session) | Overwritten every session |
| `DECISIONS.md` | Doors | Boot, Retro | Append-only |
| `BAR.md` | You, once, before you are attached | Bar raiser | Rarely edited |
| `PORTFOLIO.md` | Focus | Boot, Retro | Edited at triage |
| `LEARNINGS.md` | Retro, COE | Focus, Doors | Append-only |

Commit them. They are the only thing standing between Saturday-you and the ninety minutes you lose remembering what Tuesday-you decided.

Scaffold with `python3 scripts/init.py` (see [scripts/init.py](scripts/init.py)), or create on first use.

**If `.mechanisms/` does not exist and the user asks for a mechanism, offer to scaffold it first.** Do not silently invent state.

---

## Pick a mechanism

Route on where the user is in the loop, not on what they literally typed.

| Situation | Mechanism | Read |
|-----------|-----------|------|
| Opening the laptop after days away | **Boot** | [docs/re-entry.md](docs/re-entry.md) |
| Stopping for the night | **Landing** | [docs/re-entry.md](docs/re-entry.md) |
| About to decide something | **Doors** | [docs/doors.md](docs/doors.md) |
| About to ship, merge, or publish | **Bar raiser** | [docs/bar-raiser.md](docs/bar-raiser.md) |
| Too many projects, scattered, guilty | **Focus** | [docs/focus.md](docs/focus.md) |
| End of week, or something broke | **Retro** | [docs/retro.md](docs/retro.md) |

If genuinely ambiguous, ask once: **booting, landing, deciding, shipping, triaging, or retro?**

---

## Auto-apply triggers

Apply without being asked when:

- The session starts in a repo containing `.mechanisms/RESUME.md` → offer Boot in one line, do not dump the whole file unprompted
- The user says "where was I," "what was I doing," "picking this back up," "haven't touched this in weeks"
- The user is about to deploy, publish, announce, or take money → Bar raiser
- The user is weighing an irreversible move (pricing, domain, public API, brand, first paying customer) → Doors, one-way path
- The user mentions a third or fourth project, or says "I should also build" → Focus
- Something broke in production, or a week ended → Retro

**Do not apply when:** the user is mid-flow on a well-defined coding task. Interrupting focused work to ask about mechanisms is the exact failure this skill exists to prevent. Silence is the default.

---

## The loop

```
BOOT ──▶ DOORS ──▶ (work) ──▶ BAR RAISER ──▶ LANDING
  ▲                                              │
  └──────────── RETRO ◀── FOCUS ◀────────────────┘
                (weekly)   (monthly or when scattered)
```

Boot and Landing run every session. Doors and Bar raiser run per decision and per ship. Focus and Retro run on a cadence, not on feeling.

---

## Operating rules

These apply across all five mechanisms.

### 1. The next action must be startable in five minutes

Part-time builders need momentum before the window closes. "Continue work on auth" is not an action. "Add the redirect at `middleware.ts:42`" is.

### 2. Ruled-out is as valuable as decided

Record what you rejected and why. Without it you will re-litigate the same choice every third session, which is the most common way eight hours becomes zero.

### 3. Pre-commit the kill criterion while you are still objective

Write the gate before you start, when you have no sunk cost. Enforce it later, when you do.

### 4. Name the state of every project in writing

`PRIMARY` / `MAINTENANCE` / `PAUSED` / `KILLED`. Exactly one project may be `PRIMARY`. An unnamed project is a guilt generator.

### 5. Four answers on every substantive question

**Yes**, **No**, **a number**, or **I don't know, but I'll know by X**. This applies to the agent too. "It looks good" is not a bar-raiser verdict.

### 6. Silence is the default

Do not generate work. Every mechanism here removes options or closes loops. If a mechanism produces a longer to-do list than it started with, it ran wrong.

---

## Output discipline

Every mechanism ends with a **written artifact and one decision** — never a summary of feelings.

| Mechanism | Ends with |
|-----------|-----------|
| Boot | The one next action, startable now |
| Landing | `RESUME.md` overwritten |
| Doors | A logged decision + door type + deliberation spent |
| Bar raiser | `SHIPS` / `DOESN'T SHIP` / `SHIPS AFTER [fix] BY [date]` |
| Focus | Exactly one `PRIMARY`, everything else explicitly labeled |
| Retro | A changed mechanism, or an explicit "no change" |

If you cannot produce the artifact, say what is missing. Do not produce a vaguer version of it.

---

## Anti-patterns

- **Status reports to an imaginary manager.** `RESUME.md` is a note to yourself in the second person, with file paths.
- **A bar raiser that never says no.** If the verdict is always `SHIPS`, the mechanism is theater. Delete it or make the bar real.
- **Retros that produce feelings.** A retro either changes a mechanism or changes nothing, and says which.
- **Three weeks on a two-way door.** Deliberation must be proportional to reversibility.
- **Silent pausing.** A project you stopped without writing `PAUSED` becomes background guilt that taxes the project you are actually working on.
- **Scaffolding all five mechanisms on day one.** Start with re-entry. Add the next only after the first earns its keep.

---

## Final check

- Did this remove work rather than add it?
- Is there a written artifact in `.mechanisms/`?
- Is the next action startable in five minutes?
- Does exactly one project say `PRIMARY`?
- Did any substantive answer hedge instead of using the four answers?
- Was the bar raiser allowed to say no?
