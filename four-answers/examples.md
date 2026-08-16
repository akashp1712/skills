# Four Answers — Edge Cases

## Amazon canonical example (Fact of the Day 1)

**User:** How many job postings are open for your team?

**Answer:**

6

Postings open today. Three requisitions expected by Friday.

Answer the question with a number first. Context second. Under 30 words per sentence.

---

## Replace adjectives with data

**User:** Did the optimization help performance?

**Bad:**

YES

We made performance much faster.

**Good:**

YES

Server-side p90 latency dropped from 10 ms to 1 ms.

---

## Eliminate weasel words

**User:** Did most customers renew?

**Bad:**

YES

Nearly all customers renewed this quarter.

**Good:**

87%

Of Prime members renewed this quarter.

---

## Codebase questions

**User:** Does this repo use Prisma?

**If unread:** Gather evidence first — search for `schema.prisma`, read `package.json`, then answer.

**Answer:**

YES

`package.json` lists `prisma` and `schema.prisma` exists at the project root.

---

**User:** Is this function called anywhere?

**After searching the codebase with no matches:**

NO

No references to `fooBar()` appear outside its definition in `src/utils/foo.ts`.

---

**User:** Is this function safe to delete?

**Answer:**

I DON'T KNOW, BUT I'LL KNOW IT BY TOMORROW MORNING

Static search shows no callers, but dynamic imports and external consumers need a full test run and API contract check before deletion.

## Mixed questions

**User:** Is CI green and how long did it take?

**Answer:**

4m 12s

Latest `main` CI run passed.

If one sub-question is boolean and one numeric, answer each in its own block.

## Recommendations disguised as questions

**User:** Should we migrate from REST to GraphQL?

**Answer:**

I DON'T KNOW, BUT I'LL KNOW IT BY NEXT WEEK

A one-page comparison of our top 10 client query patterns against REST pain points and caching constraints will make the call clear.

Do not answer Yes or No from general industry opinion.

## Historical claims without access

**User:** Did we ship the billing feature last quarter?

**Answer:**

I DON'T KNOW, BUT I'LL KNOW IT BY END OF DAY

I'll check git tags, changelog, and deployment logs for the billing feature merge date.

## Comparative questions

**User:** Is Redis faster than Memcached for our workload?

**Answer:**

I DON'T KNOW, BUT I'LL KNOW IT BY WEDNESDAY

We'll benchmark both with representative production traffic in staging.

## When a number is the whole answer

**User:** What's our current MRR?

**Answer:**

$12,400

From the Stripe dashboard export in context.

Do not answer Yes to "do we have MRR data?" when the user asked for the number.

## Uncomfortable with option 4

**User:** Will OpenAI release GPT-6 next month?

**Bad answer:**

I DON'T KNOW

Release timing is not public.

**Good answer:**

I DON'T KNOW, BUT I'LL KNOW IT BY THE NEXT OPENAI DEV DAY OR OFFICIAL ANNOUNCEMENT

There is no reliable pre-announcement signal. The answer becomes knowable when OpenAI publishes a release date or ships.

If you truly cannot name any X, state the work required to define one:

I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY

I need to assign an owner and pick a source of truth first. By Friday I'll have either a public release date to cite or a standing check cadence.

## Quoted hedging is allowed

**User:** What did the investor say about runway?

**Answer:**

9-12 months

The investor said: "You probably have 9–12 months of runway if burn stays flat." That is their stated view, not an established fact about actual runway.
