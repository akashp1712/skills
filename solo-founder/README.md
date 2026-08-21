# Solo Founder

The company is one person. Every hat is you. The day has no edges, so support, the dashboard, and a rewrite all feel equally urgent — and nothing closes.

Amazon's answer to recurring waste was a mechanism, not a pep talk. This skill is that idea for a one-person company: **files that give the day a shape.**

On first use it scaffolds `.mechanisms/` and fills a real `RESUME.md` with this morning's one outcome. It does not lecture the shareholder letters.

Related: [day-job-founder](../day-job-founder) — same files, for founders building in the gaps around a job.

---

## Install

```bash
npx skills add akashp1712/skills --skill solo-founder
```

```bash
python3 ~/.claude/skills/solo-founder/scripts/init.py
```

Then fill `RESUME.md` with the one outcome this morning is buying. Park everything else. Add the next mechanism only after that has paid for a day.

Trigger: `/solo-founder`. Also auto-applies when the morning has no named outcome, when a decision is being over-deliberated, before shipping, or when reviewing progress.

---

## What leaks, and what the file does

| Waste | File |
|-------|------|
| The morning has no named outcome | `RESUME.md` — one sentence, one path; everything else is Parked |
| A closed call gets researched again | `DECISIONS.md` — append-only; what you ruled out is the point |
| Looking at MRR as if that were work | `METRICS.md` — three inputs you can move this week |
| Polishing past the line | `BAR.md` written before you are attached |
| The same incident twice | `LEARNINGS.md` — a mechanism change, or it is just a loss |

The five mechanisms behind those files: [single-thread](docs/single-thread.md), [velocity](docs/velocity.md), [re-entry](docs/re-entry.md), [input-metrics](docs/input-metrics.md), [compounding](docs/compounding.md).

---

## Guardrails

A folder of immaculate files and nothing shipped is worse than no files, because it feels like work. Every mechanism must cost less than the waste it removes. Adopt one at a time. If it has not changed a decision in a month, delete it.

---

## Companion skills

| Skill | Use |
|-------|-----|
| [day-job-founder](../day-job-founder) | Same mechanisms for founders building in the gaps |
| [four-answers](../four-answers) | Yes / No / a number / I don't know but I'll know by X |
| [amazon-writing](../amazon-writing) | 1-pager when a one-way door actually needs a document |

---

## Sources

- Jeff Bezos, [2015 letter to shareholders](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm) — Type 1 / Type 2, one-way and two-way doors
- Jeff Bezos, [2016 letter to shareholders](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders) — 70% rule, disagree and commit, exhaustion, process as proxy
- Colin Bryar and Bill Carr, *Working Backwards* — mechanisms over intentions, single-threaded leadership (ch. 3), input metrics and the WBR (ch. 6)
- [First Round Review interview with Bryar and Carr](https://review.firstround.com/how-to-build-an-invention-machine-6-lessons-that-powered-amazons-success/) — "Do we have a mechanism in place so it doesn't happen again?"

MIT licensed.
