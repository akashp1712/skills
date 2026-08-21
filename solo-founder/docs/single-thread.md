# Single-thread — one open thread at a time

For the agent: run this mechanism. Do not summarize this document to the user.

> "The best way to fail at inventing something is by making it somebody's part-time job."
> — Dave Limp, Amazon SVP of Devices, quoted in *Working Backwards*

This is the most uncomfortable Amazon principle for a one-person company, because every hat is already yours. You are, definitionally, making everything somebody's part-time job — and the "somebody" has a calendar with no edges.

The useful reading is not "give up." It is that **the failure mode Amazon identified is real and you are exposed to it**, so you need a compensating mechanism where Amazon used headcount.

---

## What Amazon actually did

In 2003, after Steve Jobs demonstrated iTunes for Windows, Bezos faced digital media as an existential threat. The intuitive response is an all-hands-on-deck effort across the existing, thriving physical-media organization.

He did the opposite. He moved Steve Kessel — who was running the profitable books business — off that business entirely, and made him single-threaded on Digital, reporting directly to Bezos. Bill Carr's recollection in *Working Backwards* is that the team's obvious question was why they could not simply run digital as part of what they already did.

The answer is the mechanism: the demands of a working business will absorb all available attention. Not because people are undisciplined, but because existing commitments are concrete and urgent while new work is abstract and deferrable.

*Working Backwards* defines the structure as: "A single person, unencumbered by competing responsibilities, owns a single major initiative and heads up a separable, largely autonomous team to deliver its goals."

The operative phrase is **unencumbered by competing responsibilities**.

---

## The solo translation

You cannot separate by *person*. You separate by **time**.

A thread is one outcome held open. Single-threading means **exactly one thread is open at any moment** — this morning, this afternoon. The day will offer you support, the dashboard, and a rewrite. They are not a queue. They are bait.

This is not about how many projects you own. Owning three things is fine. Holding three of them open simultaneously is what destroys throughput, because the cost is not the hours, it is the reload.

### Why switching is more expensive for you than for a team

At Amazon, single-threading solves **coordination overhead** between teams. Solo, there is no one to coordinate with — so the equivalent cost lands somewhere else: **the reload.**

Every thread you hold open occupies working memory. Two open threads means every session begins by rebuilding two mental models, and the second one is never fully loaded. Work done on a partially loaded model is where the subtle bugs and the wrong abstractions come from — the ones you fix twice.

Two threads do not split cleanly. Each one is partially loaded, and work done on a partial load is where the subtle bugs come from — the ones you fix twice.

The missing time is reload. That is the whole cost.

---

## The mechanism

**One thread open. Everything else goes to a list, not a branch.**

The single highest-leverage habit here: when a new idea arrives mid-session — and it will, most often when the current thread hits its hard part — write it down and keep going.

```markdown
## Parked
- Add rate limiting to the API (noticed while writing the webhook)
- Onboarding email 2 reads badly, rewrite
- Try Vercel cron instead of the polling loop
```

Parking takes eight seconds and preserves the reload you already paid for. Opening a second branch costs the rest of the session and usually a piece of the next one.

**Diagnostic:** a new idea arriving while the current thread is stuck is not inspiration. It is avoidance wearing inspiration's clothes. The new thing is appealing precisely because it has no hard parts yet. Park it, then go look at what you are avoiding — that is almost always where the real work is.

### Batch by mode, not by project

Context reload is driven by **mode**, not by codebase. Building, selling, and writing use different working memory. Switching between two features in one repo is cheap. Switching from writing code to writing a landing page is expensive even inside one project.

So group by mode. A session is a build session, a sell session, or a write session. Do not interleave.

### Session scale

For a short session, one thread means **one outcome you could name in a sentence**, sized to actually finish. Not "work on billing" — "the upgrade button charges a test card successfully."

An unfinishable thread is the same as no thread, because an unfinished thread must be reloaded next time, which is the cost you were trying to avoid.

---

## Where this shows up in the other mechanisms

Single-threading is what makes [re-entry](re-entry.md) cheap. `RESUME.md` names **the one bet** — if there were three, the handoff would not fit on a page and would not be read.

It is also why [velocity](velocity.md) matters so much. Every open decision is a partially open thread, holding memory. Deciding at 70% and logging it closes the thread; researching for another week leaves it running in the background of everything else you do.

---

## Anti-patterns

**Parallel branches "to stay unblocked."** You are one person. There is no parallelism available, only interleaving, and interleaving costs reload every time.

**Treating a paused thread as free.** An open loop you are not working on still occupies memory. Either close it, finish it, or write down explicitly that it is not happening.

**Mode-switching inside a session.** Shipping a feature and then writing marketing copy in the same two hours produces mediocre versions of both.

**Threads too large to finish.** "Rebuild onboarding" is not a thread, it is a project. Cut until it fits the session you actually have.

**Starting a second thread at the hard part.** The most expensive habit in solo building, and the most self-justifying, because the new thread genuinely does feel more productive for about forty minutes.
