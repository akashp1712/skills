---
name: team-of-one
description: Amazon's operating mechanisms adapted for a solo builder — decide at 70% information, classify one-way vs two-way doors, single-thread your attention, recover context fast after a gap, measure controllable inputs instead of lagging outputs, and never solve the same problem twice. Maintains .mechanisms/ state files so decisions and context persist between sessions. Auto-applies when a decision is being over-deliberated, when resuming after time away, before shipping, or when tracking progress. Triggered by /team-of-one.
user_invocable: true
---

# Team of One

> "Good intentions don't work. Mechanisms do."
> — an old adage at Amazon, cited throughout *Working Backwards*

Amazon's answer to every recurring failure was never "try harder." When something went wrong, Bezos's question was: **"Do we have a mechanism in place so it doesn't happen again?"** The assumption was that people already had good intentions when the problem happened, so intentions were not the variable worth changing.

A solopreneur has more good intentions than anyone and no mechanisms at all. That is the gap this skill closes.

You cannot out-discipline a team. You can out-mechanism one.

**Companions:** [amazon-writing](../amazon-writing/SKILL.md) for document formats · [four-answers](../four-answers/SKILL.md) for answer discipline.

---

## Where solo hours actually go

Every mechanism here targets a specific, measurable waste. If a mechanism is not removing one of these, it should not be running.

| Waste | Mechanism | Amazon origin |
|-------|-----------|---------------|
| Deliberating reversible decisions | **Velocity** | 2015 + 2016 shareholder letters |
| Re-deciding what you already decided | **Velocity** (`DECISIONS.md`) | Written culture |
| Splitting attention across threads | **Single-thread** | Single-threaded leadership |
| Rebuilding context after a gap | **Re-entry** | Written handoff |
| Optimizing numbers you cannot move | **Input metrics** | WBR, *Working Backwards* ch. 6 |
| Doing the same work twice | **Compounding** | Bar raiser, COE |

---

## Pick a mechanism

| Situation | Mechanism | Read |
|-----------|-----------|------|
| Weighing a decision, stuck, researching | **Velocity** | [docs/velocity.md](docs/velocity.md) |
| Several things half-open; nothing finishing | **Single-thread** | [docs/single-thread.md](docs/single-thread.md) |
| Starting or ending a work session | **Re-entry** | [docs/re-entry.md](docs/re-entry.md) |
| Tracking progress, or feeling like nothing works | **Input metrics** | [docs/input-metrics.md](docs/input-metrics.md) |
| About to ship, or something broke | **Compounding** | [docs/compounding.md](docs/compounding.md) |

If ambiguous, ask once: **deciding, focusing, resuming, measuring, or shipping?**

---

## State files

A mechanism needs a tool, an owner, and an inspection cadence. Advice has none of those. So this skill reads and writes real files in `.mechanisms/` at the repo root:

| File | Written by | Read by |
|------|-----------|---------|
| `RESUME.md` | End of session | Start of session |
| `DECISIONS.md` | Velocity | Re-entry, weekly review |
| `BAR.md` | You, once, in advance | Ship time |
| `METRICS.md` | Weekly review | Weekly review |
| `LEARNINGS.md` | COE, weekly review | Velocity, ship time |

Scaffold with `python3 scripts/init.py`. Commit them.

**If `.mechanisms/` does not exist, offer to scaffold before inventing state.**

---

## Operating rules

### 1. Decide at 70%

> "Most decisions should probably be made with somewhere around 70% of the information you wish you had. If you wait for 90%, in most cases, you're probably being slow… being wrong may be less costly than you think, whereas being slow is going to be expensive for sure."
> — Bezos, 2016 letter

The corollary matters as much as the rule: 70% only works if you are **good at course-correcting**. Speed and reversibility are one mechanism, not two.

### 2. Match process weight to reversibility

Two-way door: decide now, log one line, move. One-way door: write it down, sleep on it. Using the heavy process on everything produces "slowness, unthoughtful risk aversion, failure to experiment sufficiently."

### 3. One thread at a time

> "The best way to fail at inventing something is by making it somebody's part-time job."
> — Dave Limp, Amazon SVP of Devices, quoted in *Working Backwards*

### 4. Measure inputs, not outputs

Revenue, followers, and MRR are lagging outputs you cannot move directly. Measure the controllable inputs that produce them.

### 5. Never solve the same problem twice

Anything that broke gets a mechanism, not a resolution to be more careful.

### 6. Answer in four answers

**Yes**, **No**, **a number**, or **I don't know, but I'll know by X**. Applies to the agent too. "Looks good" is not a verdict.

---

## The trap this skill must avoid

> "Good process serves you so you can serve customers. But if you're not watchful, the process can become the thing… You stop looking at outcomes and just make sure you're doing the process right."
> — Bezos, 2016 letter, on process as proxy

A solopreneur with immaculate `.mechanisms/` files and nothing shipped has made the process a proxy. That is a worse failure than having no mechanisms, because it feels like work.

Guardrails:

- **Every mechanism must cost less than the waste it removes.** If Landing takes twenty minutes, it is broken.
- **Never run more than one new mechanism at a time.** Adopt one, confirm it pays, then add the next.
- **If a mechanism has not changed a decision in a month, delete it.**
- **Shipping beats logging.** When they conflict, ship and log afterward.

The output of this skill is more finished work, not better documentation of unfinished work.

---

## Anti-patterns

- **Researching a two-way door.** Comparison matrices for reversible choices are the most expensive habit in solo building.
- **Waiting for 90%.** The missing 20% usually does not exist and would not change the call.
- **Tracking MRR daily.** It is a lagging output. Watching it more often does not move it and reliably lowers morale.
- **Re-opening closed decisions.** It feels like thinking. It is re-thinking, and it is why weeks disappear.
- **Post-mortems that end in resolutions.** "Be more careful next time" is the definition of a good intention.
- **Running all five mechanisms in week one.** Start with re-entry.

---

## Final check

- Did this produce finished work, or documentation of unfinished work?
- Was the decision made at 70%, or did it wait for 90%?
- Was process weight matched to reversibility?
- Is the metric something you can directly control?
- Did anything that broke get a mechanism rather than a resolution?
- Is there exactly one open thread?
