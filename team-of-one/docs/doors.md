# Doors — matching deliberation to reversibility

From Bezos's 1997 shareholder letter: some decisions are **one-way doors** — consequential and effectively irreversible, so they deserve slow, deliberate, written thought. Most decisions are **two-way doors** — you walk through, and if it is wrong, you walk back.

The Amazon observation is that large organizations apply the one-way process to everything, and grind to a halt.

**Solo builders fail the opposite way, and asymmetrically:**

- Three weeks choosing a framework — a two-way door at zero users
- Ten minutes publishing pricing to a live site — a genuine one-way door

Both errors are expensive and neither feels like an error at the time. Agonizing feels like diligence. Announcing feels like momentum.

---

## Classify first

One question: **what does it cost to undo this, and who sees the undo?**

If you cannot name a concrete cost, it is a two-way door. Go. Now, not after more research.

### Two-way doors (almost everything)

Framework, language, hosting, styling, schema shape, folder structure, component library, most features, copy, colors, page layout, internal tooling, most refactors, which AI model, whether to add a field.

At zero users, even things that feel structural are reversible. A database migration with no customers in it is a `DROP TABLE`. Treat the whole pre-traction period as a building full of two-way doors, because it very nearly is.

**Budget: ten minutes. Decide alone. Log one line. Move.**

If you have spent thirty minutes on a two-way door, the deliberation now costs more than the wrong choice would. Pick the one you can undo most easily and go.

### One-way doors (rare, and specific)

These share a property: **someone outside your head has now seen it**, and un-seeing has a cost.

| Decision | Undo cost |
|----------|-----------|
| Publishing pricing | Raising later reads as a bait-and-switch to everyone who saw the old number |
| Domain and brand name | SEO, links, every mention, every install command already in the wild |
| Taking money from a first customer | You now have an obligation, a refund path, and possibly a tax event |
| Publishing an API contract or install command | Every consumer breaks; you own a migration forever |
| Public launch announcement | You get one launch; a retracted one is worse than none |
| Deleting customer data | Not reversible in any sense |
| Legal entity, cofounder, equity | Expensive, slow, relationship-damaging to unwind |
| Open-source license choice | Changing it later requires every contributor's consent |

**Budget: write it down, sleep on it, then decide.** Use a [1-pager](../../amazon-writing/docs/1-pager.md) and name the undo cost explicitly. If a 1-pager feels like too much ceremony for the decision, that is real evidence it might be a two-way door after all — check the classification again.

---

## The public/private line

The most reliable heuristic for a solo builder: **has anyone outside your head seen it?**

Unpublished code is a two-way door regardless of how much of it there is. A tweet is a one-way door regardless of how short it was.

This is why solo builders get the classification backwards. They spend their deliberation on the thing with the most *effort* attached, when reversibility does not track effort at all — it tracks exposure. Rewriting a month of code is annoying and completely reversible. Announcing a launch date takes nine seconds and cannot be taken back.

---

## Log it

Append to `.mechanisms/DECISIONS.md`. Never edit or delete an entry; supersede it with a new one.

```markdown
## 2026-08-16 · Twilio over Vonage
Type: two-way · Deliberated: 15 min

AU local number availability, and I have used the API before.

Undo cost: ~1 day to swap `lib/sms.ts` and the webhook handler. Contained.

Ruled out: Vonage (AU numbers unclear), MessageBird (pricing opaque),
building on raw SIP (not my problem to solve).

---

## 2026-08-14 · Public pricing at $49/mo AUD
Type: ONE-WAY · Deliberated: 2 days, 1-pager, slept on it

Three plumbers said $49 was "fine," one said "cheap." Nobody said expensive.

Undo cost: cannot raise without emailing everyone who saw it. Can discount
freely, since discounting down is always available.

Ruled out: $29 (leaves money on the table, and cheap reads as unserious in
trades), usage-based (plumbers said they hate variable bills — this was the
strongest signal in all four calls).
```

The **ruled out** lines are the highest-value part of the file. They are what stops you from re-opening a closed decision in six weeks, which is the most common way a part-time builder's session evaporates. It looks like thinking. It is re-thinking.

---

## When the agent runs this

1. **Classify out loud and commit.** "This is a two-way door" or "this is a one-way door," never "it depends."
2. **State the undo cost concretely.** If you cannot, say so — that is itself the answer, and it means two-way.
3. **For two-way doors: recommend one option and stop.** Do not produce a comparison matrix. A matrix is how ten minutes becomes an afternoon. Give the pick and the reason in two sentences.
4. **For one-way doors: refuse to answer immediately.** Ask for the 1-pager. The value here is the delay, not the analysis.
5. **Write the entry to `DECISIONS.md`**, including ruled-out options.

The most useful thing the agent does here is **push back on over-deliberation**. When a user asks for a deep comparison of two reversible options, the correct response is to name the door type and refuse the depth they asked for.

---

## Anti-patterns

**"It's a two-way door" as an excuse to stop thinking.** The mechanism sets a deliberation budget of ten minutes. It does not set it to zero, and it does not apply to doors that are actually one-way.

**Reversible in theory, one-way in practice.** A migration is technically undoable and practically permanent once real customer data is in it. Classify by what you would actually do, not what is theoretically possible.

**Treating irreversible-but-cheap as one-way.** Buying a $12 domain you never use is irreversible and costs $12. Reversibility only matters when the undo cost is real.

**Not logging two-way doors because they are small.** Small closed decisions are exactly the ones you will re-open, because you will not remember deciding them. One line is enough.
