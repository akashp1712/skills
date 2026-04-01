# Zero to Hero: AI SDK and Mastra

> pace: slow | depth: normal | analogy: restaurant kitchen (Chapter 1 only)

What is an LLM? → Talking to it with AI SDK → Patterns → Building with Mastra → Agents, Memory, Workflows

---

## Chapter 1: The Mental Model

Before any code, you need one picture in your head. Everything in this guide — every function, every class, every pattern — maps to something in a restaurant kitchen.

```
  RESTAURANT WORLD               TECHNICAL WORLD
  ================               ===============

  Customer                  -->  Your app / your code
  Order slip                -->  Prompt
  Chef's reply              -->  Completion (the LLM's output)
  The chef                  -->  LLM  (GPT-4, Claude, Gemini...)
  Order system (POS)        -->  AI SDK  (unified call layer)
  Waiter's running tab      -->  Conversation history (messages[])
  Chef's permanent job spec -->  system prompt
  Specialty tool (thermometer, blowtorch) --> tool() (callable function)
  Full staffed restaurant   -->  Mastra  (application framework)
  Recipe card               -->  Mastra Workflow
```

Four things to take from this before moving on:

- **The chef only knows what they trained on.** They cannot check today's specials or your database unless you hand them a tool.
- **There is no real memory between visits.** You reconstruct it by handing the waiter's running tab to the chef every single time.
- **AI SDK is the order system.** One consistent format — you swap chefs without rewriting the order slip.
- **Mastra is the full restaurant.** It organises who the agents are, what they remember, and what recipes they follow.

That's the analogy. The rest of this guide is technical.

---

## Chapter 2: What is an LLM?

### What you see from the outside

Open ChatGPT, type "What is the capital of France?", hit Enter. The word "Paris" arrives in under a second. Now ask it to summarise a 10-page document — it reads the whole thing and replies in plain English. Ask it to write TypeScript code — it writes real, runnable code.

That's the surface. What you cannot see: there is no database of facts, no search engine, no lookup table. There is only one thing — a neural network that was trained to predict what comes next, word by word, given everything that came before. That single mechanic, applied at massive scale with massive data, produces something that reasons, writes, codes, and explains.

Understanding this is not just trivia. It tells you exactly what an LLM is good and bad at — which determines how you build with it.

### What is an LLM?

An LLM — Large Language Model — is a neural network trained on hundreds of billions of words from the internet, books, and code. Its core job: given everything before this point, what word is most likely to come next? Iterated token by token, this produces fluent, reasoned, context-aware text.

**Why it exists:** Before LLMs, language tasks (translation, summarisation, classification) each required separate purpose-built models. LLMs collapsed this into one general-purpose system — one model that can do all of them with just a different prompt.

**How it works conceptually:** During training, the model saw billions of examples of "this text follows this context." It learned patterns, facts, reasoning structures, coding conventions — all encoded as billions of numerical weights. At inference time (when you call it), it uses those weights to predict each token. It has no access to external information unless you provide it.

### Tokens, not words

LLMs do not read words. They read **tokens** — fragments that are roughly three-quarters of a word each. This distinction matters because tokens are your unit of cost, speed, and the hard limit on how much the model can see at once.

> **Metaphor:** Tokens are like coins in a vending machine. Every token your prompt costs a coin going in. Every token the reply generates costs a coin coming out. You pay for both sides of the trip — and the machine has a coin limit per transaction.

```
  "Hello, world!"                       =  4 tokens
  "TypeScript is great"                 =  5 tokens
  "supercalifragilisticexpialidocious"  =  8 tokens

  Tokens drive three things:
  ├── Cost:     you pay per token (input + output)
  ├── Speed:    more tokens = slower response
  └── Limit:    every model has a max "context window" in tokens
```

### The context window

Every model can only see a fixed number of tokens at once — this is its **context window**. Your prompt, the conversation history, and the model's reply all count toward this limit. When you exceed it, the oldest content is dropped silently.

> **Metaphor:** The context window is a whiteboard with fixed space. When it gets full, you erase from the top to make room for new writing. The erased content is gone — the model has no memory of it whatsoever.

This is why long conversations degrade. The model literally cannot see what was said an hour ago unless you explicitly include it.

```
  ┌──────────────────────────── context window (e.g. 200k tokens) ───────────────────────┐
  │  system prompt │  message 1  │  message 2  │  ...  │  message N  │  response budget  │
  └───────────────────────────────────────────────────────────────────────────────────────┘
                                                                       ▲
                                                             if overflow, oldest messages
                                                             are silently dropped first
```

### The message format

Every LLM call is a list of messages. Each message has a role that tells the model who said it and how much weight to give it. This is the universal contract that every provider uses, and the format AI SDK normalises across all of them.

