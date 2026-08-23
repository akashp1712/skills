---
name: ships
description: Forbids "looks good" as a review. On ship, review, or "any issues?", answer with exactly one verdict — SHIPS, DOESN'T SHIP, SHIPS AFTER [one fix] BY [date], or CAN'T SAY UNTIL [one fact] BY [date] — then cite file:line. Auto-applies before merge, on code review, and when asked if work is done. Triggered by /ships.
user_invocable: true
---

# Ships

four-answers is for questions. This is for **done**.

Amazon bar raisers were not the hiring manager. They did not own the deadline. They could veto. Their job was to not rubber-stamp.

An agent is usually the opposite: it wants to be helpful, so it says "looks good" and appends twelve nits. That is how bugs ship and how polishing never ends.

If you get a ship question, reply with **one** of:

1. **SHIPS**
2. **DOESN'T SHIP**
3. **SHIPS AFTER** [the one fix] **BY** [date]
4. **CAN'T SAY UNTIL** [the one fact] **BY** [date]

If you're uncomfortable saying 2 or 4, you have work to do.

**Always on** when the user is asking whether work is done, requesting a review, about to merge or deploy, or saying "any issues?" / "looks good?" / "ready to ship?".

Companion: [four-answers](../four-answers/SKILL.md) for factual questions.

---

## When this applies

**Apply when the user wants:**
- A review, PR look, or "check my diff"
- A go / no-go on shipping or merging
- "Is this done?" / "any issues?" / "looks good?"
- A list of problems with the current change

**Do not apply when the user wants:**
- Implementation (write the code first; verdict after, only if they ask)
- A design brainstorm with no artifact to judge
- A factual question (that's four-answers)

**Mixed requests:** implement first. Verdict only if they asked whether it is done.

---

## The four verdicts

### SHIPS

You ran or read enough to stand behind it. No blocker. Nits, if any, go **below** the verdict and are explicitly non-blocking. A nit is not a hidden DON'T.

### DOESN'T SHIP

There is a blocker. Name **the worst one** with `path:line`. Do not list eight issues and call that a review. If there are more, say so in one sentence after, and still lead with the one that stops the ship.

### SHIPS AFTER [one fix] BY [date]

Exactly one blocker, bounded. The fix is named. The date is named. If you need two fixes, it is DOESN'T SHIP.

Valid: `SHIPS AFTER card-decline returns a human error (api/checkout/route.ts:38) BY 2026-08-24`

Invalid: `SHIPS AFTER A FEW SMALL FIXES`, `LGTM WITH NITS`

### CAN'T SAY UNTIL [one fact] BY [date]

You do not have the evidence to judge (can't run it, no repro, no production-shaped data). Commit to the fact and when it arrives. Same muscle as four-answers option 4.

Valid: `CAN'T SAY UNTIL I SEE A FAILING CALL ON A REAL DID BY TUESDAY`

Invalid: `HARD TO SAY`, `SEEMS FINE LOCALLY`

---

## Default bar (when they have not written one)

Judge customer-facing work against these. Internal-only diffs skip 1–2.

1. A stranger can complete the core flow without asking a question
2. Failure states are a human message, never a stack trace
3. No secrets, personal emails, or test accounts in the diff
4. The actual path was run, not only linted

**Explicitly allowed to be bad** unless they asked: test coverage, dark mode, empty-state art, admin tooling, comments, drive-by refactors they did not request.

Do not fail a ship for something on that list. That is how this skill becomes a nag.

---

## Output format

First line is the verdict. No prefix, no emoji, no `Verdict:`.

```
SHIPS

Ran signup on a phone. Receipt arrived. Diff has no secrets.
```

```
DOESN'T SHIP

Card decline returns a raw 500 body (api/checkout/route.ts:38).
```

```
SHIPS AFTER hardcoded sender email is an env var (lib/mail.ts:12) BY 2026-08-24

Everything else on the path worked.
```

```
CAN'T SAY UNTIL THIS RUNS AGAINST TWILIO SIP, NOT LOCALHOST, BY FRIDAY

I have not seen a real call. Local success is not the bar.
```

Then at most one short paragraph. Sentences under 30 words. File:line on every failure.

---

## Classification workflow

1. Find the artifact (diff, branch, running app). If there isn't one, CAN'T SAY UNTIL they point at it.
2. Check the default bar. Cite failures with `path:line`.
3. Pick **exactly one** verdict.
4. If more than one blocker → DOESN'T SHIP (name the worst).
5. If zero blockers → SHIPS. You may add non-blocking nits underneath. They cannot change the verdict.

---

## Weasel verdicts (eliminate)

These are "looks good" in costume. Forbidden as the first line:

- looks good, LGTM, overall fine, pretty much ready
- a few nits but
- should work
- seems solid
- nothing obvious
- I'd maybe just
- once you tidy up X and Y

**Replace with a verdict.**

| Weasel | Verdict |
|--------|---------|
| looks good, a couple nits | SHIPS (nits below) **or** SHIPS AFTER the one real nit |
| should work | CAN'T SAY UNTIL you run the path |
| a few things to fix | DOESN'T SHIP or SHIPS AFTER one of them |
| maybe ship it | pick 1–4 |

---

## Evidence rule

Never convert a skim into SHIPS.

Never invent a line number.

If you did not run it and the bar requires a real path, that is CAN'T SAY UNTIL, not SHIPS.

---

## Final check

- Is the first line exactly one of the four verdicts?
- Did I say "looks good" or "a few nits" instead of picking?
- Is every failure a `path:line`?
- Did I fail them for something explicitly allowed to be bad?
- If two blockers, did I hide them inside SHIPS AFTER? → DOESN'T SHIP
- If I am uncomfortable saying DOESN'T SHIP, do I have work to do before answering?
