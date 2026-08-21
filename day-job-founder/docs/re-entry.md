# Re-entry — recovering context in two minutes instead of ninety

For the agent: run this mechanism. Do not summarize this document to the user. Boot is six lines, then work. Land is the file, not a report.

Every session you work on something, you built a mental model: which branch, what is half-done, what you already tried, what you decided and why. When the session ends, that model evaporates. The code persists. The model does not.

So the start of every session gets spent rebuilding it. That reconstruction produces nothing, and you pay it again every single time.

It scales with the gap. A few hours away and most of the model survives. Several days and almost none of it does.

**The fix is not better memory. It is refusing to end a session without writing the handoff.**

Two halves, deliberately asymmetric:

- **Landing** costs five minutes at the end, when context is free — you already have it
- **Boot** costs two minutes at the start, when context is expensive — you have none

You pay a cheap tax to avoid an expensive one. Landing is the half people skip, and skipping it is exactly what makes Boot impossible.

---

## Landing (end of session, 5 minutes)

Run it **before** you are tired, not after. When the window is closing, stop working with five minutes left and land the plane.

A clean landing beats five more minutes of half-finished work. Unfinished work with no note is negative value — next session you will read it, fail to understand it, and possibly revert it.

Overwrite `.mechanisms/RESUME.md` entirely. It is a snapshot, not a log. Durable things go to `DECISIONS.md` or `LEARNINGS.md`.

### Template

```markdown
# Resume

Last session: 2026-08-16 · Branch: feat/checkout

## The one thread
Get a test card to complete checkout and produce a receipt.

## Next action (startable in 5 minutes)
Add the Stripe webhook handler at `app/api/stripe/route.ts`.
File exists and is empty. Signature pattern at `app/api/health/route.ts:1-14`.

## State of play
- Checkout session creation works, verified with a test card Tuesday
- Receipt email works in isolation (`lib/mail.ts`), never wired to the webhook
- Test DB has junk orders from testing — ignore, do not clean up

## Decided, do not re-open
- Stripe over Paddle — see DECISIONS.md 2026-08-11
- No invoice PDF this milestone. Email receipt is enough.

## Tried and failed
- Polling the sessions API instead of webhooks — race conditions,
  reverted at 3f2a1c9. Do not retry.

## Blocked / waiting
- Business verification with Stripe, submitted 08-14. Chase if nothing
  by 08-21. Does not block test mode.

## Do not do this session
- Do not refactor `lib/mail.ts`. It is ugly and it works.
```

### The six questions, and why each exists

**1. What was the one thread?**
The single outcome the session was buying. Without it, Boot starts with "what should I work on," which re-opens a question you already answered.

**2. What is the next physical action?**
File path, function, line. Test: could a competent stranger start it without asking you anything? "Continue the checkout work" fails. The template line above passes.

**3. What is the state of play?**
What works, what is half-built, what is deliberately broken. Stops you re-verifying what you already verified.

**4. What is decided and closed?**
Highest-value section. Every unrecorded closed decision is one you will re-debate, and re-debating feels like work the entire time.

**5. What did you try that failed?**
The negative result with a commit SHA. Otherwise you rediscover the same dead end in a month at full price.

**6. What must you not do?**
The refactor you keep eyeing, the tangent. An untagged temptation gets re-evaluated every session, and eventually you say yes.

---

## Boot (start of session, 2 minutes)

Read `RESUME.md`, then start. The discipline is entirely in what you refuse to do first.

The failure mode is not forgetting to read it. It is reading it and then opening the inbox, the issue tracker, the analytics tab, or yesterday's failing test — and never reaching the next action.

### Protocol

1. Read `RESUME.md`. Open nothing else first.
2. Check out the named branch.
3. Start the named action immediately — before grooming, triage, or dependency updates.
4. Do not re-plan. The plan was made by a version of you with full context.
5. If the action is genuinely wrong now, spend at most ten minutes replacing it, log why, and go.

### Agent output

At most six lines:

```
BOOT · feat/checkout · 4 days since last session

Thread: test card completes checkout and produces a receipt
Next: add Stripe webhook handler at app/api/stripe/route.ts
      (empty; pattern at app/api/health/route.ts:1-14)
Closed: Stripe chosen; no invoice PDF this milestone
Avoid: refactoring lib/mail.ts
Blocked: business verification, chase 08-21 (does not block test mode)

Starting there?
```

Do not paste the file back. Do not expand it into prose. **Do not offer a menu of alternatives** — offering options at Boot re-opens the planning question the last session closed.

Then start the work. Boot ends with code being written, not with a well-formatted status report.

---

## When there is no `RESUME.md`

The last session did not land. Common at the start.

Reconstruct once, cheaply, then land properly at the end so it does not recur:

1. `git log --oneline -15` and `git status` — what was in flight
2. `git diff` — uncommitted work is the strongest signal of where you stopped
3. The branch name usually names the thread
4. Ask exactly one question: **"What outcome were you going for?"**

Do not interrogate and do not reconstruct full history. Reach a plausible next action within five minutes and start.

---

## Anti-patterns

**Writing a status report.** `RESUME.md` is addressed to you, in the second person, with paths and SHAs. If it reads like a standup update, it is too abstract to act on.

**Landing when exhausted.** Land with five minutes of energy left, not five minutes of consciousness. A vague landing is the same as none.

**Letting it grow into a log.** Overwritten every session, under a page. A `RESUME.md` you skim is a failed handoff.

**Vague next actions.** "Continue the integration" forces Boot to re-plan, so Boot costs twenty minutes and the mechanism did nothing.

**Skipping Landing after a bad session.** Failed sessions produce the most valuable handoffs — that is where "tried and failed" comes from. A wasted session written down is a cheap negative result. Unwritten, it is a session you will repeat.

---

## Measure your own

For four sessions, note the clock when you open the laptop and when you type the first real line of code. That gap, times sessions per month, is what this mechanism is worth to you.

Use your own number. If Landing does not pay for itself, stop running it — the same rule applies to every mechanism here.
