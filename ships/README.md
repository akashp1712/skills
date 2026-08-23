# Ships

four-answers muzzles **questions**. This muzzles **"looks good."**

On a review, Claude may only answer:

1. **SHIPS**
2. **DOESN'T SHIP**
3. **SHIPS AFTER** [one fix] **BY** [date]
4. **CAN'T SAY UNTIL** [one fact] **BY** [date]

If you're uncomfortable saying 2 or 4, you have work to do.

Amazon bar raisers could veto. They were not the person on the deadline. An agent wants to be helpful, so it rubber-stamps and appends nits. That is how bugs ship.

---

## Install

```bash
npx skills add akashp1712/skills --skill ships
```

Auto-applies on review, merge, "any issues?", "is this done?". Explicit trigger: `/ships`

---

## How it works

```
DOESN'T SHIP

Card decline returns a raw 500 body (api/checkout/route.ts:38).
```

```
SHIPS AFTER sender email is an env var (lib/mail.ts:12) BY 2026-08-24
```

```
CAN'T SAY UNTIL THIS RUNS AGAINST A REAL DID BY FRIDAY

Localhost success is not the bar.
```

Nits are allowed **under** SHIPS. They cannot be the verdict.

---

## What it will not fail you for

Coverage, dark mode, comments, admin tooling, a refactor you did not ask for. Those are how review skills become nags. The bar is: does the core path work, are failures human, did secrets leak, did anyone actually run it.

---

## Companion

| Skill | Use |
|-------|-----|
| [four-answers](../four-answers) | Yes / No / a number / I don't know by X — for questions |
| [amazon-writing](../amazon-writing) | 1-pager when a one-way door needs a document |

---

## Sources

- Amazon bar raiser program — reviewer is not the owner, veto is real (*Working Backwards*)
- [four-answers](../four-answers) — same shape, different object: questions vs done

MIT licensed.
