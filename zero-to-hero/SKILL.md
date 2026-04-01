---
name: zero-to-hero
description: Generate a zero-to-hero markdown learning guide for any topic, with progressive chapters, ASCII art header, ASCII diagrams, sequence diagrams, analogies, and code examples. Use when the user asks to create a guide, tutorial, or learning doc on a topic. Supports pace (slow/normal/fast), depth (basic/advanced), and --analogy (with or without a value) to control the master analogy thread.
user_invocable: true
---

# zero-to-hero

Generate a comprehensive, progressively structured learning guide as a `.md` file.

## Usage

```
/zero-to-hero <topic> [options]
```

Options the user may provide (all optional):
- `--pace slow|normal|fast` — how much hand-holding and repetition (default: normal)
- `--depth basic|advanced` — how deep to go into internals/expert patterns (default: normal, between basic and advanced)
- `--output <path>` — where to save the file (default: `<cwd>/<topic-slug>.md`)
- `--context <extra context>` — any additional framing (e.g. "for a Java dev who knows Go")
- `--analogy` — flag: auto-pick the best analogy and announce it prominently (default behavior even without flag, but this makes it explicit)
- `--analogy <theme>` — flag with value: use this specific real-world domain as the master analogy (e.g. `--analogy restaurant`, `--analogy "post office"`, `--analogy factory`). You do NOT need to know the topic — it's just a preference, not a requirement.

**`--analogy` with no value = "pick the best one for me"**
**`--analogy restaurant` = "use restaurant, I have a preference"**
**omitting `--analogy` entirely = still auto-picks, just silently**

If options are NOT provided, ask the user ONE compact question before generating:

> **Topic:** `<topic>` — a few quick questions:
> 1. Pace? `slow` (lots of analogies, small steps) / `normal` (balanced) / `fast` (cut to the chase)
> 2. Depth? `basic` (concepts + usage) / `normal` (+ internals + patterns) / `advanced` (+ expert patterns, edge cases, tradeoffs)
> 3. Any context? (e.g. "I know Python but not distributed systems")
> 4. Analogy? (just type `--analogy` to let me pick, or `--analogy restaurant` if you have a preference — or skip entirely)
>
> Reply with e.g. `normal / basic / knows Java / --analogy` — or just the pace and depth.

Wait for the reply, then generate.

---

## Document Structure

Every document starts with an ASCII art banner, then flows through progressive chapters:

```
[ASCII ART BANNER — topic name in large ASCII font]

# <Topic>: From Zero to Hero
<One-line tagline>

---

## Chapter 1: What is <Topic>? (The Plain English Version)
## Chapter 2: The Simplest Possible Version
## Chapter 3: How It Actually Works
## Chapter 4: Real Patterns and Power Features
## Chapter 5+: Advanced / Production / At Scale  (omit if depth=basic)
## Final Chapter: Everything Side by Side
## Glossary
```

Scale chapter count to the topic's natural complexity (3–4 for simple, 6–8 for complex).

---

## Writing Rules

### Document Header

No ASCII art banners. Use clean markdown:

```markdown
# Zero to Hero: <Topic>
> pace: slow | depth: basic | analogy: restaurant

<one-line tagline>

---
```

### 1. Start from observable behavior — peel back layers

**Chapter 0 never shows code.** It starts from what the reader can already see or experience — the surface behavior. Then each chapter peels back exactly one layer: behavior → components → how they communicate → internals → production concerns.

Never start with theory. Start with: "When you do X, Y happens. Here's why."

### 2. Prose before code — always answer three questions first

Every concept gets a written explanation before its first code block:

1. **What is it?** One clear sentence. No jargon that hasn't been introduced yet.
2. **Why does it exist?** What problem does it solve? What breaks without it?
3. **How does it work conceptually?** The mental model — what happens under the hood, in plain English.

