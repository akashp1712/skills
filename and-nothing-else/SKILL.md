---
name: and-nothing-else
description: Stops the agent from "also" helping. After any edit, it must do only what was asked, then print a temptation log of the extra work it wanted to do and did not. Auto-applies on implementation, refactors, fixes, and "while you're at it" impulses. Triggered by /and-nothing-else.
user_invocable: true
---

# And nothing else

You asked for a thing. Helpful agents do the thing **and** rename the folder, **and** extract a hook, **and** add a test file, **and** fix the unused import next door.

That extra help is where reviews go to die, and where "quick typo fix" becomes a 400-line diff.

This skill has one job: **do the ask. Log the rest. Do not do the rest.**

The log is the product. If there is no temptation log, the skill did not run.

---

## When it applies

**Always on** for: implementation, bugfix, refactor, copy change, "fix this", "rename this", "add this."

**Off** for: questions, reviews with no edits, "improve this file" (the ask *is* extra), or when they explicitly say `also`, `while you're at it`, `clean up`, `and also`.

If they said also, do those things. They are now the ask. Log what you still did not do.

---

## The rule

1. Restate the ask in their words, one line. If you cannot, ask. Do not guess a bigger job.
2. Touch the minimum. Prefer edit over create. Prefer one file over three.
3. Do not: reformat unrelated lines, "improve" names they did not mention, add files they did not ask for, upgrade deps, write tests they did not ask for, add comments that narrate, fix adjacent warnings, drive-by a11y, drive-by types.
4. If a change is required for the ask to work (the code would not compile otherwise), it is the ask. Do it. It does not go in the log.
5. Everything else goes in **NOT**.

---

## Temptation log (required)

End every turn that touched a file with this block, exactly this shape, no heading fluff:

```
DID      <their ask, in their words>
CHANGED  <path> <what, in a few words>
NOT      <thing you wanted to do>
         <thing you wanted to do>
         <thing you wanted to do>
```

Rules for `NOT`:

- Name concrete work, not virtues. Bad: "over-engineer." Good: "extract `useCheckout()` into `hooks/useCheckout.ts`."
- Three is the default. Two is fine. Zero is allowed only when the ask *was* the whole file. Write `NOT      —` in that case.
- Never put something in `NOT` that you actually did.
- Never skip the block because the turn was "small." Small turns are where the unused-import cleanup sneaks in.

---

## Examples

Ask: "Rename `getUser` to `getAccount` in `auth.ts`."

```
DID      rename getUser to getAccount in auth.ts
CHANGED  auth.ts — identifier + one call site
NOT      move auth.ts into lib/auth/
         add a deprecated alias for getUser
         run a repo-wide rename in the dashboard app
```

Ask: "The submit button is still active while the request is in flight."

```
DID      disable submit while the request is in flight
CHANGED  CheckoutForm.tsx — disabled={pending} on the button
NOT      swap the form to react-hook-form
         add a spinner component
         disable the whole fieldset
```

Ask: "Fix the typo in the heading."

```
DID      fix the typo in the heading
CHANGED  page.tsx — Recieve → Receive
NOT      reformat the file
         rewrite the heading to be punchier
         extract the heading into a Heading component
```

---

## If you already did too much

Do not apologize in a paragraph. Revert the extra. Keep the ask. Then log what you reverted as `NOT`.

---

## Final check

- Could I paste DID next to their message and have them match?
- Is every extra impulse in NOT, not in the diff?
- Did I skip the log? Then the skill failed.
