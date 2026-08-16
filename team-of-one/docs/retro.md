# Retro — the mechanism that changes mechanisms

Every other mechanism here runs during the work. This one is how they improve.

The rule that keeps it from becoming journaling: **a retro either changes a mechanism or explicitly changes nothing.** There is no third outcome. Insight that does not alter a file is entertainment.

Ten minutes, weekly. Longer is worse — a long retro is a sign you are processing feelings instead of changing systems.

---

## Weekly retro

Four questions. Answer them in [four-answers](../../four-answers/SKILL.md) form: **Yes**, **No**, **a number**, or **I don't know, but I'll know by X**.

**1. Did you ship the one bet?**

Yes or No. Not "made good progress." If No, the next question is the only one that matters.

**2. Where did the hours actually go?**

A number, per session. Compare it to what you planned. The gap is the finding.

The most common answers on an eight-hour week, in order: re-entry cost (fix with [Landing](re-entry.md)), re-opening a closed decision (fix with [`DECISIONS.md`](doors.md)), and a two-way door treated as one-way (fix with a deliberation budget). Each of these has a mechanism. That is the point of asking.

**3. What broke, or nearly did?**

Anything customer-visible gets a COE (below). Anything that scared you gets a line in `BAR.md`.

**4. What mechanism changes?**

Exactly one of:

- A named file changes — a new bar line, a tightened kill gate, a portfolio state change
- **No change**, stated explicitly, because the week worked

"No change" is a legitimate and common answer. Saying it out loud is what keeps the mechanism honest, because it forces you to notice when you say it four weeks running while nothing ships.

### Output

```
RETRO · week of 2026-08-11 · evercall

Bet: missed call → booking SMS end to end on staging
Shipped: No

Hours: 5 of 8 planned. Tue 0 (work ran late), Thu 2, Sat 3.
Of those 5: ~1.5 spent re-deriving the Twilio webhook flow.

Broke: nothing customer-visible. Staging DB filled with junk bookings.

Mechanism change:
- Landing was skipped Thursday → the 1.5 hrs Saturday is the direct cost.
  No new mechanism needed. The existing one was not run. Land before
  closing the laptop, including on short sessions.

Next bet: same. Carry it. Do not add scope.
```

Carrying an unfinished bet is normal. **Silently replacing it with a new one is not** — that is how a project becomes six months of activity with nothing finished.

---

## COE — when something actually broke

For anything customer-visible. Use the [COE format](../../amazon-writing/docs/coe.md) for the document; this is the solo-specific part.

Five whys, with one adjustment: as a solo builder, the chain almost always bottoms out at **"no mechanism existed."** There is no process to blame and no one to hand it to. That is not a comfortable answer but it is usually the true one, and it is actionable in a way that "I was rushing" is not.

```
Customer got a stack trace instead of a booking confirmation.

1. Why? The Twilio handler threw and the error bubbled to the response.
2. Why? No try/catch around the SMS send.
3. Why? I added the send at 11pm the night before the demo.
4. Why? I shipped without running the ship bar.
5. Why? The ship bar existed but nothing forced me to run it before deploy.

Root cause: no gate between "it works locally" and "it is live."

Correction:
- Ship bar runs on every deploy, not when I remember. Added to BAR.md.
- New bar line: failure states show a human message, never a stack trace.
- Deploy is now a separate session from writing the code. Never both at 11pm.
```

The last correction is the interesting one — it changes *when* you work, not just what you check. Timing corrections are usually stronger than checklist corrections for solo builders, because the checklist depends on the same tired person who wrote the bug.

**One COE per incident, written once, within a week.** A COE you never write is an incident you will have again.

---

## Monthly: read the log

Once a month, read `DECISIONS.md` and `LEARNINGS.md` end to end. Ten minutes.

You are looking for exactly two things:

**Repeats.** The same lesson learned twice means the first correction did not take, and the mechanism needs to be stronger rather than restated.

**Decisions you have quietly re-opened.** If you find yourself weighing something that `DECISIONS.md` already closed, either honor the old decision or supersede it with a new dated entry. Do not leave it ambiguous — ambiguous decisions get re-debated on the most expensive Saturday available.

This monthly read is also the input to [Focus](focus.md) triage. Run them together.

---

## Anti-patterns

**Retros that produce feelings.** "I need to be more disciplined" is not a mechanism change. "Deploy and code are separate sessions" is. If the output could be a journal entry, it was not a retro.

**Blaming the hours.** "I didn't have time" is true every week and therefore explains nothing. The useful question is which hours you did have and where they went.

**Retro as self-criticism.** The mechanism failed, not you. This distinction is what makes the retro survivable enough to keep doing, and a retro you dread is a retro you skip.

**Skipping the week you shipped nothing.** Those weeks contain all the information. A retro run only after good weeks is a highlight reel.

**Changing five mechanisms at once.** You will not be able to tell which one worked. One change, then observe.

**A retro with no artifact.** If nothing was written, it did not happen.
