# Bar Raiser — the reviewer you do not have

At Amazon the bar raiser is deliberately **not** the hiring manager. They do not own the outcome, they are not under the deadline, and they can veto. The mechanism works because of the separation, not because bar raisers are smarter.

Solo, you are the manager, the candidate, and the deadline. At 11pm on a Sunday, with the feature nearly working, you are the least qualified person alive to judge whether it ships.

You cannot separate the roles by person. You can separate them **in time**.

**Write the bar when you are not attached. Enforce it when you are.**

---

## The bar is written once, in advance

`.mechanisms/BAR.md` is written at the start of a project — before there is code to defend, before there is a launch date, before you are tired. That version of you is the closest thing you have to an impartial reviewer.

A bar is only useful if it is **checkable**. "High quality" is not a bar. "A stranger can complete signup without messaging me" is a bar, because there is a fact of the matter and you can go find out.

### Template

```markdown
# Bar

## Ship bar (anything a customer touches)
- [ ] A stranger completes the core flow without asking me a question
- [ ] Works on a real phone on 4G, not just localhost
- [ ] Failure states show a human message, never a stack trace
- [ ] No hardcoded personal data, test numbers, or my own email
- [ ] Secrets are in env vars, verified not in the diff
- [ ] I have run the actual end-to-end path myself today

## Merge bar (internal, no customer impact)
- [ ] No TODO or commented-out block in the diff
- [ ] Names say what the thing is, not what I was thinking at the time
- [ ] If I read this in six weeks with no context, I would understand it
- [ ] Nothing broke that used to work

## Explicit non-bars
These are allowed to be bad. Naming them stops perfectionism from
masquerading as standards.
- Test coverage below 100%
- Ugly internal code that works and is isolated
- Missing admin tooling — I am the only admin
- No dark mode
```

The **non-bars** section matters as much as the bar. Undefined standards expand to fill the available guilt. Writing down what is allowed to be bad is how a solo builder ships anything.

---

## Enforcement

When the user is about to ship, merge, publish, deploy, announce, or take money, read `BAR.md` and check the actual work against it. Check it — do not ask the user whether they checked it. Run the commands, read the diff, look at the failure paths.

Return exactly one verdict:

```
BAR RAISER · ship bar · evercall missed-call SMS

SHIPS AFTER FIX BY 2026-08-18

Passed
- End-to-end path run on a real phone today
- Secrets in env, diff clean

Failed
- Twilio error returns a raw 500 body to the caller
  (app/api/voice/status/route.ts:38) — ship bar line 3
- My personal mobile is hardcoded as the fallback
  (lib/sms.ts:12) — ship bar line 4

Not evaluated
- Load behaviour above 10 concurrent calls. Not on the bar. Not a blocker.
```

Three verdicts, and no fourth:

- **SHIPS** — every bar line passes
- **DOESN'T SHIP** — a bar line fails and there is no committed fix
- **SHIPS AFTER [fix] BY [date]** — the four-answers form of "not yet"

"Looks good to me" is not a verdict. Neither is a list of suggestions with no decision at the end.

---

## The veto has to be real

**If the bar raiser has never once said `DOESN'T SHIP`, the mechanism is theater.** Delete it, or make the bar mean something.

This is the failure mode to watch for, and it is subtle: the bar quietly gets reinterpreted rather than failed. "A stranger can complete signup" becomes "well, a *technical* stranger could." That is not passing the bar, that is editing it at enforcement time — the one moment you are least entitled to.

The rule: **the bar may only be changed at Landing, never at ship time.** If you genuinely believe a line is wrong, ship-blocked, and write the change into `BAR.md` in a separate session. Changing the bar while standing in front of it is how bars die.

For the agent: your job at this moment is not to be encouraging. The user has no one else who will say no. Say the true thing plainly, cite the bar line and the file location, and let them override you — overriding a stated objection is a decision, and it gets logged. Silently agreeing is not.

---

## Where the bar comes from

Three sources, in order of usefulness:

**Things that already bit you.** Every entry in `LEARNINGS.md` that starts with a customer-visible failure should have produced a bar line. This is the main way a bar gets good — it accretes from real damage rather than from imagination.

**The stranger test.** For anything customer-facing: could someone who has never met you complete this? Solo builders systematically overestimate this because they have never watched anyone else use the thing.

**Your tenets.** If you have written tenets ([amazon-writing/docs/tenets.md](../../amazon-writing/docs/tenets.md)), the bar is where they become enforceable. A tenet nobody checks is a poster.

A bar of six to ten lines that you actually run beats thirty lines you skim. Start with the things that have already embarrassed you.

---

## Anti-patterns

**A bar written at ship time.** It will be exactly permissive enough to pass. This is the whole reason the timing separation exists.

**Aspirational bars.** "100% test coverage" on a nights-and-weekends project means the bar gets ignored entirely, which costs you the lines that mattered.

**Confusing the merge bar with the ship bar.** Internal code that works and is isolated does not need the customer-facing bar. Applying the ship bar to everything is how solo builders stop shipping.

**Treating the bar as a to-do list.** It is a gate, not a backlog. Failed lines are either fixed before shipping or the thing does not ship.

**Silent overrides.** You are allowed to ship past your own bar — you own the company. You are not allowed to do it without writing down that you did, in `DECISIONS.md`, with the reason. Overrides that are logged get reviewed at Retro. Overrides that are not become the new bar.
