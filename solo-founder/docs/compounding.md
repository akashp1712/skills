# Compounding — never do the same work twice

For the agent: run this mechanism. Do not summarize this document to the user. One verdict at ship time. One mechanism change after an incident. "Be more careful" is not a correction.

Two Amazon mechanisms share one purpose: making sure work done once stays done. The bar raiser prevents rework before it happens. The COE prevents the same failure from recurring.

For a one-person company both collapse into a single efficiency question: **what stops me spending the afternoon on a problem I already solved?**

---

## Part 1 — The bar

### Why it is a separation mechanism

At Amazon the bar raiser is deliberately **not** the hiring manager. They do not own the outcome, are not under the deadline, and can veto. The mechanism works because of the separation, not because bar raisers have better judgment.

Solo you are the owner, the reviewer, and the deadline. Late in the day, with a feature nearly working and no one to call time, you are the least qualified person available to judge whether it ships.

You cannot separate by person. **Separate by time: write the bar before you are attached, enforce it when you are.**

### The efficiency argument

An unwritten definition of done costs you twice, in opposite directions:

- **Gold-plating** — polishing things nobody will notice, because there is no line that says "enough"
- **Rework** — shipping something broken, then fixing it under pressure with a customer waiting, which costs several times what fixing it beforehand would have

A written bar collapses both. It tells you what to skip as clearly as what to check, and the "allowed to be bad" list is the half that actually speeds you up.

### `BAR.md`

```markdown
# Bar

Written in advance. Changed only in a separate session — never at ship time.

## Ship bar (anything a customer touches)
- [ ] A stranger completes the core flow without asking me a question
- [ ] Works on a real phone on mobile data, not just localhost
- [ ] Failure states show a human message, never a stack trace
- [ ] No hardcoded personal data, test accounts, or my own email
- [ ] Secrets in env vars, verified not in the diff
- [ ] I ran the actual end-to-end path myself today

## Merge bar (internal, no customer impact)
- [ ] No TODO or commented-out block in the diff
- [ ] Readable in six weeks with no context
- [ ] Nothing broke that used to work

## Explicitly allowed to be bad
- Test coverage below 100%
- Ugly internal code that works and is isolated
- Missing admin tooling — I am the only admin
- No dark mode, no empty-state illustrations
```

### Enforcement

At ship time, check the work against the bar. Check it — do not ask whether the user checked it. Run the commands, read the diff, follow the failure paths.

```
BAR · ship · checkout flow

SHIPS AFTER FIX BY 2026-08-18

Passed
- End-to-end path run on a real device today
- Secrets in env, diff clean

Failed
- Card decline returns a raw 500 body (api/checkout/route.ts:38) — bar line 3
- My personal email hardcoded as the receipt sender (lib/mail.ts:12) — bar line 4

Not evaluated
- Behaviour above 50 concurrent checkouts. Not on the bar. Not a blocker.
```

Three verdicts, no fourth: **SHIPS**, **DOESN'T SHIP**, or **SHIPS AFTER [fix] BY [date]**.

Two rules keep this honest:

**The bar may only change in a separate session.** The common failure is not overriding the bar, it is quietly reinterpreting it — "a stranger could complete signup" becomes "a *technical* stranger could." That is editing the bar at the one moment you are least entitled to.

**Overrides get logged.** You own the company; you may ship past your own bar. You may not do it silently. A logged override gets reviewed later. An unlogged one becomes the new bar.

For the agent: the user has no one else who will say no. Say the true thing, cite the bar line and file location, and let them override. Silent agreement is the failure.

---

## Part 2 — The COE

### The question that defines the mechanism

Colin Bryar, on shadowing Bezos: "Most people are actually trying pretty darn hard, and they have good intentions. So when we ran into an issue or a problem, Bezos would always ask, **'Do we have a mechanism in place so it doesn't happen again?'** Because if this high-performing or well-intentioned person tripped up, there's probably a process that we need to fix."

That is the whole thing. Not "who messed up" and not "be more careful," but: what condition made this possible, and is it still there?

### The solo five whys

Use the [COE format](../../amazon-writing/docs/coe.md) for the document. The solo-specific part is where the chain terminates.

With no team and no process to blame, the chain almost always bottoms out at **"no mechanism existed."** Uncomfortable, but actionable in a way "I was rushing" is not.

```
A customer got a stack trace instead of a receipt.

1. Why? The payment handler threw and the error reached the response.
2. Why? No error handling around the receipt email.
3. Why? I added the email at 11pm the night before a demo.
4. Why? I shipped without running the ship bar.
5. Why? The bar existed but nothing forced me to run it before deploy.

Root cause: no gate between "works locally" and "live."

Corrections:
- Ship bar runs on every deploy, not when I remember.
- New bar line: failure states show a human message, never a stack trace.
- Deploying is a separate session from writing the code. Never both at 11pm.
```

The third correction is the strongest, and it changes *when* you work rather than what you check. Timing corrections beat checklist corrections for solo builders, because a checklist depends on the same tired person who wrote the bug.

**Write one COE per customer-visible incident, within a week.** A COE you never write is an incident you will have again — and the second occurrence always costs more, because by then there is a customer waiting.

---

## Part 3 — Reading the log

Monthly, read `DECISIONS.md` and `LEARNINGS.md` end to end. Ten minutes. You are looking for exactly two things.

**Repeats.** The same lesson twice means the first correction did not take. Do not restate it — make it structural. A rule you must remember is not a mechanism.

**Quietly re-opened decisions.** If you are weighing something `DECISIONS.md` already closed, either honor it or supersede it with a new dated entry. Ambiguous decisions get re-debated on the most expensive day available.

Every `LEARNINGS.md` entry ends with a mechanism change, or it is just a loss:

```markdown
## 2026-08-16 · Receipt emails failed silently for 3 days
Nothing alerted me. Found it because a customer asked where their receipt was.
Mechanism: bar line added — every outbound email path logs a failure I can
see without being told. Checked in the weekly review.
```

---

## When the agent runs this

1. **Check the bar directly** against the actual diff and running behaviour.
2. **Return one verdict.** Never a list of suggestions with no decision.
3. **Refuse to reinterpret a bar line** to make it pass. Fail it and cite it.
4. **On any incident, ask the mechanism question** — not what went wrong, but what makes it impossible next time.
5. **Reject "be more careful" as a correction.** That is a good intention.
6. **Prefer timing and structural corrections** to checklist additions.

---

## Anti-patterns

**A bar written at ship time.** It will be exactly permissive enough to pass.

**A bar raiser that never says no.** If the verdict is always SHIPS, delete the mechanism — it is producing false confidence at a cost.

**Aspirational bars.** "100% coverage" on a solo project means the bar gets ignored wholesale, including the lines that mattered.

**Applying the ship bar to internal code.** Isolated code that works does not need the customer-facing bar. This is how solo builders stop shipping.

**Corrections that are resolutions.** "Be more careful," "remember to check," "next time I'll." All good intentions, all fail the mechanism test.

**Skipping the COE because you already fixed the bug.** Fixing the instance is not fixing the condition. The instance took an hour; the condition will take the same hour again.
