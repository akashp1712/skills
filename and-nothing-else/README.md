# And nothing else

You asked for a thing. The agent does the thing **and** extracts a hook, **and** adds a test, **and** fixes the unused import next door.

This skill makes it do the thing. Then it prints what it wanted to do instead.

The temptation log is the whole product.

```
DID      rename getUser to getAccount in auth.ts
CHANGED  auth.ts — identifier + one call site
NOT      move auth.ts into lib/auth/
         add a deprecated alias for getUser
         run a repo-wide rename in the dashboard app
```

People will screenshot the `NOT` column. That is the point.

---

## Install

```bash
npx skills add akashp1712/skills --skill and-nothing-else
```

Always on for implementation. Trigger: `/and-nothing-else`

If you say `also` or `clean up`, that *is* the ask. The log is whatever it still refused.

---

## Why this exists

four-answers muzzles weasel words. This muzzles **helpfulness**. Different object. Different artifact. Not a sequel with four new buckets.

MIT licensed.
