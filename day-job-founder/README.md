# Solo Founder with a Day Job

You build in the gaps. The code survives. The model in your head does not. So Saturday starts by reconstructing Friday, and Thursday re-opens Tuesday's call because the ruling lived in memory instead of a file.

Amazon's answer to recurring waste was a mechanism, not a pep talk. This skill is that idea for a founder whose time comes in bursts: **files the next session can act on.**

On first use it scaffolds `.mechanisms/` and fills a real `RESUME.md`. It does not lecture the shareholder letters.

Related: [solo-founder](../solo-founder) — same files, for when the company is the whole day.

---

## Install

```bash
npx skills add akashp1712/skills --skill day-job-founder
```

```bash
python3 ~/.claude/skills/day-job-founder/scripts/init.py
```

Then fill `RESUME.md` at the end of today's session — the actual thread, the actual next file. Start with that. Add the rest only after it has paid for a session.

Trigger: `/day-job-founder`. Also auto-applies when you resume after a gap, get stuck on a decision, ship, or review progress.

---

## What leaks, and what the file does

| Waste | File |
|-------|------|
| First hour reconstructing Friday | `RESUME.md` — next action with a path, overwritten every session |
| Thursday re-arguing Tuesday | `DECISIONS.md` — append-only; what you ruled out is the point |
| Three half-open threads in a two-hour window | One named thread; everything else is Parked |
| Checking MRR as if that were work | `METRICS.md` — three inputs you can move this week |
| Shipping at 11pm, fixing it Monday | `BAR.md` written before you are attached |

The five mechanisms behind those files: [velocity](docs/velocity.md), [single-thread](docs/single-thread.md), [re-entry](docs/re-entry.md), [input-metrics](docs/input-metrics.md), [compounding](docs/compounding.md).

---

## Guardrails

A folder of immaculate files and nothing shipped is worse than no files, because it feels like work. Every mechanism must cost less than the waste it removes. Adopt one at a time. If it has not changed a decision in a month, delete it.

---

## Companion skills

| Skill | Use |
|-------|-----|
| [solo-founder](../solo-founder) | Same mechanisms when the company is the whole day |
| [four-answers](../four-answers) | Yes / No / a number / I don't know but I'll know by X |
| [amazon-writing](../amazon-writing) | 1-pager when a one-way door actually needs a document |

---

## Sources

- Jeff Bezos, [2015 letter to shareholders](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm) — Type 1 / Type 2, one-way and two-way doors
- Jeff Bezos, [2016 letter to shareholders](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders) — 70% rule, disagree and commit, exhaustion, process as proxy
- Colin Bryar and Bill Carr, *Working Backwards* — mechanisms over intentions, single-threaded leadership (ch. 3), input metrics and the WBR (ch. 6)
- [First Round Review interview with Bryar and Carr](https://review.firstround.com/how-to-build-an-invention-machine-6-lessons-that-powered-amazons-success/) — "Do we have a mechanism in place so it doesn't happen again?"

MIT licensed.
