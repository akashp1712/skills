# Four Answers

Enforces **Rule 5** from Amazon's internal *Write Like an Amazonian* writing guide:

1. **Yes**
2. **No**
3. **A number**
4. **I don't know** (and will follow up when I do)

This skill sharpens #4 to: **I don't know, but I'll know it by X.**

If you're uncomfortable saying option 4, you have work to do.

![Write Like an Amazonian](assets/write-like-an-amazonian.png)

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

Auto-applies on factual questions, decisions, and evaluations. Explicit trigger: `/four-answers`

---

## The full Amazon writing culture

The four answers are one rule inside a larger framework. This skill applies the related rules to explanations:

| Rule | What it means |
|------|---------------|
| **<30 words per sentence** | Short, clear explanations. One idea per sentence. |
| **Replace adjectives with data** | "Much faster" → "p90 latency from 10 ms to 1 ms" |
| **Eliminate weasel words** | "Nearly all customers" → "87% of Prime members" |
| **"So what?" test** | Cut fluff. Every sentence must earn its place. |
| **Four answers** | Yes, No, a number, or I don't know (with follow-up) |

Full reference with sources: **[amazon-writing.md](amazon-writing.md)**

---

## How it works

Claude answers the question **first**, then explains:

```
6

Postings open today. Three requisitions expected by Friday.
```

```
37

Active customers in the billing export.
```

```
I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY

Cohort review delivers conversion and retention data.
```

Does not hijack code generation, creative writing, or tutorials.

---

## Origin & sources

### Write Like an Amazonian (2018)

Amazon's internal writing guide, widely circulated. Rule 5 is the four answers. Rules 1–4 cover sentence length, data over adjectives, weasel words, and the "So what?" test.

- [Fact of the Day 1 — Write Like an Amazonian](https://www.factoftheday1.com/p/april-13-write-like-an-amazonian)
- [amazon-writing.md](amazon-writing.md) in this repo

### Narrative memos (2004)

Bezos banned PowerPoint because slides let people gloss over ideas without committing to what's true.

- [Bezos's 2004 memo](https://www.businessinsider.com/jeff-bezos-email-against-powerpoint-presentations-2015-7)

### Working Backwards

Amazon's product process starts with five questions — including *"How do you know what customers want? Challenge yourself to use data."* The four answers are how you respond when asked; Working Backwards is how you decide what to build.

- [Working Backwards at Amazon — Danny Sheridan](https://medium.com/fact-of-the-day-1/working-backwards-at-amazon-a303c3680aa3)
- Source: *Working Backwards* (Bryar & Carr, 2019)

---

## Examples

### Yes

**Does PostgreSQL support JSON?**

```
YES

PostgreSQL has native JSON and JSONB types.
```

**Does our app use Clerk for auth?**

```
YES

package.json lists @clerk/nextjs. middleware.ts imports clerkMiddleware.
```

---

### No

**Does SQLite support stored procedures?**

```
NO

SQLite does not implement stored procedures.
```

**Did the deploy succeed?**

```
NO

Latest main CI run failed at the test step.
```

---

### A number

**How many job postings are open?** *(Amazon canonical example)*

```
6

Postings open today. Three requisitions expected by Friday.
```

**How many customers do we have?**

```
37

Active customers in the billing export.
```

**What's our current MRR?**

```
$12,400

From the Stripe dashboard export.
```

**Replace adjectives with data:**

Bad explanation: *"Performance is much faster."*

```
10 ms → 1 ms

Server-side p90 latency after the optimization.
```

---

### I don't know, but I'll know it by X

Bare "I don't know" is not allowed.

**Will my SaaS get 1,000 customers?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY END OF QUARTER

Eight more weeks of conversion and retention data from paying customers.
```

**Should I launch this feature?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY NEXT FRIDAY

Five user interviews will show if the problem is painful enough to ship.
```

**Is Redis faster than Memcached for our workload?**

```
I DON'T KNOW, BUT I'LL KNOW IT BY WEDNESDAY

Benchmark both with representative production traffic in staging.
```

---

## Weasel words → data

| Don't say | Say instead |
|-----------|-------------|
| nearly all customers | 87% of Prime members |
| significantly better | +25 bps |
| much faster | p90 latency 10 ms → 1 ms |
| arguably the best | *(specific metric or delete)* |

---

## What this skill does NOT do

| Request | Behavior |
|---------|----------|
| Write a React login form | Normal implementation |
| Brainstorm startup ideas | Normal brainstorming |
| Is this function buggy? | **Four Answers applies** |
| How many users signed up today? | **A number** or **IDK by X** |

---

## Validate output (optional)

```bash
python3 scripts/validate.py <<'EOF'
6

Postings open today.
EOF
```

---

## License

MIT