```typescript
[
  { role: "system",    content: "You are a concise assistant." },
  { role: "user",      content: "What is TypeScript?" },
  { role: "assistant", content: "TypeScript is a typed superset of JavaScript." },
  { role: "user",      content: "Why use it over plain JS?" },
]
```

What this says in plain English:

- `role: "system"` — "These are your permanent rules. You follow them above everything else. I set this once and you carry it into every reply."
- `role: "user"` — "This is what the human said."
- `role: "assistant"` — "This is what you (the model) said in a prior turn. I'm re-sending it so you have context."
- The final `"user"` message — "This is the question you are answering right now."

The LLM has no persistent state. **You are responsible for reconstructing the conversation** by including prior messages on every call. This is not a limitation to work around — it is the design, and it is why frameworks like Mastra add a memory layer on top.

### Why there are many LLMs

Multiple companies have trained their own models, each with different strengths, prices, and context window sizes. You will want to swap between them — Claude for strong reasoning, Gemini for large contexts, GPT-4o-mini for cheap high-volume tasks. That is the exact problem AI SDK solves.

```
  ┌─────────────┬──────────────────────────┬──────────────────────────────┐
  │  Provider   │  Notable Models           │  Best at                     │
  ├─────────────┼──────────────────────────┼──────────────────────────────┤
  │  OpenAI     │  gpt-4o, gpt-4o-mini     │  Versatile, well-supported   │
  │  Anthropic  │  claude-3-5-sonnet,haiku │  Reasoning, instruction-following│
  │  Google     │  gemini-2.0-flash, pro   │  Speed, large context, cheap │
  │  Meta       │  llama-3.1, llama-3.3    │  Open-weight, self-hostable  │
  │  Mistral    │  mistral-large, small    │  Efficient, European-hosted  │
  └─────────────┴──────────────────────────┴──────────────────────────────┘
```

---

**Scenario check:** Your chatbot gives great answers early in a conversation but starts forgetting earlier context after a long session. It even contradicts itself. Which concept explains this, and what is the root cause?

> **Answer:** The context window. As the conversation grows, older messages are silently dropped when the total token count exceeds the model's limit. The model literally no longer has access to those earlier turns — not because of a bug, but by design. The fix is either a shorter conversation window, or a memory layer (like Mastra Memory) that stores and retrieves history from outside the context window.

```
  LLM = a next-token predictor trained on massive text
  ├── Tokens:          the real unit — ~0.75 words each
  ├── Context window:  fixed token budget. Overflow = silent drop from top.
  ├── Message format:  system / user / assistant — universal across providers
  ├── No memory:       stateless by design. You reconstruct history every call.
  └── Many providers:  OpenAI, Anthropic, Google — different tradeoffs, same format
```

---

## Chapter 3: AI SDK — Talking to LLMs

### What you see from the outside

You want to call an LLM from your TypeScript app. Without any library, you make raw HTTP requests to OpenAI's REST API. The response shape is OpenAI-specific. Your auth headers are OpenAI-specific. Your retry logic is yours to write. When you want to add Claude, you write a second integration with different endpoints, different headers, a different response format.

Now multiply that by five providers. Now add streaming. Now add schema-validated structured output. That is the problem AI SDK exists to eliminate.

**With AI SDK:** one import, one function call, one response shape — regardless of which LLM you're talking to. Swap `openai("gpt-4o-mini")` for `anthropic("claude-3-5-haiku")` and everything else is identical.

### What is AI SDK?

AI SDK is a TypeScript library by Vercel that provides a **uniform interface over all major LLM providers**. It handles the vendor-specific API formats, authentication, request/response normalisation, streaming, retries, and schema validation for you. You write provider-agnostic code; AI SDK handles the rest.

**Why it exists:** Every LLM provider has a different API. Without a unification layer, your application logic couples to a vendor. AI SDK is that unification layer — write once, swap providers without touching business logic.

**How it works conceptually:** AI SDK wraps each provider's REST API in a standardised adapter. When you call `generateText({ model: openai("gpt-4o") })`, AI SDK translates your call into OpenAI's specific format, sends the request, normalises the response, and returns a consistent result object. Change `openai(...)` to `anthropic(...)` and AI SDK does the translation to Anthropic's format instead.

```
  Your code
      │
      │  generateText({ model: openai("gpt-4o"),      ... })
      │  generateText({ model: anthropic("claude"),   ... })
      │  generateText({ model: google("gemini"),      ... })
      ▼
  ┌──────────────────────────┐
  │         AI SDK           │   uniform interface
  └─────┬─────────┬──────────┘
        │         │         │
        ▼         ▼         ▼
     OpenAI   Anthropic   Google
     (their   (their      (their
      API)     API)        API)
```

### Setup

```bash
npm install ai @ai-sdk/openai          # or @ai-sdk/anthropic, @ai-sdk/google
```

