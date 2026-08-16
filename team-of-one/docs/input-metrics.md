# Input metrics — measure what you can actually move

> "Amazon takes this philosophy to heart, focusing most of its effort on leading indicators (we call these 'controllable input metrics') rather than lagging indicators ('output metrics')… Output metrics — things like orders, revenue, and profit — are important, but they generally can't be directly manipulated in a sustainable manner over the long term. Input metrics measure things that, done right, bring about the desired results in your output metrics."
> — *Working Backwards*, ch. 6, "Metrics: Manage Your Inputs, Not Your Outputs"

Colin Bryar puts the operator version plainly: "To be a good operator, you can't just focus on those output metrics — you need to identify the controllable input metrics… If you do the things you have control over right, it's going to yield the desired result in your output metrics."

Solo builders do the reverse almost universally. They check revenue, signups, stars, and followers — none of which they can act on directly — and then feel bad and open the analytics tab again.

**Checking an output metric is not work. It produces no decision and it costs morale.**

---

## Inputs versus outputs

An input metric passes two tests: **you can change it this week by doing something specific**, and **changing it plausibly moves an output**.

| Output (lagging, cannot move directly) | Controllable input |
|---------------------------------------|--------------------|
| MRR | Sales conversations held |
| Signups | Landing pages shipped for specific search intents |
| Churn | Onboarding sessions where the user reached first value |
| Traffic | Answers published to questions people actually asked |
| Stars, followers | Times you shipped something someone asked for |
| "Product-market fit" | Users who returned unprompted in week two |

Outputs still get recorded. You just do not *manage* to them — you confirm against them monthly.

---

## Getting the input right is iterative

This is the part most people skip, and *Working Backwards* is emphatic about it. Amazon's early selection metric was **number of detail pages**, which the team gamed without meaning to — adding obscure items nobody wanted. It became **number of detail pages ready for two-day shipping**, and eventually evolved further toward what customers actually demanded.

> "With the wrong input metrics or an input metric that is too crude, your efforts may not be rewarded with an improvement in your output metrics. The right input metrics get the entire organization focused on the things that matter most. Finding exactly the right one is an iterative process that needs to happen with every input metric."

The solo equivalents of "number of pages" are everywhere and they feel productive:

| Crude input | Refined input |
|-------------|---------------|
| Blog posts published | Posts answering a question a real user asked |
| Features shipped | Features a user requested and then used |
| Cold emails sent | Replies from people in the actual target segment |
| Commits | Sessions ending with something deployed |

**Test:** if you could hit the number without helping anyone, the metric is too crude. Rewrite it.

Expect to revise each input two or three times before it is honest. That revision is the mechanism working, not a sign you chose wrong.

---

## Pick three

At solo scale, three input metrics is the ceiling. More than that and none of them drive behaviour.

Choose them by walking backwards from your one output: what has to happen for that number to move, that you control?

```markdown
# Metrics

Output (confirm monthly, do not manage to): paying customers. Now: 4.

## Inputs (weekly)
1. Conversations with people in the target segment — target 3/wk
2. Sessions ending in a deploy — target 2/wk
3. Users reaching first value in onboarding — target 2/wk

Reviewed Fridays, 15 minutes. Report variance only.
```

---

## The weekly review

Amazon's WBR is deliberately **tactical**, and the guidance is to focus on variances and not waste time on the expected. Strategy is explicitly out of scope. Copy both constraints — they are what keep it to fifteen minutes.

```
WEEKLY REVIEW · week of 2026-08-11

Inputs
  Target-segment conversations     3 / 3   ✓
  Sessions ending in a deploy      1 / 2   ▼ short
  Users reaching first value       0 / 2   ▼ short, second week

Output (confirm only)
  Paying customers                 4       no change

Variances worth discussing
- First value at zero for two weeks. Both signups stalled at the API-key
  step. This is the constraint; everything else is noise this week.

Action
- Next thread: remove the API-key step from onboarding entirely.

Mechanism change
- None. Existing mechanisms worked; the metric did its job by surfacing this.
```

**Report variance only.** A metric that hit its target needs no discussion. The whole value is in the two lines that did not.

Note what the review produced: one specific next thread, chosen by evidence rather than by what felt appealing on Monday. That is the entire point of the mechanism.

---

## Anecdotes beat averages at your scale

> "They study and understand many anecdotes rather than only the averages you'll find on surveys… A remarkable customer experience starts with heart, intuition, curiosity, play, guts, taste. You won't find any of it in a survey."
> — Bezos, 2016 letter, on resisting proxies

This matters more for you than it did for Amazon. With twelve customers, an average is statistically meaningless and a single conversation is high-signal. Solo builders build dashboards for datasets small enough to read individually.

So: **read the rows, not the aggregate.** When the input is "conversations with the target segment," the metric is a count, but the value is in what the four people actually said. The count keeps you honest about doing it. The transcripts are the finding.

Anything a customer said that surprised you goes in `LEARNINGS.md`.

---

## When the agent runs this

1. **Refuse to optimize an output metric.** If asked how to increase MRR, convert to inputs first.
2. **Test every proposed input** against both criteria: controllable this week, plausibly drives the output.
3. **Challenge crude inputs.** Ask whether the user could hit the number without helping anyone.
4. **Report variance only.** Do not narrate metrics that hit target.
5. **State the number, then the constraint.** One binding constraint, not a list of five things that could improve.
6. **Write to `METRICS.md`** and end with one next thread.

---

## Anti-patterns

**Daily output checking.** With four customers, daily revenue is pure noise. It cannot inform a decision and it reliably costs morale.

**More than three inputs.** Everything becomes background.

**Vanity inputs.** Commits, hours worked, tasks closed. All controllable, none connected to any output.

**Never revising a metric.** If an input has been green for six weeks while the output has not moved, the input is wrong. That is the finding.

**Dashboards.** At this scale, a text file you write by hand beats a dashboard you glance at, because writing it forces you to notice.

**Turning the review into strategy.** Fifteen minutes, tactical, variances only. Strategy is a different session.
