# Velocity — decision speed as the primary efficiency lever

For the agent: run this mechanism. Do not summarize this document to the user.

For a solo builder, the largest recoverable waste is not typing speed, tooling, or focus. It is **time spent deciding things that did not deserve the time.**

Amazon wrote the definitive treatment of this in two shareholder letters, and both apply more cleanly to one person than to the large organizations they were written for.

---

## 1. Classify the door

> "Some decisions are consequential and irreversible or nearly irreversible – one-way doors – and these decisions must be made methodically, carefully, slowly, with great deliberation and consultation… We can call these Type 1 decisions. But most decisions aren't like that – they are changeable, reversible – they're two-way doors. If you've made a suboptimal Type 2 decision, you don't have to live with the consequences for that long. You can reopen the door and go back through. Type 2 decisions can and should be made quickly by high judgment individuals or small groups."
> — Bezos, 2015 letter

Bezos's warning is that organizations apply the Type 1 process to Type 2 decisions, and the result is "slowness, unthoughtful risk aversion, failure to experiment sufficiently, and consequently diminished invention."

Solo builders do this constantly, and it is invisible because deliberating feels responsible.

### The classification test

**What does it cost to undo, and has anyone outside your head seen it?**

The second half is the reliable one. Reversibility does not track effort — it tracks exposure. Rewriting three weeks of code is annoying and completely reversible. A published price is nine seconds of work and cannot be taken back.

| Two-way (the vast majority) | One-way |
|------------------------------|---------|
| Framework, language, hosting, schema | Public pricing |
| Design, copy, layout, component library | Domain and brand name |
| Most features, most refactors | Taking a first payment |
| Internal tooling, folder structure | Published API or install command |
| Which model, which vendor | Launch announcement |
| Anything unshipped | Deleting customer data, legal entity, equity |

Before traction, nearly everything is a two-way door. A migration with no customers in it is a `DROP TABLE`.

### Deliberation budget

- **Two-way door: 10 minutes.** Decide alone, log one line, move.
- **One-way door: write it down and sleep on it.** Use a [1-pager](../../amazon-writing/docs/1-pager.md) and state the undo cost explicitly.

If a 1-pager feels like overkill, that is evidence you are looking at a two-way door. Re-check the classification.

---

## 2. Decide at 70%

> "Most decisions should probably be made with somewhere around 70% of the information you wish you had. If you wait for 90%, in most cases, you're probably being slow. Plus, either way, you need to be good at quickly recognizing and correcting bad decisions. If you're good at course correcting, being wrong may be less costly than you think, whereas being slow is going to be expensive for sure."
> — Bezos, 2016 letter

The second sentence is the one people drop, and it is the one that makes the rule safe. **70% is only responsible if you are good at course-correcting.** The mechanism is speed *plus* a correction habit, never speed alone.

### The 70% check

Three questions, one minute:

1. **What would change my mind?** Name the specific fact.
2. **Can I know it today, cheaply?** If yes, go get it. If no, you are at 70% — decide.
3. **How would I notice I was wrong, and how fast could I reverse?** If you can answer, the risk is bounded.

Most solo research fails question 2. The missing information is unknowable before shipping, which means more research produces confidence rather than knowledge — and confidence is not the thing you were short of.

---

## 3. Beat the exhaustion default

This is the passage that transfers most surprisingly to working alone:

> "Without escalation, the default dispute resolution mechanism for this scenario is exhaustion. Whoever has more stamina carries the decision… 'You've worn me down' is an awful decision-making process. It's slow and de-energizing."
> — Bezos, 2016 letter

Bezos is describing two misaligned teams. Solo, the two parties are both you, and there is no one to escalate to. So the default holds: **whichever internal voice has more stamina wins.**

That is almost never the correct one. It is usually the anxious one, late at night, that wants to rebuild instead of ship.

The fix is Amazon's fix — escalate immediately rather than grinding. Solo, escalation means **externalizing**: write the decision down in `DECISIONS.md` with the two options and the undo cost. Writing terminates the loop, because the argument cannot keep circling once both sides are on the page.

If you have re-opened the same question in three separate sessions, that is not diligence. That is exhaustion running the process.

---

## 4. Disagree and commit — with yourself

> "I disagree and commit all the time. We recently greenlit a particular Amazon Studios original. I told the team my view: debatable whether it would be interesting enough, complicated to produce, the business terms aren't that good… I wrote back right away with 'I disagree and commit and hope it becomes the most watched thing we've ever made.'"
> — Bezos, 2016 letter

Solo, you will often be genuinely unconvinced by your own best available option. The move is the same: commit anyway, in writing, with the reservation recorded.

```markdown
## 2026-08-16 · Ship signup without email verification
Type: two-way · Deliberated: 10 min

Disagree and commit: I think we will get junk signups. Committing anyway —
we have 14 users and no evidence this is a real problem. Revisit only if
junk exceeds 20% of signups.
```

The recorded reservation is what stops the decision from being re-litigated, and it gives you a trigger for genuinely re-opening it. Without the trigger, you re-open on mood.

---

## Log it

Append to `.mechanisms/DECISIONS.md`. Never edit an entry; supersede it with a newer one.

```markdown
## 2026-08-16 · Postgres over SQLite
Type: two-way · Deliberated: 8 min

Need concurrent writes eventually, and hosted Postgres is free at this size.

Undo cost: ~half a day, schema is portable. Contained.

Ruled out: SQLite (concurrency), Mongo (no relational need, would regret).

---

## 2026-08-14 · Public price at $29/mo
Type: ONE-WAY · Deliberated: 1-pager, slept on it

Four customer calls: nobody called $29 expensive, one called it cheap.

Undo cost: cannot raise without emailing everyone who saw it. Discounting
down stays available, so the asymmetry favours pricing high.

Ruled out: $19 (leaves margin on the table), usage-based (three of four
said they hate variable bills — strongest signal in the calls).
```

**The ruled-out lines are the highest-value part of the file.** They are what stops a closed question from re-opening, which is the single most common way a solo week evaporates.

---

## When the agent runs this

1. **Classify out loud and commit.** "Two-way door" or "one-way door." Never "it depends."
2. **For two-way doors, recommend one option in two sentences and stop.** Do not produce a comparison matrix. The matrix is how ten minutes becomes an afternoon.
3. **Refuse requested depth when the door is two-way.** If the user asks for a deep comparison of reversible options, name the door type and decline. This is the most valuable thing the agent does here.
4. **For one-way doors, refuse to answer immediately.** Ask for the 1-pager. The delay is the value, not the analysis.
5. **Run the 70% check** when the user is gathering more information: what would change your mind, can you know it today, how fast could you reverse?
6. **Write the entry**, including ruled-out options and any disagree-and-commit reservation.

---

## Anti-patterns

**Comparison matrices for reversible choices.** The cost of the matrix reliably exceeds the cost of picking wrong.

**"It's a two-way door" as licence to not think.** The budget is ten minutes, not zero, and it does not apply to one-way doors.

**Confusing effort with irreversibility.** A month of code is reversible. A tweet is not.

**Re-opening on mood rather than trigger.** A committed decision re-opens when its stated trigger fires, not when you feel uncertain on a Sunday.

**Not logging small decisions.** Small closed decisions are exactly the ones you will re-open, because you will not remember closing them. One line is enough.