```bash
OPENAI_API_KEY=sk-...
# or ANTHROPIC_API_KEY=sk-ant-...
```

---

### `generateText` — a single, complete request

**You want to build an endpoint that summarises user-submitted articles.** The user submits text, you process it server-side, and store the summary. Nobody needs to watch a spinner — you just need the result. `generateText` is exactly right here.

`generateText` is the simplest call: send a prompt, wait for the model to finish generating, get back the complete response. Use it whenever the caller does not need to see output until it is fully ready: background jobs, server-side processing, classification, data extraction.

> **Metaphor:** `generateText` is a sealed envelope. You write your letter (prompt), seal it, drop it in the mailbox. You wait by the mailbox. The full reply arrives as one package — nothing comes out until the whole thing is done.

**Minimal working example:**

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "Summarise this article in two sentences: ...",
});

console.log(result.text);   // the full summary
```

What this says in plain English:

- `model: openai("gpt-4o-mini")` — "use OpenAI's fast, cheap model"
- `prompt:` — "here is the instruction and the text to process"
- `result.text` — "the model's reply is here"

**Realistic example with full options:**

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-4o"),

  // Use messages[] for multi-turn conversations instead of prompt:
  messages: [
    { role: "system",    content: "You are a concise assistant." },
    { role: "user",      content: "What is TypeScript?" },
    { role: "assistant", content: "TypeScript is a typed superset of JavaScript." },
    { role: "user",      content: "How do I install it?" },
  ],

  maxTokens: 500,              // hard cap on output length
  temperature: 0.7,            // 0 = deterministic, 1 = creative
  maxRetries: 3,               // auto-retry on rate-limit / 5xx (default: 2)
  abortSignal: controller.signal, // cancel mid-flight on timeout or navigation
});

console.log(result.text);           // the reply
console.log(result.usage);          // { promptTokens, completionTokens, totalTokens }
console.log(result.finishReason);   // "stop" | "length" | "tool-calls"
```

`finishReason: "length"` is a silent failure. If `maxTokens` is too low, the model stops mid-sentence — you will never know unless you check this field.

**Switching providers is one line:**

```typescript
// OpenAI
model: openai("gpt-4o-mini")

// Anthropic — everything else is identical
import { anthropic } from "@ai-sdk/anthropic";
model: anthropic("claude-3-5-haiku-20241022")
```

---

### `streamText` — token by token

**You want to build a chat UI** where responses feel instant. Without streaming, the user stares at a blank input for 3–5 seconds while the model generates. With streaming, the first words appear in ~200ms. That difference between "blank" and "typing" is everything for perceived performance.

`streamText` calls the same LLM the same way, but yields each token as the model generates it. Your code sees the first word in milliseconds rather than waiting for the entire response.

> **Metaphor:** `streamText` is a telegraph machine. The operator on the other end types letter by letter, and each character prints on your end as it's sent — you see the message building live, not all at once when they're done typing.

```typescript
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const result = streamText({
  model: anthropic("claude-3-5-haiku-20241022"),
  prompt: "Write a short story about a robot learning to cook.",
});

// Consume the stream token by token
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);  // each chunk is 1-5 tokens
}
```

**In a Next.js route handler** (the most common use case), AI SDK handles all the HTTP chunking, connection management, and formatting for you:

```typescript
// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages,
  });

  // toDataStreamResponse() keeps the connection open and formats output
  // for the useChat() React hook — the client receives tokens as they arrive.
  return result.toDataStreamResponse();
}
```

```
  generateText  ─── waiting 3s ──────────────────────────────▶  [full text arrives]
  streamText    ▶ "The" ▶ " robot" ▶ " picked" ▶ " up" ▶ ...   (starts in ~200ms)
```

---

### `generateObject` — structured output

**You want to automatically classify and prioritise incoming support tickets.** Free-form prose from the model is useless here — you need a `sentiment`, a `priority` number, and an `actionRequired` flag you can pass directly to your database. `generateObject` is what makes this possible.

`generateObject` forces the model to return a JSON object that matches a **Zod schema you define**. The result is fully typed and validated. If the model fails to produce valid JSON, AI SDK retries automatically.

> **Metaphor:** `generateObject` is a form you hand to a specialist to fill in. They cannot write freeform — every field is labelled, typed, and constrained. You hand back a completed form, not a letter.

```typescript
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const ReviewSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  score: z.number().min(-1).max(1).describe("Sentiment score from -1 to 1"),
  topics: z.array(z.string()).describe("Key topics mentioned in the review"),
  summary: z.string().max(100).describe("One-sentence summary"),
  actionRequired: z.boolean().describe("Does this need a human to follow up?"),
});

const { object } = await generateObject({
  model: openai("gpt-4o-mini"),
  schema: ReviewSchema,
  prompt: `Analyze this customer review:
    "Amazing product, packaging was excellent. Shipping took 2 weeks though,
     almost cancelled the order. Would buy again if shipping improves."`,
});

