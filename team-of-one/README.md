# Team of One

> **"Good intentions don't work. Mechanisms do."** — an old adage at Amazon

When something went wrong at Amazon, Bezos's question was never "who messed up." It was **"Do we have a mechanism in place so it doesn't happen again?"** The reasoning: people already had good intentions when the problem happened, so intentions were not the variable worth changing.

A solopreneur has more good intentions than anyone and no mechanisms at all.

You cannot out-discipline a team. You can out-mechanism one.

---

## Install

```bash
npx skills add akashp1712/skills --skill team-of-one
```

Scaffold the state files in your project:

```bash
python3 ~/.claude/skills/team-of-one/scripts/init.py
```

Auto-applies when a decision is being over-deliberated, when you resume after time away, before shipping, or when tracking progress. Explicit trigger: `/team-of-one`

---

## Five mechanisms, each targeting a specific waste

| Waste | Mechanism | Amazon origin |
|-------|-----------|---------------|
| Deliberating reversible decisions | [**Velocity**](docs/velocity.md) | 2015 + 2016 shareholder letters |
| Splitting attention across threads | [**Single-thread**](docs/single-thread.md) | Single-threaded leadership |
| Rebuilding context after a gap | [**Re-entry**](docs/re-entry.md) | Written handoff culture |
| Optimizing numbers you can't move | [**Input metrics**](docs/input-metrics.md) | WBR, *Working Backwards* ch. 6 |
| Doing the same work twice | [**Compounding**](docs/compounding.md) | Bar raiser, COE |

---

## What it actually does

**Decide at 70%.** Bezos: *"Most decisions should probably be made with somewhere around 70% of the information you wish you had. If you wait for 90%, in most cases, you're probably being slow… being wrong may be less costly than you think, whereas being slow is going to be expensive for sure."* The skill classifies your decision as a one-way or two-way door and refuses to write a comparison matrix for a reversible one.

**Beat the exhaustion default.** In the 2016 letter Bezos notes that without escalation, the default dispute resolution mechanism is exhaustion — *"whoever has more stamina carries the decision."* Solo, both parties are you, and the winner is usually the anxious voice at midnight. Writing the decision down terminates the loop.

**One thread at a time.** Dave Limp's line, quoted in *Working Backwards*: *"The best way to fail at inventing something is by making it somebody's part-time job."* Two open threads don't run at 50% each — they run at about 35%, and the missing 30% is reload cost.

**Measure inputs, not outputs.** You cannot move MRR directly. You can move "conversations with people in the target segment." Amazon's own selection metric started as *number of detail pages*, got gamed, and became *detail pages ready for two-day shipping*. Expect to refine yours two or three times.

**Never solve the same problem twice.** A bar written before you're attached to the work, enforced when you are. A COE whose correction is a mechanism, never "be more careful."

---

## It maintains files, not vibes

A mechanism has a tool, an owner, and an inspection cadence. Advice has none of those, which is why advice doesn't survive contact with a tired Saturday.

```
.mechanisms/
├── RESUME.md      # where you left off — overwritten every session
├── DECISIONS.md   # append-only, with door type and what you ruled out
├── BAR.md         # what "done" means, written before you're attached
├── METRICS.md     # three controllable inputs, reviewed weekly
└── LEARNINGS.md   # append-only; every entry ends in a mechanism change
```

---

## The trap it's built to avoid

Bezos, same 2016 letter, on process as proxy:

> "Good process serves you so you can serve customers. But if you're not watchful, the process can become the thing… You stop looking at outcomes and just make sure you're doing the process right."

A solopreneur with immaculate `.mechanisms/` files and nothing shipped has made the process a proxy. That's worse than having no mechanisms, because it feels like work.

So the skill has hard guardrails: every mechanism must cost less than the waste it removes, you adopt one at a time, shipping beats logging, and **any mechanism that hasn't changed a decision in a month gets deleted.**

Start with re-entry. Add the next only after the first pays for itself.

---

## Companion skills

| Skill | Use |
|-------|-----|
| [four-answers](../four-answers) | Yes / No / a number / I don't know but I'll know by X |
| [amazon-writing](../amazon-writing) | 1-pager, 6-pager, PR/FAQ, tenets, COE formats |

`team-of-one` is the operating layer. `amazon-writing` is what you write when a one-way door needs a document. `four-answers` is how every verdict here gets stated.

---

## Sources

- Jeff Bezos, [2015 letter to shareholders](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm) — Type 1 / Type 2 decisions, one-way and two-way doors
- Jeff Bezos, [2016 letter to shareholders](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders) — high-velocity decision making, the 70% rule, disagree and commit, escalation over exhaustion, process as proxy
- Colin Bryar and Bill Carr, *Working Backwards* — mechanisms over good intentions, single-threaded leadership (ch. 3), input metrics and the WBR (ch. 6)
- [First Round Review interview with Bryar and Carr](https://review.firstround.com/how-to-build-an-invention-machine-6-lessons-that-powered-amazons-success/) — "Do we have a mechanism in place so it doesn't happen again?"
- Amazon's bar raiser program — separation of reviewer from owner, with veto

MIT licensed.
