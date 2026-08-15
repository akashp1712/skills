# Four Answers

Stop hedging. Every substantive answer resolves to exactly one state:

| State | When to use |
|-------|-------------|
| **YES** | Evidence supports an affirmative answer |
| **NO** | Evidence supports a negative answer |
| **DATA** | The answer is facts, numbers, specs, dates, measurements |
| **I DON'T KNOW** | Evidence is insufficient — say so plainly |

No *maybe*, *probably*, *likely*, *I think*. Pick a state.

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

Once installed, the skill **activates automatically** on factual questions, decisions, and evaluations. You do not need to invoke it every time.

Explicit trigger: `/four-answers`

---

## How it works

Claude classifies your question, gathers available evidence (files, data, docs), then responds with one state word on the first line:

```
YES

PostgreSQL has native JSON and JSONB data types.
```

The skill does **not** hijack code generation, creative writing, or step-by-step tutorials — only substantive questions where uncertainty would otherwise produce speculation.

---

## Examples

### YES — evidence supports yes

**Does PostgreSQL support JSON?**

```
YES

PostgreSQL has native JSON and JSONB data types.
```

**Is TypeScript a superset of JavaScript?**

```
YES

TypeScript adds static types and compiles to JavaScript; valid JS is valid TS (with `strict` exceptions for edge cases).
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

### NO — evidence supports no

**Does SQLite support stored procedures?**

```
NO

SQLite does not implement stored procedures.
```

**Is `user.email` validated before save in this form?**

```
NO

`SignupForm.tsx` submits directly to the API with no client-side or schema validation on `email`.
```

**Are we SOC 2 certified?**

```
NO

No SOC 2 report or certification is referenced in compliance docs or vendor questionnaires in this repo.
```

**Did the deploy succeed?**

```
NO

The latest GitHub Actions run on `main` failed at the `test` step with 3 failing specs.
```

---

### DATA — facts, numbers, specs

**How many customers do we have?**

```
DATA

You currently have 37 customers.
```

**What's our API rate limit?**

```
DATA

The rate limit is 1,000 requests per minute per API key (`RATE_LIMIT_MAX` in `src/config.ts`).
```

**When was the last release?**

```
DATA

The last release tag is `v2.4.1`, pushed on 2026-03-08.
```

**What frameworks does this repo use?**

```
DATA

Next.js 15, React 19, Prisma, Tailwind CSS, and Clerk.
```

**What's 15% of $48,000?**

```
DATA

15% of $48,000 is $7,200.
```

**List the failing tests.**

```
DATA

Three tests failed: `auth.test.ts` (session expiry), `billing.test.ts` (proration), `api.test.ts` (rate limit header).
```

---

### I DON'T KNOW — insufficient evidence

**Will my SaaS get 1,000 customers?**

```
I DON'T KNOW

There is insufficient evidence to predict that outcome. Useful next evidence: conversion rate, acquisition rate, retention, and willingness-to-pay from real customers.
```

**Should I launch this feature?**

```
I DON'T KNOW

The answer depends on whether the feature solves a painful enough problem for paying users. Test with existing users before a full build.
```

**Will we hit $1M ARR this year?**

```
I DON'T KNOW

ARR trajectory requires current MRR, growth rate, churn, and pipeline data not present in this conversation.
```

**Is Redis faster than Memcached for our workload?**

```
I DON'T KNOW

That depends on value size, eviction pattern, and read/write ratio. Benchmark both with representative production traffic.
```

**Should we migrate from REST to GraphQL?**

```
I DON'T KNOW

The right call depends on client query complexity, caching needs, and team expertise — not general industry preference.
```

**Will OpenAI release GPT-6 next month?**

```
I DON'T KNOW

Release timing for unreleased models is not publicly established.
```

---

## Edge cases

### Codebase questions (gather evidence first)

**Is this function used anywhere?** — search the repo before answering.

```
NO

No references to `legacyParser()` appear outside its definition in `src/legacy/parser.ts`.
```

**Is it safe to delete this file?**

```
I DON'T KNOW

No static callers were found, but dynamic imports, reflection, or external consumers cannot be ruled out without running the full test suite and checking API contracts.
```

### Mixed questions

**Is CI green and how long did it take?**

```
DATA

The latest `main` CI run passed in 4m 12s.
```

### Quoting others (hedging allowed in quotes only)

**What did the investor say about runway?**

```
DATA

The investor said: "You probably have 9–12 months of runway if burn stays flat." That is their stated view, not an established fact about actual runway.
```

### Multiple questions

Answer each with its own block:

```
YES

PostgreSQL supports JSON natively.

I DON'T KNOW

Customer count cannot be determined without access to your billing or analytics system.
```

---

## What this skill does NOT do

| Request | Behavior |
|---------|----------|
| "Write a React component for a login form" | Normal implementation — no state label |
| "Brainstorm 10 startup ideas" | Normal brainstorming |
| "Refactor this function" | Normal refactor |
| "Is this function buggy?" | **Four Answers applies** → YES/NO/DATA/I DON'T KNOW |
| "How many users signed up today?" | **Four Answers applies** → DATA or I DON'T KNOW |

---

## Anti-hedging word list

These words must not replace a committed state in **your** conclusion:

`maybe` · `perhaps` · `probably` · `likely` · `unlikely` · `potentially` · `could` · `might` · `seems` · `appears` · `I think` · `I believe` · `arguably` · `generally` · `usually`

---

## Validate output (optional)

```bash
python3 scripts/validate.py <<'EOF'
YES

PostgreSQL has native JSON support.
EOF
# → OK
```

---

## License

MIT — use freely in personal and commercial projects.
