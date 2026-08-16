# Four Answers — Reddit Launch Kit

GitHub: https://github.com/akashp1712/skills/tree/main/four-answers

Install: `npx skills add akashp1712/skills --skill four-answers`

---

## Where to post

**Post here (in this order):**

1. r/ClaudeAI — https://reddit.com/r/ClaudeAI — start here
2. r/ClaudeCode — https://reddit.com/r/ClaudeCode — 2-3 days later
3. r/Entrepreneur OR r/startups — 2-3 days later (pick one)
4. r/productivity — optional

**Skip:** r/Amazon, r/ChatGPT, r/MachineLearning

**Schedule:** Don't cross-post same day. Reply to comments fast.

---

# POST 1 — r/ClaudeAI & r/ClaudeCode

Copy everything between the lines below.

────────────────────────────────────────
TITLE
────────────────────────────────────────

I built a Claude skill that only allows 4 answers: Yes, No, a number, or "I don't know, but I'll know it by X"

────────────────────────────────────────
BODY
────────────────────────────────────────

From Amazon's internal "Write Like an Amazonian" guide (circa 2018). If you get a question, reply with one of:

1. Yes
2. No
3. A number
4. I don't know (and will follow up when I do)

This skill sharpens #4 to: I don't know, but I'll know it by X.

If you're uncomfortable saying #4, you've got work to do.

It's Rule 5 in a larger framework — also kills weasel words ("nearly all customers" → "87% of Prime members"), replaces adjectives with data, and keeps sentences under 30 words.

LLMs violate this constantly:

- "That's probably a good idea..."
- "It might work depending on..."
- "I don't know" (with no plan to find out)

So I built four-answers, a Claude skill that enforces the same discipline on substantive questions.

**How it works**

When you ask a factual question, decision, or evaluation, Claude responds in one of four forms:

**Yes**

YES

PostgreSQL has native JSON and JSONB types.

**A number**

37

Active customers in the billing export.

**I don't know, but I'll know it by X**

I DON'T KNOW, BUT I'LL KNOW IT BY FRIDAY

We'll have conversion data after this week's cohort review.

It auto-applies on decisions and factual Q&A. It stays out of the way for code generation and brainstorming.

**Install**

`npx skills add akashp1712/skills --skill four-answers`

**Links**

GitHub: https://github.com/akashp1712/skills/tree/main/four-answers

Write Like an Amazonian (Fact of the Day 1): https://www.factoftheday1.com/p/april-13-write-like-an-amazonian

Working Backwards at Amazon: https://medium.com/fact-of-the-day-1/working-backwards-at-amazon-a303c3680aa3

Bezos's 2004 memo on narrative memos: https://www.businessinsider.com/jeff-bezos-email-against-powerpoint-presentations-2015-7

The README has 30+ examples for codebase questions, MRR, feature launches, benchmarks, etc.

Would love feedback, especially edge cases where "a number" or "I'll know it by X" feels forced.

MIT licensed, open source.

────────────────────────────────────────

---

# POST 2 — r/Entrepreneur & r/startups

Copy everything between the lines below.

────────────────────────────────────────
TITLE
────────────────────────────────────────

Bezos only allowed 4 answers in meetings. I turned it into a Claude skill to kill AI hedging.

────────────────────────────────────────
BODY
────────────────────────────────────────

At Amazon, Jeff Bezos only allowed four answers to a question:

1. Yes
2. No
3. A number
4. I don't know, but I'll know it by X

If you're uncomfortable saying #4, you've got work to do.

Same problem with AI advisors: endless "probably," "maybe," and vague "it depends" instead of a committed answer or a real deadline.

I packaged the framework as a free Claude skill called four-answers:

- Yes / No when evidence supports it
- A number on line 1 when you have it ($12,400, 37, 4m 12s)
- I don't know, but I'll know it by X when you don't. Bare IDK is not allowed.

Useful for founder decisions: launch or not, metrics you don't have yet, benchmarks you haven't run.

Install: `npx skills add akashp1712/skills --skill four-answers`

https://github.com/akashp1712/skills/tree/main/four-answers

Origin story (Bezos banned PowerPoint because slides let you hide weak thinking): https://www.businessinsider.com/jeff-bezos-email-against-powerpoint-presentations-2015-7

Curious how other founders handle AI giving "confident maybe" answers on hard calls.

────────────────────────────────────────

---

# POST 3 — r/productivity

Copy everything between the lines below.

────────────────────────────────────────
TITLE
────────────────────────────────────────

A simple decision rule from Amazon that also fixes how AI answers hard questions

────────────────────────────────────────
BODY
────────────────────────────────────────

Four allowed answers to any question:

1. Yes
2. No
3. A number
4. I don't know, but I'll know it by X

That's Jeff Bezos's rule for Amazon meetings. The insight: if you can't say #4 comfortably, you haven't defined the work to get the answer.

I use the same rule with Claude via a skill that blocks hedging ("probably," "maybe," "I think") and forces one of those four responses.

Install: `npx skills add akashp1712/skills --skill four-answers`

Open source: https://github.com/akashp1712/skills/tree/main/four-answers

Works for meetings, Slack, and anywhere you'd rather have a number or a deadline than a polite non-answer.

────────────────────────────────────────

---

# COMMENT — reply in existing threads

Copy everything between the lines below.

────────────────────────────────────────

I built an open-source Claude skill for this called four-answers. It enforces Bezos's four allowed answers: Yes, No, a number, or "I don't know, but I'll know it by X." Bare IDK isn't allowed. You have to commit to when you'll know.

`npx skills add akashp1712/skills --skill four-answers`

https://github.com/akashp1712/skills/tree/main/four-answers

────────────────────────────────────────

---

# Posting checklist

- [ ] Day 1: r/ClaudeAI
- [ ] Day 3: r/ClaudeCode
- [ ] Day 6: r/Entrepreneur or r/startups
- [ ] Day 9: r/productivity (optional)
- [ ] Reply to all comments
