---
name: solo-founder
description: Operating mechanisms for a one-person company — give the day an edge, keep one thread open, decide at 70% instead of researching until evening, measure inputs you can move this week, and refuse to solve the same failure twice. Writes .mechanisms/ files so tomorrow starts on a named outcome, not a dashboard. On first use, scaffolds and fills a real RESUME.md; does not lecture Amazon theory. Auto-applies when the morning has no named outcome, when a decision is being over-deliberated, before shipping, or when tracking progress. Triggered by /solo-founder.
user_invocable: true
---

# Solo Founder

The company is one person. Every hat is you. Support, the dashboard, the rewrite, the sales call — they all feel equally the job, so the day has no edges and nothing closes.

Amazon's answer to recurring waste was never "try harder." When something broke, the question was whether a **mechanism** existed so it would not happen again. People already had good intentions when it happened. Intentions were not the variable.

This skill is that idea for a one-person company: **files that give the day a shape**, not advice you will not take at 4pm.

Companions: [amazon-writing](../amazon-writing/SKILL.md) · [four-answers](../four-answers/SKILL.md) · [day-job-founder](../day-job-founder/SKILL.md).

---

## First, do the useful thing

Do not open with a tour of Amazon or a list of five mechanisms. Run the situation in front of you.

### No `.mechanisms/` yet

1. Offer to scaffold: `python3 scripts/init.py` (never overwrite existing files).
2. If they agree, fill **`RESUME.md` for real** from git status, the conversation, and one question if needed: *what is this morning buying?*
3. One outcome, a path, a next action. Not placeholders. Park everything else.
4. Stop. The other mechanisms wait until this one has paid for a day.

### `.mechanisms/` exists

| What is happening | Do this | Reference |
|-------------------|---------|-----------|
| Morning, or no named outcome yet | **Single-thread.** One sentence. Park the rest. Write it on `RESUME.md`. | [single-thread](docs/single-thread.md) |
| Ending the day, or about to step away | **Land.** Overwrite `RESUME.md`. Tomorrow starts there. | [re-entry](docs/re-entry.md) |
| Starting the day with a `RESUME.md` | **Boot.** No menu of alternatives. | [re-entry](docs/re-entry.md) |
| Stuck, researching, re-opening a closed call | **Velocity.** Classify the door. Log it. | [velocity](docs/velocity.md) |
| About to ship, or something just broke | **Bar / COE.** One verdict, or one mechanism change. | [compounding](docs/compounding.md) |
| "How am I doing," the dashboard, weekly review | **Input metrics.** Variance only. One next thread. | [input-metrics](docs/input-metrics.md) |

If it is unclear, name the one outcome for the next block of time. That is the mechanism that earns the rest.

**Load at most one mechanism doc per turn.** Running all five is how this skill becomes the process it warns about.

---

## Why this is the one-person-company shape

A team has a calendar with edges: standups, owners, someone who will say the decision is closed. You have all the hats and no edges. Deliberation expands to fill the hours. The dashboard is always one tab away. Gold-plating feels like standards.

| What actually leaks | What the file does |
|---------------------|--------------------|
| The morning has no named outcome | `RESUME.md` — one sentence, one path; everything else is Parked |
| A closed call gets researched again because there is time | `DECISIONS.md` — append-only; the ruled-out lines are the point |
| Looking at MRR as if that were work | `METRICS.md` — three inputs you can move this week |
| Polishing past the line because nothing forces a ship | `BAR.md` written before you are attached; the "allowed to be bad" list is the half that speeds you up |
| The same incident twice | COE into `LEARNINGS.md` — a mechanism, not "be more careful" |

Adopt **one** new mechanism at a time. Start with a named morning thread. Add the next only after the first has changed a day.

---

## State files

A mechanism needs a tool, an owner, and a cadence. Advice has none of those.

| File | Written by | Read by |
|------|-----------|---------|
| `RESUME.md` | End of day, and whenever the thread changes | Start of day |
| `DECISIONS.md` | Velocity | Re-entry, weekly |
| `BAR.md` | You, once, in advance | Ship time |
| `METRICS.md` | Weekly review | Weekly review |
| `LEARNINGS.md` | COE, weekly review | Velocity, ship time |

Commit them. They are the handoff between days.

**If `.mechanisms/` does not exist, scaffold before inventing state.**

---

## Operating rules

1. **One thread.** The day will offer you every hat. Name one outcome. Park the rest. [single-thread](docs/single-thread.md)
2. **Decide at 70%.** Waiting for 90% is how a calendar with no meetings becomes a research week. [velocity](docs/velocity.md)
3. **Match process to the door.** Two-way: ten minutes, one line, move. One-way: write it down, sleep on it.
4. **Measure inputs.** Revenue and followers cannot be moved directly. Looking at them is not a task. [input-metrics](docs/input-metrics.md)
5. **Never solve the same problem twice.** A break gets a mechanism, not a resolution to be more careful. [compounding](docs/compounding.md)
6. **Four answers.** Yes, No, a number, or I don't know but I'll know by X. "Looks good" is not a verdict.

---

## The trap

> "Good process serves you so you can serve customers. But if you're not watchful, the process can become the thing."
> — Bezos, 2016 letter

Immaculate `.mechanisms/` files and nothing shipped is a worse failure than no files, because it feels like work. A one-person company has all day to make the process the thing.

- Every mechanism must cost less than the waste it removes.
- Never run more than one new mechanism at a time.
- If a mechanism has not changed a decision in a month, delete it.
- Shipping beats logging. When they conflict, ship and log afterward.

The output of this skill is more finished work, not better documentation of unfinished work.

---

## Anti-patterns

- **Lecturing Amazon on first use.** Scaffold and fill `RESUME.md` with this morning's outcome.
- **Dumping all five mechanisms.** One, then stop.
- **A morning with three "priorities."** That is zero threads. Pick one.
- **Researching a two-way door.** You have the hours. That is why the matrix is so expensive.
- **The dashboard as a warm-up.** It produces no decision and it costs the block you were going to ship in.
- **Re-opening closed decisions on mood.** Re-open when the logged trigger fires.
- **"Be more careful" as a correction.** That is a good intention.
- **A status-report `RESUME.md`.** If a stranger could not start the next action from it, it failed.

---

## Final check

- Did this produce a file tomorrow can act on, or a summary of Amazon?
- Was exactly one mechanism in play?
- Is there exactly one open thread?
- Did this produce finished work, or documentation of unfinished work?