After the code:
- Explain non-obvious lines only (not restating what's readable)
- One "this means in practice" sentence connecting the code to a real consequence
- Common mistake or silent failure to watch for

**pace=slow:** write all three questions in full paragraphs. **pace=fast:** one dense paragraph covering all three, then code.

### 3. Code-to-English translation blocks

When introducing a real code snippet (not a toy example), show it side-by-side with a plain English translation. Left = code, right = what it actually means in conversational language:

````markdown
```typescript
const result = await generateText({
  model: openai("gpt-4o-mini"),       // which AI model to use
  prompt: "Summarise this article.",  // the instruction you're sending
  maxTokens: 200,                     // stop after 200 tokens (cost + speed control)
});
```

What this says in plain English:
- `model:` — "use OpenAI's fast cheap model"
- `prompt:` — "here is your task"
- `maxTokens:` — "don't write more than 200 tokens worth of response"
- `result.text` — "the AI's reply is here"
````

Use this format for the first appearance of any non-trivial code block. For subsequent uses of the same pattern, regular code comments suffice.

### 4. Custom metaphor per concept — never recycle

**Every distinct concept gets its own metaphor, invented specifically for it.** Not recycled from the chapter analogy. The metaphor must fit the concept's unique mechanic, not be forced from the chapter theme.

Examples of custom-per-concept metaphors:
- Context window → a whiteboard that gets erased when full
- Token streaming → a typewriter printing one character at a time
- Tool calling → a researcher who can look things up mid-answer
- Memory threadId → a numbered table in a restaurant (the table doesn't move between visits)
- Workflow step → a baton handoff in a relay race — you cannot skip the runner

The chapter analogy (restaurant, post office, etc.) is the **world**. Custom metaphors are the specific props within or outside that world that best explain individual concepts.

### 5. Application-framed examples

Frame examples as real tasks the reader would actually want to do, not abstract demonstrations:

**Weak:** "Here is how generateText works."
**Strong:** "You want to build an endpoint that summarises user-submitted articles. Here's how you'd use generateText for that."

**Weak:** "Tools allow the LLM to call functions."
**Strong:** "Your AI needs to check live order status — it can't answer from training data. Here's how you give it a tool that calls your database."

Every major concept should have at least one example framed as: "You want to [do X]. Here's how."

### 6. Show real code — not toy examples

Do not over-simplify code examples. Show code that looks like what the reader would actually write in a project:
- Include realistic variable names, not `foo` / `bar`
- Include `import` statements
- Include error-relevant details (e.g. `maxTokens`, `abortSignal`, type annotations)
- Comments on non-obvious lines only — label them `// WHY:` not `// this is X`

One exception: the very first code block for a brand-new concept may be a minimal 5-10 line version. Follow it immediately with a more realistic version.

### 7. Scenario-based understanding

At the end of each major chapter, include one **scenario question** — a situational prompt that tests whether the reader understood the concept, not just memorised a definition:

Format: a brief scenario → a question → the answer with explanation.

Examples:
- "You built a chatbot. Users complain it forgets who they are mid-conversation. Which chapter concept fixes this, and what two values do you need to pass?"
- "Your `generateText` call returns a truncated sentence. What field do you check, and what does it tell you?"
- "You want the same AI feature to work with both Claude and GPT-4 depending on config. What is the one-line change in AI SDK?"

These should feel like real debugging or design decisions, not quiz-bowl trivia.

### Master analogy — Chapter 0 only

The analogy is a **landing pad**, not a recurring theme.

**Chapter 0:** Full treatment. Introduce the world, all key roles, the mapping table. After this chapter, the reader should have a complete mental map.

**Subsequent chapters:** One-line callbacks only when a concept is genuinely confusing without it. Then move on. Do NOT re-explain the analogy or re-introduce roles.

**Picking the analogy:**
- **message passing / queues** → post office, subway
- **coordination / orchestration** → restaurant kitchen, air traffic control
- **storage and retrieval** → library, warehouse
- **transformation pipelines** → factory assembly line
- **distributed workers** → delivery company, hospital departments

Include a mapping table in Chapter 0:
```
  ANALOGY WORLD          TECHNICAL WORLD
  -------------          ---------------
  Chef              -->  LLM
  Order             -->  Prompt
  ...
```

### ASCII flow diagrams — use liberally
Use for: flows, sequences, state machines, layered architecture, timelines, decision trees.

Box-drawing characters: `┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼ ╔ ═ ╗ ║ ╚ ╝ ╠ ╣ ╦ ╩ ╬ ► ▼ ◄ ▲`

Every major concept gets at least one ASCII diagram. Put in fenced code blocks (no language tag).

### Sequence diagrams — use where interaction order matters
When a concept involves **multiple parties interacting over time** — e.g. client/server, producer/consumer, request/reply, multi-step handshakes — use an ASCII sequence diagram:

```
  Client          Server          Database
    │                │                │
    │── request ────►│                │
    │                │── query ──────►│
    │                │◄── result ─────│
    │◄── response ───│                │
    │                │                │
```

Rules for sequence diagrams:
- Participants as column headers, each with a vertical `│` lifeline
- Arrows as `──►` (sync call) or `··►` (async/fire-and-forget)
- Label every arrow with the message name or action
- Use when the ORDER of interactions is the key concept to understand (e.g. TCP handshake, OAuth flow, Kafka produce/consume, workflow step execution)
- Use a plain flow diagram instead when there's no meaningful time ordering

### Code examples
- Show the **simplest possible** working example first (5-10 lines).
- Then show a more realistic example after the concept is explained.
- Use the most natural language for the topic.
- Label `// WHY:` or `# WHY:` comments on non-obvious lines.

### Summary boxes
End each major chapter with a compact ASCII tree:
```
  <Topic> = <one-line definition>
  ├── Key 1:   ...
  ├── Key 2:   ...
  ├── Best for: ...
  └── Limitation: ...
```

### Comparison tables
When two or more implementations/approaches are covered, include a full aligned ASCII comparison table.

### Glossary
End every document with a `## Glossary` — compact two-column style:
```
  Term         Definition in one sentence.
  Term         Definition.
```

---

## Chapter structure — one chapter per concept

**Do NOT squish multiple tools/concepts into one chapter.** Give each major concept its own full chapter. For "AI SDK and Mastra", that means:

```
Chapter 0  The Analogy World  (set the scene, map every term)
Chapter 1  The Core Concept   (e.g. "What is an LLM?")
Chapter 2  Tool/Library A     (e.g. AI SDK — full treatment)
Chapter 3  Tool/Library A Patterns  (e.g. AI SDK — tools, streaming, structured output)
Chapter 4  Framework B        (e.g. Mastra — full treatment)
Chapter 5  Framework B Patterns  (e.g. Mastra — agents, memory, workflows)
Chapter 6  Side by Side       (comparison + decision guide)
Glossary
```

Within EACH chapter, the minimum structure is:
1. **Observable behavior** — what does this look like from the outside? What can the reader see or experience? No code yet.
2. **Why it exists** — what problem does this solve? What breaks without it?
3. **Mental model** — plain English explanation of how it works. Custom metaphor here if helpful.
4. **Code-to-English block** — minimal working example with side-by-side translation on first appearance
5. **Realistic example** — application-framed ("you want to build X..."), real-looking code
6. **How it works underneath** — diagram (flow, sequence, or architecture)
7. **Common mistake / silent failure** — one thing that goes wrong and how to catch it
8. **Scenario question** — situational prompt that tests real understanding
9. **Summary box** — ASCII tree recap

## Depth config

**depth=basic:**
- Include ALL chapters (don't skip any concept)
- Keep examples short and accessible
- ONE pattern and ONE use case per chapter
- Skip internals/architecture diagrams

**depth=normal (default):**
- Full chapter structure
- TWO-THREE patterns per chapter
- Include one "gotcha/rules" section per tool
- Include sequence diagrams where interaction order matters

**depth=advanced:**
- Full chapter structure + extra chapters for production concerns
- Include internals, architecture diagrams, banned/allowed tables
- THREE+ patterns, anti-patterns, at-scale considerations

---

## Output

1. Write the file using the Write tool to the specified path, or default to `<cwd>/<topic-slug>-zero-to-hero.md` (always include `-zero-to-hero` in the filename so docs are easy to find and identify).
2. Tell the user: `Written to <path>` — chapter count, depth, pace, analogy chosen.
3. Do NOT print the full document in chat — it belongs in the file.

---

## Example invocations

```
/zero-to-hero Redis
/zero-to-hero "Kafka" --analogy                        ← auto-pick best analogy, announce it
/zero-to-hero "Kafka" --analogy "post office"          ← use post office specifically
/zero-to-hero "Kubernetes networking" --pace slow --depth basic
/zero-to-hero "Temporal workflows" --depth advanced --output ./docs/temporal-guide.md
/zero-to-hero "Postgres indexes" --context "I'm a frontend dev, never touched SQL internals"
/zero-to-hero "AI SDK and Mastra" --pace slow --depth basic --analogy "restaurant kitchen"
```