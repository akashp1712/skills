# Four Answers

Jeff Bezos famously allowed only **four answers** to a question at Amazon:

1. **Yes**
2. **No**
3. **A number**
4. **I don't know, but I'll know it by X**

If you're uncomfortable saying option 4, you've got work to do.

This Claude skill enforces the same discipline. No *maybe*, *probably*, *likely*, *I think*. Pick one of the four.

---

## Install

```bash
npx skills add akashp1712/skills --skill four-answers
```

Or via marketplace:

```bash
/plugin marketplace add akashp1712/claude-marketplace
/plugin install four-answers
```

Once installed, the skill **activates automatically** on factual questions, decisions, and evaluations.

Explicit trigger: `/four-answers`

---

## How it works

Claude classifies your question, gathers available evidence, then responds in one of four forms:

```
YES

PostgreSQL has native JSON and JSONB data types.
```

```
37

Active customers in the Stripe export.
```

```
I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY

We'll have conversion and retention numbers after this week's cohort review.
```

The skill does **not** hijack code generation, creative writing, or step-by-step tutorials.

---

## Origin

Bezos banned PowerPoint at Amazon because slides let people gloss over ideas without committing to what's true.

The same discipline applies to answers:

- Don't hide behind hedging words when you mean **No**
- Don't guess when you mean **I don't know, but I'll know it by X**
- Give the **number** when you have it
- Say **Yes** only when evidence supports it

Bezos's 2004 memo: [Why Amazon banned PowerPoint](https://www.businessinsider.com/jeff-bezos-email-against-powerpoint-presentations-2015-7)

---

## Examples

### Yes

**Does PostgreSQL support JSON?**

```
YES

PostgreSQL has native JSON and JSONB data types.
```

**Does our app use Clerk for auth?**

```
YES

`package.json` lists `@clerk/nextjs` and `middleware.ts` imports `clerkMiddleware`.
```

**Can I run this migration without downtime?**

```
YES

The migration only adds a nullable column with no backfill required.
```

---

### No

**Does SQLite support stored procedures?**

```
NO

SQLite does not implement stored procedures.
```

**Is `user.email` validated before save?**

```
NO

`SignupForm.tsx` submits to the API with no validation on `email`.
```

**Did the deploy succeed?**

```
NO

The latest GitHub Actions run on `main` failed at the `test` step.
```

---

### A number

**How many customers do we have?**

```
37

Active customers in the billing export.
```

**What's our API rate limit?**

```
1,000/min

Per API key (`RATE_LIMIT_MAX` in `src/config.ts`).
```

**What's our current MRR?**

```
$12,400

From the Stripe dashboard export in context.
```

**What's 15% of $48,000?**

```
$7,200
```

**When was the last release?**

```
2026-03-08

Last release tag: `v2.4.1`.
```

**How many frameworks does this repo use?**

```
5

Next.js, React, Prisma, Tailwind CSS, Clerk.
```

**How long did CI take?**

```
4m 12s

Latest `main` run passed.
```

---

### I don't know, but I'll know it by X

Bare "I don't know" is not allowed. Commit to when you'll know.

**Will my SaaS get 1,000 customers?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY THE END OF THIS QUARTER

We need 8 more weeks of conversion, retention, and willingness-to-pay data from paying customers.
```

**Should I launch this feature?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY NEXT FRIDAY

Five user interviews with existing customers will show whether the problem is painful enough to ship.
```

**Will we hit $1M ARR this year?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY THE Q2 BOARD DECK

That deck will include current MRR, growth rate, churn, and pipeline — the inputs required to project ARR.
```

**Is Redis faster than Memcached for our workload?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY WEDNESDAY

We'll run both benchmarks with representative production traffic in staging.
```

**Is it safe to delete this file?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY TOMORROW MORNING

After the full test suite runs and we confirm no external API consumers depend on it.
```

**Did we ship billing last quarter?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY END OF DAY

I'll check git tags, the changelog, and deployment logs for the billing feature merge date.
```

---

## Edge cases

### Uncomfortable with option 4?

That's the point. If you can't name when you'll know, you have work to do:

- Who owns finding the answer?
- What experiment or artifact produces it?
- What date does that land?

Don't answer until X is real.

### Codebase questions — gather evidence first

**Is this function used anywhere?**

```
NO

No references to `legacyParser()` outside `src/legacy/parser.ts`.
```

### Multiple questions

```
YES

PostgreSQL supports JSON natively.

I DON'T KNOW, BUT I'LL KNOW IT BY MONDAY

Customer count requires billing access we don't have in this session.
```

### Quoting others (hedging allowed in quotes only)

**What did the investor say about runway?**

```
9-12 months

The investor's words: "You probably have 9–12 months of runway if burn stays flat." That is their view, not an established fact.
```

---

## What this skill does NOT do

| Request | Behavior |
|---------|----------|
| "Write a React login form" | Normal implementation |
| "Brainstorm 10 startup ideas" | Normal brainstorming |
| "Is this function buggy?" | **Four Answers applies** |
| "How many users signed up today?" | **A number** or **I don't know by X** |

---

## Anti-hedging word list

These must not replace a committed answer:

`maybe` · `perhaps` · `probably` · `likely` · `unlikely` · `potentially` · `could` · `might` · `seems` · `appears` · `I think` · `I believe` · `arguably` · `generally` · `usually`

---

## Validate output (optional)

```bash
python3 scripts/validate.py <<'EOF'
37

Active customers.
EOF

python3 scripts/validate.py <<'EOF'
I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY

After the cohort review.
EOF
```

---

## License

MIT — use freely in personal and commercial projects.