// object is fully typed — TypeScript knows the exact shape
if (object.actionRequired) {
  await escalateToSupportTeam(object);
}
```

What this says in plain English:

- `schema: ReviewSchema` — "here is the exact shape of JSON I expect back — validate every field"
- `.describe(...)` on each field — these descriptions are injected into the prompt so the model knows what each field means
- `object.actionRequired` — TypeScript knows this is `boolean`, not `any`

The `.describe()` calls are not just documentation — they are part of the prompt. Good descriptions produce better outputs.

`streamObject` is the streaming variant — yields partial objects as they build, useful for progressive UI:

```typescript
import { streamObject } from "ai";

const { partialObjectStream } = streamObject({ model, schema: ReviewSchema, prompt });

for await (const partial of partialObjectStream) {
  // arrives progressively:  { sentiment: "positive" }  →  { sentiment: "positive", score: 0.5 }  →  ...
  updateUI(partial);
}
```

---

### Tools — functions the LLM can call

**Your AI assistant needs to answer "where is my order?"** The model has no knowledge of your database — it was trained on internet text, not your orders table. Without tools, it can only say "I don't have access to that." With a tool, it calls your database mid-answer and replies with real data.

A tool is a function you write and describe to the model. When the model needs information it cannot produce from training data, it calls the tool, receives the result, and incorporates it into its reply.

> **Metaphor:** A tool is a researcher on call. While writing an article, the journalist (LLM) can pick up the phone and ask the researcher to look up a specific fact. The researcher (your function) goes and finds it; the journalist incorporates the answer and continues writing.

```typescript
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const result = await generateText({
  model: openai("gpt-4o"),
  prompt: "What is the weather in Paris and Tokyo right now? Should I pack an umbrella for Paris?",
  tools: {
    getWeather: tool({
      // The description is what the model reads to decide WHEN to use this tool.
      // Write it precisely — vague descriptions cause misuse.
      description: "Get current weather and forecast for a specific city",
      parameters: z.object({
        city: z.string().describe("City name, e.g. 'Paris' or 'Tokyo'"),
        units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
      }),
      execute: async ({ city, units }) => {
        // Your code. Call any API, query any database.
        return await weatherAPI.getCurrent(city, units);
      },
    }),
  },
  // maxSteps: how many tool-call → result cycles are allowed
  // before the model must produce a final text response.
  // Without this, the model can only call one tool per request.
  maxSteps: 5,
});
```

What happens under the hood when two tool calls are needed:

```
  Your code          AI SDK           LLM              Your tool fn
      │                 │               │                    │
      │── generateText ─▶               │                    │
      │                 │── messages ──▶│                    │
      │                 │               │  "I need Paris weather"
      │                 │◀── tool call: getWeather("Paris")  │
      │                 │── execute ─────────────────────────▶
      │                 │◀── { temp: 18, rain: true } ────────│
      │                 │── result ────▶│                    │
      │                 │               │  "I need Tokyo weather"
      │                 │◀── tool call: getWeather("Tokyo")  │
      │                 │── execute ─────────────────────────▶
      │                 │◀── { temp: 26, rain: false } ───────│
      │                 │── result ────▶│                    │
      │                 │◀── final text (uses both results)  │
      │◀── result.text ─│               │                    │
```

The model called the same tool twice autonomously — once per city — without you writing that loop.

---

### A complete real-world example

You want to build a support chat endpoint that streams, has a defined persona, and can look up real order data:

```typescript
// app/api/support/route.ts
import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20241022"),

    system: `You are a customer support agent for Acme Store.
    Rules:
    - Always look up the order before giving any status information.
    - Never make up order details — if the tool returns nothing, say so.
    - Keep responses concise. Use bullet points over paragraphs.
    - If you cannot resolve the issue, offer to escalate.`,

    messages,

    tools: {
      lookupOrder: tool({
        description: "Look up an order by ID. Use this before answering any order status questions.",
        parameters: z.object({ orderId: z.string() }),
        execute: async ({ orderId }) => db.orders.findById(orderId),
      }),
      initiateReturn: tool({
        description: "Start a return process for an order item",
        parameters: z.object({
          orderId: z.string(),
          itemId: z.string(),
          reason: z.enum(["damaged", "wrong_item", "changed_mind", "other"]),
        }),
        execute: async (params) => returns.initiate(params),
      }),
    },

    maxSteps: 4,

    onStepFinish: ({ stepType, toolCalls, toolResults }) => {
      // Log every tool call — critical for debugging in production
      if (toolCalls?.length) {
        logger.info("tool_called", { stepType, toolCalls, toolResults });
      }
    },
  });

  return result.toDataStreamResponse();
}
```

---

**Scenario check:** You call `generateText` with `maxTokens: 100`. The response comes back, but it ends mid-sentence. No error was thrown. What happened, and how do you detect it?

> **Answer:** The model hit the `maxTokens` limit before it finished generating. AI SDK does not throw an error — the call succeeded; it just stopped at the cap. Check `result.finishReason` — it will be `"length"` instead of `"stop"`. To fix: increase `maxTokens`, or break the task into smaller prompts that produce shorter outputs.

```
  AI SDK:
  ├── generateText    Full response, awaited. For background/server-side work.
  ├── streamText      Token-by-token. For all user-facing UIs.
  ├── generateObject  Schema-validated JSON. For data extraction and classification.
  ├── streamObject    Partial JSON streamed progressively. For live-updating UIs.
  ├── tool()          Function the LLM can call. Your code, your data, real-time.
  └── maxSteps: N     Allow N rounds of tool-call+result. Required for multi-tool.
