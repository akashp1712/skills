---
name: day-job-founder
description: Operating mechanisms for a solo founder with a day job — recover context in two minutes after a gap, stop re-deciding closed calls, keep one thread open in a short evening session, measure inputs you can move this week, and refuse to solve the same failure twice. Writes .mechanisms/ files so Saturday does not start by remembering Friday. On first use, scaffolds and fills a real RESUME.md; does not lecture Amazon theory. Auto-applies when resuming after time away, when a decision is being re-litigated, before shipping, or when tracking progress. Triggered by /day-job-founder.
user_invocable: true
---

# Solo Founder with a Day Job

You build in the gaps: evenings, early mornings, Saturday. There is no team that remembers. The code survives the gap. The model in your head does not. So every session starts by reconstructing Friday, and every closed decision is eligible to be argued again on Thursday.

Amazon's answer to recurring waste was never "try harder." When something broke, the question was whether a **mechanism** existed so it would not happen again. People already had good intentions when it happened. Intentions were not the variable.

This skill is that idea for a founder whose time comes in bursts: **files the next session can act on**, not advice you will not remember on Saturday.

Companions: [amazon-writing](../amazon-writing/SKILL.md) · [four-answers](../four-answers/SKILL.md) · [solo-founder](../solo-founder/SKILL.md) for when the company is the whole day.

---

## First, do the useful thing

Do not open with a tour of Amazon or a list of five mechanisms. Run the situation in front of you.

### No `.mechanisms/` yet

1. Offer to scaffold: `python3 scripts/init.py` (never overwrite existing files).
2. If they agree, fill **`RESUME.md` for real** from git status, the conversation, and one question if needed: *what outcome were you going for?*
3. Paths, branch, next action. Not placeholders.
4. Stop. The other mechanisms wait until this one has paid for a session.

### `.mechanisms/` exists

| What is happening | Do this | Reference |
|-------------------|---------|-----------|
| Starting a session, or back after a gap | **Boot** from `RESUME.md`. No menu of alternatives. | [re-entry](docs/re-entry.md) |
| Ending a session, or about to step away | **Land.** Overwrite `RESUME.md`. | [re-entry](docs/re-entry.md) |
| Stuck, researching, re-opening a closed call | **Velocity.** Classify the door. Log it. | [velocity](docs/velocity.md) |
| Several things half-open | **Single-thread.** Park extras. One named outcome. | [single-thread](docs/single-thread.md) |
| About to ship, or something just broke | **Bar / COE.** One verdict, or one mechanism change. | [compounding](docs/compounding.md) |
| "How am I doing," checking MRR, weekly review | **Input metrics.** Variance only. One next thread. | [input-metrics](docs/input-metrics.md) |

If it is unclear, Boot or Land. That is the mechanism that earns the rest.

**Load at most one mechanism doc per turn.** Running all five is how this skill becomes the process it warns about.

---

## Why this is the day-job shape

A team has standups, an on-call, someone who will say the decision is closed. You have gaps — the job, the school run, three days away — no one to escalate a dispute to, and a loud voice at midnight that would rather rebuild than ship.

| What actually leaks | What the file does |
|---------------------|--------------------|
| First hour of the session reconstructing context | `RESUME.md` — next action with a path, overwritten every session |
| Thursday re-arguing Tuesday's call | `DECISIONS.md` — append-only; the ruled-out lines are the point |
| Three half-open threads, none finishing | One named thread in `RESUME.md`; everything else goes under Parked |
| Checking MRR as if that were work | `METRICS.md` — three inputs you can move this week |
| Shipping at 11pm, fixing it Monday | `BAR.md` written before you are attached; COE into `LEARNINGS.md` |

Adopt **one** new mechanism at a time. Start with re-entry. Add the next only after the first has changed a session.

---

## State files

A mechanism needs a tool, an owner, and a cadence. Advice has none of those.

| File | Written by | Read by |
|------|-----------|---------|
| `RESUME.md` | End of session | Start of session |
| `DECISIONS.md` | Velocity | Re-entry, weekly |
| `BAR.md` | You, once, in advance | Ship time |
| `METRICS.md` | Weekly review | Weekly review |
| `LEARNINGS.md` | COE, weekly review | Velocity, ship time |

Commit them. They are the handoff between sessions.

**If `.mechanisms/` does not exist, scaffold before inventing state.**

---

## Operating rules

1. **Decide at 70%.** Waiting for 90% is slow. The rule is only safe if you course-correct; log the reservation so you know when to reopen. [velocity](docs/velocity.md)
2. **Match process to the door.** Two-way: ten minutes, one line, move. One-way: write it down, sleep on it. Heavy process on reversible calls is how weeks disappear.
3. **One thread.** Two open threads do not split cleanly. The missing time is reload. [single-thread](docs/single-thread.md)
4. **Measure inputs.** Revenue and followers cannot be moved directly. Measure the actions that produce them. [input-metrics](docs/input-metrics.md)
5. **Never solve the same problem twice.** A break gets a mechanism, not a resolution to be more careful. [compounding](docs/compounding.md)
6. **Four answers.** Yes, No, a number, or I don't know but I'll know by X. "Looks good" is not a verdict.

---

## The trap

> "Good process serves you so you can serve customers. But if you're not watchful, the process can become the thing."
> — Bezos, 2016 letter

Immaculate `.mechanisms/` files and nothing shipped is a worse failure than no files, because it feels like work.

- Every mechanism must cost less than the waste it removes. Landing that takes twenty minutes is broken.
- Never run more than one new mechanism at a time.
- If a mechanism has not changed a decision in a month, delete it.
- Shipping beats logging. When they conflict, ship and log afterward.

The output of this skill is more finished work, not better documentation of unfinished work.

---

## Anti-patterns

- **Lecturing Amazon on first use.** Scaffold and fill `RESUME.md`. The letters are the source, not the product.
- **Dumping all five mechanisms.** One, then stop.
- **Researching a two-way door.** Comparison matrices for reversible choices are the most expensive solo habit.
- **Tracking MRR daily.** Lagging output. Watching it does not move it.
- **Re-opening closed decisions on mood.** Re-open when the logged trigger fires.
- **"Be more careful" as a correction.** That is a good intention.
- **A status-report `RESUME.md`.** If a stranger could not start the next action from it, it failed.

---

## Final check

- Did this produce a file the next session can act on, or a summary of Amazon?
- Was exactly one mechanism in play?
- Did this produce finished work, or documentation of unfinished work?
- Is there exactly one open thread?
