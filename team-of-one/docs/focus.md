# Focus — one primary, everything else named

Your capacity is fixed and small. Your project count is not, and it only moves in one direction unless something stops it.

The damage from a second project is not the hours it takes. It is that **an unnamed project runs in the background of every session you spend on something else.** You think about it in the shower. You feel guilty about it on Saturday. It costs you attention on the project you are actually working on, and it produces nothing, because it never gets a real window.

The mechanism is not "have fewer ideas." It is **naming the state of every project in writing** so that the ones you are not doing stop taxing the one you are.

---

## The four states

Every project is in exactly one, and it is written down.

**`PRIMARY`** — gets the real hours. **Exactly one.** Not two. If two things are primary, neither is, and you will discover this in three months when both are 60% done.

**`MAINTENANCE`** — stays alive, gets no new features. Bugs, renewals, DNS, keeping the lights on. Bounded: name the hours per week you will give it.

**`PAUSED`** — deliberately stopped, with a written resume condition. This is the state that buys back the guilt. A paused project is not a failure and not a burden, because you have decided about it. The condition matters: "when Evercall clears its revenue gate" is a resume condition, "when I have more time" is not.

**`KILLED`** — stopped permanently, with a one-paragraph obituary in `LEARNINGS.md`. Killing is a skill. Most solo builders have never killed anything, which is why they are carrying six things.

The word does the work. Writing `PAUSED` next to a project converts an open loop into a closed one, and the difference in how much room it takes up is real.

---

## `PORTFOLIO.md`

```markdown
# Portfolio

Capacity: ~8 hrs/week (day job). Reviewed monthly.

## PRIMARY · evercall
Missed-call booking for AU plumbers. evercall.ai
Bet: 3 paying trades by 2026-10-01.
Kill gate: if 0 paying customers by 2026-11-01, drop to PAUSED and
write the obituary. Set 2026-08-07, when I had no sunk cost.

## MAINTENANCE · onecue (1 hr/mo)
Landing + waitlist live at onecue.app. No extension, no capture API.
Maintenance means: DNS, waitlist replies. Nothing else.

## MAINTENANCE · skills (2 hrs/week)
Audience wedge, not a product. four-answers, amazon-writing, team-of-one.
This is allowed hours because it feeds distribution for everything else.

## PAUSED · onecue product build
Resume condition: Evercall hits its revenue gate, OR Evercall gets killed.
Not "when I have time." Time is not a condition, it is a wish.

## KILLED
- Studio Flow routing (2026-08) — see LEARNINGS.md
```

---

## Triage protocol

Run monthly, or the moment you notice yourself scattered. Fifteen minutes.

1. **List every project that occupies space in your head.** Including the ones with no code. Including the one you have not opened in four months. Especially that one — unlisted projects do the most damage.

2. **State the capacity honestly.** Hours per week, after the day job, after life. Most people write down double what they have. Use the last four weeks as evidence, not your intentions.

3. **Pick the one `PRIMARY`.** The tiebreaker is not which is most exciting — it is which one is closest to a real signal from a real person outside your head. Excitement is how you ended up with six.

4. **Assign every other project a state.** No project may remain unlabeled. If you cannot bring yourself to write `PAUSED`, that is the interesting finding, and it usually means you have two primaries and are avoiding the choice.

5. **Check every kill gate.** Any gate whose date has passed gets enforced now, not renegotiated.

6. **Write it to `PORTFOLIO.md` and commit it.**

---

## Kill gates

**Write the gate before you start, when you have no sunk cost. Enforce it later, when you do.**

This is the entire mechanism, and it works for exactly one reason: the version of you at the start is objective, and the version of you six months in is not. You are pre-committing on behalf of your own future judgment, because you already know it will be compromised.

A gate needs a **measurable condition** and a **date**:

- "If 0 paying customers by 2026-11-01, drop to PAUSED" — a gate
- "If this doesn't get traction, I'll reconsider" — not a gate
- "If fewer than 10 waitlist signups from 3 posted communities by 03-15, kill" — a gate

At the date, the answer is Yes, No, or a number. Not "it's showing promise." ([four-answers](../../four-answers/SKILL.md) applies here more than anywhere.)

**Moving a gate is allowed exactly once**, and only with new evidence written down. A gate moved twice is not a gate.

---

## Killing well

Killing is not failure — shipping nothing for two years because you could not choose is failure.

When you kill something, write the obituary in `LEARNINGS.md`. One paragraph:

```markdown
## KILLED 2026-11-02 · onecue product build

Ran 5 months, ~40 hrs, landing + waitlist shipped, product never built.
Killed at its gate: 12 waitlist signups against a 50 gate.

What was true: the capture problem is real — I have it, and every founder
I described it to recognized it instantly.
What was false: recognition is not demand. Nobody asked when it would ship.
Nobody asked to pay. I mistook "that's a good idea" for a signal.

Mechanism change: added to BAR.md — before building, require one person
who is not me to ask when it ships, unprompted.
```

The mechanism change at the end is the point. A kill without one is just a loss.

---

## Anti-patterns

**Two primaries.** The most common and most expensive error. It reliably produces two 60%-complete projects and no shipped one.

**Silent pausing.** Stopping without writing `PAUSED` gives you all the guilt of an active project and none of the progress. This is the single cheapest fix in this whole skill.

**"Maintenance" that grows features.** Maintenance is bounded hours for keeping the lights on. The moment you add a feature, you have two primaries — you just have not admitted it.

**Renegotiating gates at the deadline.** The whole design is that past-you binds present-you. If present-you can always overrule, you have no mechanism, just a note.

**Starting a new project to avoid a hard part of the current one.** New projects are pleasant because they have no hard parts yet. If a new idea arrives while the primary is stuck, that is diagnostic — log the idea, then go look at what you are avoiding.

**Counting the day job as zero.** It is your largest commitment and it varies. A hard week at Salesforce is a week your side capacity is near zero, and planning as though it is not is how gates get missed for reasons that have nothing to do with the product.