```

---

## Chapter 4: Mastra — Building AI Applications

### What you see from the outside

You have built a chatbot using AI SDK. It works. But then you hit these problems:

- Users ask follow-up questions. The bot has no idea what they said two messages ago unless you pass the full history every time — and you are doing that manually.
- You want this bot to have the same personality and tool access everywhere in your app. Right now, you copy-paste the system prompt and tools into every route handler.
- You need a multi-step flow: extract data → validate → enrich → notify. You write an imperative function with nested awaits. It is fragile — if the enrich step fails, you have no idea where in the chain it broke.

**Mastra solves all three.** It is an application framework that sits on top of AI SDK and adds: Agents (named, instruction-bound AI personas with tools wired in once), Memory (conversation persistence across sessions with no manual history management), and Workflows (typed, deterministic step pipelines with clear failure attribution).

### What is Mastra?

Mastra is a TypeScript AI application framework. It does not replace AI SDK — it organises it. Under the hood, Mastra calls AI SDK's `generateText`, `streamText`, and `tool()` exactly as you would. What it adds is the architecture: named agents, persistent memory, and typed workflow pipelines.

**Why it exists:** Raw AI SDK gives you excellent primitives for individual calls. But building real AI products requires structure — consistent agent identities, cross-session memory, and reliable multi-step pipelines. Mastra is that structure, so you do not have to build it yourself.

**How it works conceptually:** You define Agents, Memory, and Workflows as configuration objects. The `Mastra` class acts as a container that registers and connects all of them. When you call `agent.generate()`, Mastra retrieves the agent's configuration, injects memory context, prepends instructions, and delegates to AI SDK for the actual LLM call.

```
  ┌──────────────────────────────────────────────┐
  │              YOUR APP CODE                   │
  ├──────────────────────────────────────────────┤
  │  MASTRA  (Agents | Memory | Workflows)        │
  ├──────────────────────────────────────────────┤
  │  AI SDK  (generateText | streamText | tool()) │
  ├──────────────────────────────────────────────┤
  │  LLM PROVIDERS  (OpenAI | Anthropic | Google) │
  └──────────────────────────────────────────────┘
```

### Setup

```bash
npm install mastra @mastra/core @mastra/memory @ai-sdk/anthropic
```

---

### Agents

**You want to build a personal assistant that has consistent rules and access to your calendar, your notes, and your email** — everywhere in your app. Without Mastra, every route that calls the AI must re-define the system prompt and re-wire the tools. One change to the agent's rules means updating every place.

A Mastra Agent is a named, persistent configuration for an AI persona. It combines model, instructions (the system prompt), and tools — defined once, used everywhere.

> **Metaphor:** An Agent is a new hire you onboard once. You hand them a job description that covers their responsibilities, rules, and what tools they have access to. After that, every time they take a call, they refer to their job description automatically. You never re-explain their role each morning.

```typescript
import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";
import { tool } from "ai";
import { z } from "zod";

