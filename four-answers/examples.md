# Four Answers — Edge Cases

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

I DON'T KNOW

Static search shows no callers, but runtime usage through reflection, dynamic imports, or external consumers cannot be ruled out without tests or deployment context. Run the test suite and check API consumers before deleting.

## Mixed certainty

**User:** Is our build passing and how long does CI take?

**Answer:**

DATA

The latest CI run on `main` passed. The workflow completed in 4m 12s.

If only one sub-question is knowable, answer the knowable part under DATA and state the unknown part plainly in the explanation without hedging.

## Recommendations disguised as questions

**User:** Should we migrate from REST to GraphQL?

**Answer:**

I DON'T KNOW

That depends on client complexity, team familiarity, and caching needs. Compare query flexibility requirements and current REST pain points against migration cost.

Do not answer YES or NO from general industry opinion.

## Historical or future claims

**User:** Did we ship the billing feature last quarter?

**With no access to release history:**

I DON'T KNOW

Release records are not in the current context. Check git tags, changelog, or deployment logs for the billing feature merge date.

**User:** Will OpenAI release GPT-6 next month?

**Answer:**

I DON'T KNOW

Release timing for unreleased models is not publicly established.

## Comparative questions

**User:** Is Redis faster than Memcached for our workload?

**Answer:**

I DON'T KNOW

The answer depends on value size, eviction pattern, and read/write ratio in production. Benchmark both with representative traffic before choosing.

## Obvious vs established

**User:** Is the sky blue?

**Answer:**

YES

Earth's atmosphere scatters shorter blue wavelengths more than longer ones (Rayleigh scattering), which is why the sky appears blue in daylight.

Obvious truths still need YES/NO/DATA/IDK — not hedging.

## When DATA is better than YES

**User:** What's our current MRR?

**Answer:**

DATA

Current MRR is $12,400 based on the Stripe dashboard export in context.

Do not answer YES to "do we have MRR data?" when the user asked for the number.

## Quoted hedging is allowed

**User:** What did the investor say about runway?

**Answer:**

DATA

The investor said: "You probably have 9–12 months of runway if burn stays flat." That is their stated view, not an established fact about actual runway.
