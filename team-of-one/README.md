# Team of One

**Amazon's operating mechanisms, ported to one person with a day job.**

Amazon keeps quality high with mechanisms, not willpower — the bar raiser, one-way and two-way doors, tenets, the COE, Working Backwards. Every one of them assumes a team.

You have no reviewer, no PM pushing back on a mushy plan, and no one asking whether this is the most important thing. AI made generating work free, which made judgment the scarce part.

This skill ports those mechanisms to **scale = 1**.

---

## Install

```bash
npx skills add akashp1712/skills --skill team-of-one
```

Then scaffold the state files in your project:

```bash
python3 ~/.claude/skills/team-of-one/scripts/init.py
```

Auto-applies when you resume after a gap, before you ship, or when you are spread across too many projects. Explicit trigger: `/team-of-one`

---

## The five mechanisms

| Mechanism | The problem it solves | Guide |
|-----------|----------------------|-------|
| **Re-entry** | You lose the thread between Tuesday and Saturday | [docs/re-entry.md](docs/re-entry.md) |
| **Bar raiser** | Nobody tells you your work isn't good enough | [docs/bar-raiser.md](docs/bar-raiser.md) |
| **Doors** | Three weeks on a framework, ten minutes on public pricing | [docs/doors.md](docs/doors.md) |
| **Focus** | Six projects, one person, all of them 60% done | [docs/focus.md](docs/focus.md) |
| **Retro** | The same lesson learned four times | [docs/retro.md](docs/retro.md) |

```
BOOT ──▶ DOORS ──▶ (work) ──▶ BAR RAISER ──▶ LANDING
  ▲                                              │
  └──────────── RETRO ◀── FOCUS ◀────────────────┘
                (weekly)   (monthly)
```

---

## It maintains files, not vibes

A mechanism has a tool, an owner, and an inspection cadence. Advice has none of those, which is why advice does not survive contact with a tired Saturday morning.

So this skill reads and writes real files at your repo root:

```
.mechanisms/
├── RESUME.md      # where you left off — overwritten every session
├── DECISIONS.md   # append-only, with door type and what you ruled out
├── BAR.md         # the quality bar, written before you're attached
├── PORTFOLIO.md   # every project labeled PRIMARY / MAINTENANCE / PAUSED / KILLED
└── LEARNINGS.md   # append-only, from retros and obituaries
```

Commit them. `RESUME.md` is the handoff between the version of you that has context and the version that doesn't.

---

## The wedge: re-entry

A full-time founder closes the laptop and reopens it fourteen hours later with the stack still warm. You close it Tuesday night and reopen it Saturday morning, and the context is gone.

The first chunk of every session goes to reconstructing what you already knew. On an eight-hour week that is the largest single line item, and it is pure loss, repeated every session.

**Landing** costs five minutes at the end of a session, when context is free. **Boot** costs two minutes at the start, when context is expensive.

```
BOOT · evercall · feat/missed-call-sms · 4 days since last session

Bet: missed call → booking SMS, end to end on staging
Next: add status-callback handler at app/api/voice/status/route.ts
      (file exists, empty — signature at route.ts:1-12)
Closed: Twilio chosen; no booking UI this milestone
Avoid: refactoring lib/sms.ts; OneCue is PAUSED
Blocked: AU regulatory bundle, chase 08-21 (does not block today)

Starting there?
```

Measure your own version: note the clock when you open the laptop and when you type the first real line of code. That gap, times your sessions per month, is what this is worth to you.

---

## What it will not do

It will not generate ideas, content, campaigns, or plans. There are excellent skills for that, including [show-me-the-money](https://github.com/iamzifei/show-me-the-money) for the full build-and-grow pipeline.

Every mechanism here **removes work or closes a loop**. If one produces a longer to-do list than it started with, it ran wrong. Silence is the default.

Notably, the bar raiser is allowed to tell you your work does not ship. If it never once says no, the mechanism is theater and you should delete it.

---

## Companion skills

| Skill | Use |
|-------|-----|
| [four-answers](../four-answers) | Yes / No / a number / I don't know but I'll know by X |
| [amazon-writing](../amazon-writing) | 1-pager, 6-pager, PR/FAQ, tenets, COE formats |

`team-of-one` is the operating layer. `amazon-writing` is what you write when a one-way door needs a document. `four-answers` is how every verdict here gets stated.

---

## Sources

- Jeff Bezos, [1997 shareholder letter](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders) — one-way and two-way doors
- Amazon's bar raiser program — separation of reviewer from owner, with veto
- *Working Backwards*, Colin Bryar and Bill Carr — mechanisms over good intentions
- *Write Like an Amazonian* (internal, c. 2018) — see [amazon-writing](../amazon-writing)

Built by an ex-Amazonian shipping two products around a full-time engineering job. The mechanisms are the ones that survived contact with an eight-hour week.

MIT licensed.