const supportAgent = new Agent({
  name: "SupportAgent",

  // Instructions = the agent's job description. Be specific.
  // The model follows this exactly on every call — it's auto-injected as system prompt.
  instructions: `You are a customer support agent for Acme Store.
    Responsibilities:
    - Answer questions about orders, products, shipping, and returns only.
    - Always call lookupOrder before giving any order status.
    - Never guess or make up information. If uncertain, say so.
    - Be direct and concise. Bullet points over paragraphs.
    - If an issue cannot be resolved through tools, offer human escalation.`,

  model: anthropic("claude-3-5-sonnet-20241022"),

  tools: {
    lookupOrder: tool({
      description: "Look up order by ID",
      parameters: z.object({ orderId: z.string() }),
      execute: async ({ orderId }) => db.orders.findById(orderId),
    }),
    initiateReturn: tool({
      description: "Start a return for an order item",
      parameters: z.object({
        orderId: z.string(),
        reason: z.enum(["damaged", "wrong_item", "changed_mind"]),
      }),
      execute: async (params) => returns.initiate(params),
    }),
  },
});
```

What this says in plain English:

- `name: "SupportAgent"` — "this agent has an identity I can reference throughout the app"
- `instructions:` — "this is the permanent system prompt injected on every call — the agent's contract"
- `model:` — "use this provider and model for all calls on this agent"
- `tools:` — "these functions are available to the agent on every call — defined once, not per call"

**What happens on every `agent.generate()` call:**

```
  agent.generate("Where is my order #1234?")
  →
  LLM receives:
  [
    { role: "system",  content: "<your instructions text>" },  ← always auto-injected
    { role: "user",    content: "Where is my order #1234?" }
  ]
```

**Calling the agent — three modes:**

```typescript
const mastra = new Mastra({ agents: { supportAgent } });
const agent  = mastra.getAgent("supportAgent");

// 1. Generate — await full response
const { text } = await agent.generate("What is your return policy?");

// 2. Stream — token by token
const { textStream } = await agent.stream("Where is my order #1234?");
for await (const chunk of textStream) process.stdout.write(chunk);

// 3. Generate with structured output
const { object } = await agent.generate("Summarize this support ticket.", {
  output: z.object({
    category: z.enum(["billing", "shipping", "product", "other"]),
    priority: z.number().min(1).max(5),
    summary: z.string(),
  }),
});
```

---

### Memory — Conversation Persistence

**You want to build a personal assistant that remembers context between sessions.** On Monday the user tells it their preferred tech stack. On Thursday they ask "what caching layer should I use?" — and the assistant should know the stack from Monday without the user repeating it.

Mastra's Memory solves this by automatically storing and retrieving conversation history. When an agent has memory configured, every `generate()` call reads relevant history for a given thread, includes it in the context, and saves the new turn back to storage. You do not manage any of this — you just pass a `threadId`.

> **Metaphor:** Memory is a logbook with a numbered table at a restaurant. Table 12 has its own section in the logbook. Every time a customer at table 12 comes back, the server reads the table's section before approaching, then adds the new visit's notes at the end. The server never needs to ask who they are.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";

const assistantAgent = new Agent({
  name: "PersonalAssistant",
  instructions: "You are a helpful personal assistant. Remember user preferences and context.",
  model: anthropic("claude-3-5-haiku-20241022"),
  memory: new Memory(),  // in-memory storage by default
});
```

```typescript
// Monday
await agent.generate(
  "My preferred stack is Next.js, TypeScript, and Postgres. I'm building a SaaS.",
  { threadId: "akash-main", resourceId: "user-akash" }
);

// Thursday — no manual history passing
const { text } = await agent.generate(
  "What caching layer would you recommend for my stack?",
  { threadId: "akash-main", resourceId: "user-akash" }
);
// → "Given your Next.js and Postgres setup, Redis is the natural choice..."
```

The two identifiers:

```
  threadId      Groups messages into a single conversation thread.
                One chat session = one threadId.
                Different threadIds = completely isolated conversations.

  resourceId    Scopes threads to a user or organisation.
                Prevents one user's memory from leaking into another's.
```

**What Memory does on each call:**

```
  agent.generate(msg, { threadId, resourceId })
      │
      ├─ 1. Load recent messages for threadId from storage
      ├─ 2. Inject them into messages[] sent to LLM
      ├─ 3. LLM generates response with full context
      └─ 4. Save [user msg + assistant reply] back to storage
             ↑ next call starts at step 1 again
```

**Configuring storage for production:**

The default in-memory storage disappears on restart. Plug in a persistent store:

```typescript
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/memory/storage/libsql";

const memory = new Memory({
  // Persistent — survives restarts
  storage: new LibSQLStore({ url: process.env.DATABASE_URL! }),

  options: {
    lastMessages: 20,         // always include the N most recent messages

    // Semantic recall: vector-search older history for relevant past context.
    // Useful when conversations grow long and recent messages miss older context.
    semanticRecall: {
      topK: 5,           // retrieve 5 most semantically similar past messages
      messageRange: 2,   // include 2 surrounding messages for each match
    },

    // WHY: without this, very long conversations bloat the context window
    workingMemory: { enabled: true },
  },
});
```

---

### Workflows — Typed Deterministic Pipelines

**You want to build a user onboarding flow:** validate the email → enrich the profile via Clearbit → send a personalised welcome email. If any step fails, you need to know exactly which step failed, with what input, and why. Writing this as a nested series of `await` calls works — until it breaks silently in production and you have no audit trail.

