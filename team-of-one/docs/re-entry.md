# Re-entry — Boot and Landing

The mechanism that only matters when you are part-time.

A full-time founder closes the laptop and reopens it fourteen hours later with the stack still warm. You close it Tuesday night and reopen it Saturday morning. The code is unchanged and the context is gone.

So the first chunk of every session gets spent reconstructing what you already knew: which branch, what was half-done, what you tried that failed, what you decided and why. On an eight-hour week, that reconstruction is the single largest line item — and it is pure loss, repeated every session.

**The fix is not better memory. It is refusing to end a session without writing the handoff.**

Re-entry has two halves and they are asymmetric:

- **Landing** costs five minutes and is done when context is free, because you still have it
- **Boot** costs two minutes and is done when context is expensive, because you have none

You are paying a cheap tax to avoid an expensive one. Landing is the half people skip, and skipping it is what makes Boot impossible.

---

## Landing (end of session, 5 minutes)

Run this **before** you are tired, not after. When the window is closing, stop coding with five minutes left and land the plane. A clean landing is worth more than five more minutes of half-finished work, because half-finished work with no note is negative value — next session you will read it, not understand it, and possibly revert it.

Overwrite `.mechanisms/RESUME.md` entirely. It is a snapshot, not a log. Things worth keeping permanently go to `DECISIONS.md` or `LEARNINGS.md`.

### Template

```markdown
# Resume

Last session: 2026-08-16 · Next window: Sat AM
Project: evercall · Branch: feat/missed-call-sms

## The one bet
Get a missed call to produce a booking SMS end to end on staging.

## Next action (startable in 5 minutes)
Add the Twilio status-callback handler at `app/api/voice/status/route.ts`.
The route file exists and is empty. Signature copied from `route.ts:1-12` of
the inbound handler.

## State of play
- Inbound webhook works on staging, verified with a real call Tuesday
- SMS send works in isolation (`lib/sms.ts`), never wired to the call event
- Staging DB has 3 junk bookings from testing — ignore, do not clean up yet

## Decided, do not re-open
- Twilio over Vonage — AU number availability. See DECISIONS.md 2026-08-11.
- No booking UI this milestone. SMS with a link is enough to test the loop.

## Tried and failed
- Studio Flow for the routing — too opaque to debug, reverted at 3f2a1c9.
  Do not retry unless the code path becomes unmaintainable.

## Blocked / waiting
- AU number regulatory bundle in review with Twilio, submitted 08-14.
  Chase if nothing by 08-21. Does not block staging work.

## Do not do this session
- Do not refactor `lib/sms.ts`. It is ugly and it works.
- Do not touch OneCue. It is PAUSED.
```

### The six questions Landing must answer

Every one of these exists because of a specific way sessions get wasted.

**1. What was the one bet?**
Not the project. The single outcome this session was buying. Without it, Boot starts with "what should I work on," which is a Focus question you already answered and are now paying for twice.

**2. What is the next physical action?**
File path, function, line number. The test: could a competent stranger start it without asking you a question? "Continue the SMS work" fails. "Add the status-callback handler at `app/api/voice/status/route.ts`, the file exists and is empty" passes.

**3. What is the state of play?**
What works, what is half-built, what is deliberately broken. This is what stops you from re-verifying things you already verified.

**4. What is decided and closed?**
The highest-value section. Every closed decision you fail to record is a decision you will re-debate. Three sessions of re-litigating your database choice is three sessions of nothing shipped, and it feels like work the whole time.

**5. What did you try that failed?**
The negative result with the commit SHA. Without it you will rediscover the same dead end in a month and it will cost the same as it did the first time.

**6. What must you *not* do?**
Explicit non-goals for the next session. The refactor you keep eyeing, the paused project, the interesting tangent. Naming it in writing is what stops it from eating the window — an untagged temptation gets re-evaluated every session, and eventually you say yes.

---

## Boot (start of session, 2 minutes)

Read `RESUME.md`, then start. That is the whole protocol, and its discipline is entirely in what you refuse to do.

The failure mode here is not forgetting to read the file. It is reading it and then **opening something else** — the inbox, the issue tracker, the deploy dashboard, yesterday's failing test — and never getting to the next action. Boot exists to move you from cold to typing in under two minutes.

### Protocol

1. Read `RESUME.md`. Do not open anything else first.
2. Check out the named branch.
3. Start the named next action. Immediately, before any grooming, triage, or dependency updates.
4. Do not re-plan. The plan was made by a version of you with full context. Trust them.
5. If the next action is genuinely wrong now, spend at most ten minutes replacing it, log why in `DECISIONS.md`, and go.

### When the agent runs Boot

Read `.mechanisms/RESUME.md` and respond with **at most six lines**:

```
BOOT · evercall · feat/missed-call-sms · 4 days since last session

Bet: missed call → booking SMS, end to end on staging
Next: add status-callback handler at app/api/voice/status/route.ts (empty, signature at route.ts:1-12)
Closed: Twilio chosen; no booking UI this milestone
Avoid: refactoring lib/sms.ts; OneCue is PAUSED
Blocked: AU regulatory bundle, chase 08-21 (does not block today)

Starting there?
```

Do not paste the file back. Do not summarize it into prose paragraphs. Do not offer a menu of alternatives — offering options at Boot re-opens the planning question the last session already closed.

**Then start the work.** Boot ends with the user typing code, not with the user reading a nicely formatted status report.

---

## When there is no RESUME.md

The last session did not land. This is the common case at the start.

Reconstruct once, cheaply, then land properly at the end of this session:

1. `git log --oneline -15` and `git status` — what was actually in flight
2. `git diff` on the working tree — uncommitted work is the strongest signal of where you stopped
3. Check the branch name — usually names the bet
4. Ask the user exactly one question: **"What was the outcome you were going for?"**

Do not interrogate. Do not reconstruct the full history. Get to a plausible next action within five minutes and start. Then run Landing properly at the end so this never happens again.

---

## Anti-patterns

**Writing a status report.** `RESUME.md` is addressed to you, in the second person, with file paths and SHAs. It is not for a stakeholder. If it reads like something you would post in a standup channel, it is too abstract to act on.

**Landing after you are exhausted.** Land with five minutes of energy left, not five minutes of consciousness. A landing written at the end of the tank is vague, and vague landings are the same as none.

**Letting it grow into a log.** `RESUME.md` is overwritten every session and stays under a page. Durable decisions go to `DECISIONS.md`, durable lessons to `LEARNINGS.md`. A `RESUME.md` that accumulates becomes a document you skim instead of read, and a skimmed handoff is a failed one.

**Vague next actions.** "Continue the integration" means Boot has to re-plan, which means Boot costs twenty minutes, which means the mechanism did nothing.

**Skipping Landing because the session went badly.** Failed sessions produce the most valuable handoffs — that is where "tried and failed" comes from. A wasted session that is written down is a cheap negative result. A wasted session that is not becomes a wasted session you will repeat.

---

## Why this is the wedge

Every other mechanism in this skill improves work that is already happening. Re-entry creates the sessions in the first place, by refusing to spend them on reconstruction.

It is also the mechanism nobody else builds, because the people writing founder tooling are full-time and do not have this problem. The gap between Tuesday and Saturday is invisible if you never leave.

Measure it: for the next four sessions, note the clock when you open the laptop and the clock when you type the first real line of code. That gap, times your sessions per month, is what this mechanism is worth to you. Use your own number — not a claim from a README.
