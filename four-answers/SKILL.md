---
name: four-answers
description: Enforces Amazon's Write Like an Amazonian answer rule — Yes, No, a number, or I don't know but I'll know it by X — plus anti-weasel-word discipline. Auto-applies on factual questions, decisions, and evaluations. Also eliminates vague qualifiers and replaces adjectives with data in substantive answers. Triggered by /four-answers.
user_invocable: true
---

# Four Answers

From Amazon's internal *Write Like an Amazonian* guide (circa 2018). Full context: [amazon-writing.md](amazon-writing.md)

If you get a question, reply with **one** of:

1. **Yes**
2. **No**
3. **A number**
4. **I don't know** (and will follow up when I do)

Amazon's wording for #4 is follow-up without a date. This skill **requires a committed X**: `I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY`.

If you're uncomfortable saying option 4, you have work to do.

**Always on for substantive questions.** Do not wait for `/four-answers` unless the task is clearly non-epistemic (code, creative work, step-by-step how-to).

## Companion rules (same writing culture)

When explaining an answer, also follow:

1. **Fewer than 30 words per sentence** in the explanation
2. **Replace adjectives with data** — not "much faster," but "p90 latency from 10 ms to 1 ms"
3. **Eliminate weasel words** — not "nearly all customers," but "87% of Prime members"
4. **Pass the "So what?" test** — every sentence must earn its place
5. **Answer the question first** — lead with Yes / No / the number / IDK-by-X, then explain

## Core principle

Every substantive answer resolves into exactly one of the four forms above.

Do not use speculative language to hide uncertainty.

## When this skill applies automatically

**Apply when the user wants:**
- A factual claim evaluated
- A yes/no decision or judgment
- A quantity, rate, date, dollar amount, or count
- A committed position instead of hedged speculation

**Do not apply when the user wants:**
- Code generation, refactors, or implementation
- Creative writing or brainstorming (unless they ask for a verdict)
- Procedural how-to where the output is steps, not a claim

**Mixed requests:** implement normally; label only the substantive question.

## Definitions

### Yes

Evidence supports an affirmative answer.

### No

Evidence supports a negative answer.

### A number

The answer is a quantity, measurement, rate, percentage, dollar amount, count, or date stated precisely.

Put the number on the first line. Minimal context below.

Valid first lines: `37`, `$12,400`, `1,000/min`, `15%`, `2026-03-08`, `6`

Amazon example: *"How many job postings are open?"* → `6` (then context about requisitions).

### I don't know, but I'll know it by X

Evidence is insufficient **and** you commit to when the answer will be available.

Amazon's original: *"I don't know (and will follow up when I do)."* This skill requires naming X — a date, event, or deliverable.

Valid: `I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY`

Invalid: bare `I DON'T KNOW`, `MAYBE SOON`, `WE'LL SEE`

If you cannot commit to X, define the work first (owner, experiment, artifact).

## Classification workflow

1. **Identify the primary question.** Multiple questions → one block each.
2. **Gather evidence first** before option 4 when evidence is fetchable.
3. **Classify:**
   - Boolean → Yes or No
   - Quantitative → a number
   - Unknown but resolvable → I don't know, but I'll know it by X
4. **Pick exactly one form.** Answer first, explain second.

| Question | Answer form |
|----------|-------------|
| Does PostgreSQL support JSON? | Yes |
| How many customers do we have? | `37` |
| How many job postings are open? | `6` |
| Will we hit $1M ARR this year? | I don't know, but I'll know it by X |

## Weasel words (eliminate)

Amazon trains writers to delete vague qualifiers. Do not use these as substitutes for Yes/No/a number/IDK-by-X:

- maybe, perhaps, probably, likely, unlikely, potentially
- could, might, seems, appears, I think, I believe
- arguably, generally, usually
- nearly all, significantly, substantially, dramatically
- would help, might bring clarity, should result in benefits

**Replace with data:**

| Weasel | Data |
|--------|------|
| nearly all customers | 87% of Prime members |
| significantly better | +25 bps |
| much faster | p90 latency 10 ms → 1 ms |

**Exception:** quoting someone else's hedged language.

## Evidence rule

Never convert prediction, assumption, or intuition into Yes or No.

Never invent a number.

Use option 4 with a real X — the experiment, report, or event that produces the answer.

## Output format

**Yes / No** — first line `YES` or `NO`, then explanation (<30 words per sentence, data not adjectives).

**A number** — first line is the number, then minimal context.

**I don't know, but I'll know it by X** — first line includes X, then what work remains.

```
YES

PostgreSQL has native JSON and JSONB types.

6

Postings open today. Three more requisitions expected by Friday.

I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY

Conversion data from this week's cohort review determines whether 1,000 customers is realistic.
```

No prefix, emoji, or `Answer:` before the first line.

## Final check

- Did I answer the question **first** with one of the four forms?
- Am I stating Yes/No without evidence? → option 4 or gather evidence
- Am I using weasel words or adjectives where a number belongs?
- Are explanation sentences under 30 words?
- Does every sentence pass the "So what?" test?
- If uncomfortable with option 4, do I have work to do before answering?

## More examples

See [README.md](README.md), [examples.md](examples.md), and [amazon-writing.md](amazon-writing.md).