Workflows give you guaranteed step ordering, typed inputs and outputs, and a complete audit trail. Every step has an input schema, an output schema, and an execute function. The output of each step becomes the input of the next. If a step throws, the workflow fails and points you to exactly which step failed.

> **Metaphor:** A workflow is a relay race. Each runner (step) waits for the baton (data) from the previous runner, runs their leg, and passes it forward. No runner can skip ahead. If a runner drops the baton, the race stops and the timing board shows exactly where.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

// Each step: explicit inputSchema → execute → outputSchema
const validateEmail = createStep({
  id: "validate",
  inputSchema:  z.object({ email: z.string(), userId: z.string() }),
  outputSchema: z.object({ email: z.string(), userId: z.string(), isValid: z.boolean() }),
  execute: async ({ inputData }) => ({
    ...inputData,
    isValid: z.string().email().safeParse(inputData.email).success,
  }),
});

const enrichProfile = createStep({
  id: "enrich",
  inputSchema:  z.object({ email: z.string(), userId: z.string(), isValid: z.boolean() }),
  outputSchema: z.object({ userId: z.string(), name: z.string(), company: z.string() }),
  execute: async ({ inputData }) => {
    if (!inputData.isValid) throw new Error(`Invalid email: ${inputData.email}`);
    const data = await clearbit.enrich(inputData.email);
    return { userId: inputData.userId, name: data.name, company: data.company };
  },
});

const sendWelcomeEmail = createStep({
  id: "send-welcome",
  inputSchema:  z.object({ userId: z.string(), name: z.string(), company: z.string() }),
  outputSchema: z.object({ sent: z.boolean(), messageId: z.string() }),
  execute: async ({ inputData }) =>
    email.send({ to: inputData.userId, template: "welcome", vars: inputData }),
});

// Wire steps — each step's outputSchema must satisfy the next step's inputSchema
// TypeScript will error at definition time if the shapes don't match
const onboardingFlow = createWorkflow({
  id: "onboarding",
  inputSchema:  z.object({ email: z.string(), userId: z.string() }),
  outputSchema: z.object({ sent: z.boolean(), messageId: z.string() }),
})
  .then(validateEmail)
  .then(enrichProfile)
  .then(sendWelcomeEmail)
  .commit();
```

**Running the workflow and reading results:**

```typescript
const mastra = new Mastra({ workflows: { onboardingFlow } });
const run = mastra.getWorkflow("onboarding").createRun();

const result = await run.start({
  inputData: { email: "akash@example.com", userId: "u-123" },
});

// Every step's output is recorded — full audit trail
console.log(result.results);
// {
//   validate:      { email: "akash@...", userId: "u-123", isValid: true },
//   enrich:        { userId: "u-123", name: "Akash", company: "Acme" },
//   send-welcome:  { sent: true, messageId: "msg-abc" }
// }
```

**Parallel steps** — when steps do not depend on each other, run them concurrently:

```typescript
const dashboardFlow = createWorkflow({ id: "dashboard", ... })
  .parallel([
    fetchUserProfile,     // these three run simultaneously
    fetchOrderHistory,
    fetchPreferences,
  ])
  .then(assembleDashboard)  // receives all three results merged
  .commit();
```

```
  start
    │
    ├── fetchUserProfile ─────┐
    ├── fetchOrderHistory ────┼──▶  all three finish  ──▶  assembleDashboard
    └── fetchPreferences ─────┘
```

**Embedding an agent inside a workflow step** — deterministic pipeline structure with AI reasoning at specific steps:

```typescript
const analyzeWithAI = createStep({
  id: "ai-analysis",
  inputSchema:  z.object({ rawFeedback: z.string() }),
  outputSchema: z.object({ themes: z.array(z.string()), priority: z.number() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra!.getAgent("analysisAgent");
    const { object } = await agent.generate(
      `Extract themes and assign priority from: ${inputData.rawFeedback}`,
      { output: z.object({ themes: z.array(z.string()), priority: z.number() }) }
    );
    return object;
  },
});
```

---

**Scenario check:** You built an onboarding workflow. The `enrichProfile` step occasionally fails when Clearbit returns no data, but you get a generic unhandled promise rejection — no indication of which step or which user triggered it. What Mastra feature fixes the observability problem, and what does it give you that raw imperative code doesn't?

> **Answer:** Workflows record every step's input and output in `result.results`. When `enrichProfile` throws, Mastra attributes the failure to that specific step and you can see the exact `inputData` that caused it — the email, the userId. With raw imperative code (nested awaits), an unhandled rejection at `enrichProfile` surfaces as a generic error with no step attribution. Workflow steps are also the right place to add per-step error handling: catch inside `execute` and return a structured error value instead of throwing, which lets downstream steps handle the failure gracefully.

```
  Mastra:
  ├── Agent      Named, instruction-bound persona. Instructions auto-injected.
  │              Tools pre-wired. Consistent identity across every call.
  ├── Memory     Persists conversation history per threadId/resourceId.
  │              Storage is pluggable (in-memory, LibSQL, Postgres, Upstash).
  ├── Workflow   Typed sequential or parallel steps. Deterministic. Auditable.
  │              Each step: inputSchema → execute → outputSchema.
  └── Mastra{}   Container. Registers agents + workflows. Provides DI.
```

---

## Chapter 5: Side by Side

### The fundamental split

```
  AI SDK                              Mastra
  ──────                              ──────
  Individual calls                    Application structure
  You manage identity, history,       Mastra manages identity, history,
  tool wiring, step ordering          tool wiring, step ordering for you

  Right when:                         Right when:
  - A feature needs 1-2 LLM calls     - Building a chatbot or AI assistant
  - Server-side processing            - Users return and context must persist
  - Rapid prototyping                 - Multiple steps must coordinate reliably
  - No persistent state needed        - Agents need consistent personas + tools
```

### Comparison table

```
  ┌─────────────────┬──────────────────────────┬───────────────────────────────┐
  │                 │  AI SDK                  │  Mastra                       │
  ├─────────────────┼──────────────────────────┼───────────────────────────────┤
  │ What            │ LLM call library          │ AI application framework       │
  │ Layer           │ Low-level primitives      │ High-level structure            │
  │ Memory          │ Manual — pass messages[]  │ Built-in via Memory class      │
  │ Agent identity  │ Not built-in              │ name + instructions per agent  │
  │ Tool wiring     │ Per call                  │ Per agent (defined once)       │
  │ Multi-step flow │ Manual imperative code    │ Workflow (.then() / .parallel) │
  │ Streaming       │ streamText                │ agent.stream()                 │
  │ Structured out  │ generateObject            │ agent.generate({ output: z })  │
  │ Type safety     │ Result types              │ Enforced at every step boundary│
  │ Observability   │ onStepFinish callback     │ Per-step result recording      │
  │ Model swapping  │ One line                  │ One line                       │
  └─────────────────┴──────────────────────────┴───────────────────────────────┘
```

### Decision guide

```
  What you need                                    Use
  ──────────────────────────────────────────────────────────────────────────

  Summarise, rewrite, translate a document         generateText
  Classify or extract into typed JSON              generateObject
  Chat UI — user sees output as it generates       streamText
  AI calls your DB or APIs                         generateText + tool()

  Chat that remembers users across sessions        Mastra Agent + Memory
  AI persona with consistent rules + tools         Mastra Agent
  Fixed pipeline: fetch → enrich → notify          Mastra Workflow
  Parallel data gathering then aggregation         Mastra Workflow .parallel()
  Business logic that needs an AI reasoning step   Mastra Workflow + Agent step
```

---

## Glossary

```
  LLM                Text-in, text-out neural network trained on massive text corpora.
  Token              ~0.75 words. The unit of LLM cost, speed, and context limits.
  Context window     Max tokens the model can see at once (prompt + history + output).
  Prompt             Text you send to an LLM.
  Completion         Text the LLM sends back.
  system prompt      Permanent instructions at the top of every request.
  messages[]         Full conversation history. You send this on every call.
  temperature        Randomness control. 0 = deterministic. 1 = creative. >1 = chaotic.
  maxTokens          Hard cap on output length. Check finishReason: "length" if truncated.
  finishReason       Why the model stopped: "stop" | "length" | "tool-calls".

  generateText       AI SDK: full response, awaited.
  streamText         AI SDK: token-by-token stream. Use for all user-facing UIs.
  generateObject     AI SDK: schema-validated JSON. Use for extraction, classification.
  streamObject       AI SDK: partial JSON streamed progressively.
  tool()             AI SDK: function definition the LLM can invoke.
  maxSteps           AI SDK: max tool-call→result cycles before forcing final response.

  Agent              Mastra: named entity — instructions, model, tools, memory.
  instructions       The agent's contract. Injected as system prompt on every call.
  Memory             Mastra: persists messages per threadId. Pluggable storage.
  threadId           Identifies one conversation thread.
  resourceId         Scopes threads to a user/org. Prevents cross-user leakage.
  semanticRecall     Vector-search older history for relevant context beyond recency.
  workingMemory      LLM-maintained summary of key facts. Reduces context bloat.
  Workflow           Mastra: typed steps in defined order. Deterministic, auditable.
  createStep         One step: inputSchema → execute fn → outputSchema.
  .then()            Chain steps sequentially. Previous output = next input.
  .parallel([])      Run multiple steps concurrently, merge outputs.
  Mastra{}           Container. Holds agents + workflows. Provides dependency injection.
```
