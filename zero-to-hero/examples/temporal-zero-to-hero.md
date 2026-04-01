# Zero to Hero: Temporal

> pace: slow | depth: normal | analogy: restaurant kitchen (Chapter 0 only)

Why workflows break in production → What Temporal is → Building blocks → How it survives crashes → Core patterns → AI agents on Temporal

---

## Chapter 0: The Mental Model

Before any code, you need one picture in your head. A workflow is a **sequence of steps that must all complete reliably, even if things go wrong in between**. Everything in this guide maps to a restaurant kitchen analogy.

```
  RESTAURANT WORLD               TECHNICAL WORLD
  ================               ===============

  Order ticket                -->  Workflow state / event history
  Kitchen steps (prep, cook)  -->  Activities (units of real work)
  The chef                    -->  Worker (executes the steps)
  Head chef calling out steps -->  Workflow (orchestration — who does what, when)
  Calling an API, writing to DB -> Activity (where all side effects live)
  Kitchen system tracking order -> Temporal (coordinates, records, retries)
  "Where is my order?"         -->  Query (read workflow state)
  "Change to medium-rare!"     -->  Signal (send new info to running workflow)
  New chef picks up mid-order  -->  Replay (resume from crash without re-doing work)
```

**Four things to understand before moving on:**

- **The order ticket doesn't live in the chef's head.** If the chef gets sick at step 4, a new chef picks up from step 4 — steps 1–3 don't re-run because they're already on the ticket.
- **Chefs only cook.** The kitchen system (Temporal) decides which chef gets which task, retries if a chef fails, and tracks every step. Chefs do not manage their own recovery.
- **Orchestration and execution are separate.** The head chef calling out steps is not the same as the line cook doing the work. In Temporal: Workflow = head chef (deterministic coordination), Activity = line cook (actual I/O work).
- **You get the full history.** Every step, every result, every failure — recorded. "What happened at 2pm?" is answerable without log archaeology.

That's the analogy. The rest of this guide is technical.

---

## Chapter 1: What is Durable Execution?

### What you see from the outside

You write an order-processing function: validate payment, reserve inventory, send confirmation email. You deploy it. Under normal conditions, it works perfectly.

Then production hits. The third step — the email API — times out during a spike. Your function crashes with 1,000 requests in flight. Your database has half-processed orders, no way to know which steps completed. Do you re-run everything? Some customers get charged twice. Do you do nothing? Some customers never get their confirmation.

You add retry logic. Then exponential backoff. Then a dead-letter queue. Then idempotency keys. Then a state persistence layer so you can resume. Then monitoring. Six months later, your "order processing" function is 80% infrastructure glue and 20% business logic.

**Temporal's answer:** write your business logic as plain code. Temporal makes it durable — guaranteed to run to completion regardless of crashes, timeouts, or restarts.

### What is Temporal?

Temporal is a **durable execution platform**. You write multi-step business logic as ordinary functions. Temporal records every step, retries failures automatically, and resumes from the exact point of failure after a crash — without you writing any recovery code.

**Why it exists:** Every reliable distributed system needs the same infrastructure: retries, state persistence, timeout handling, idempotency, observability. Without Temporal, each team builds this from scratch, differently, and incorrectly. Temporal absorbs all of it. You focus on what your workflow actually does.

**How it works conceptually:** Every time an activity (a unit of work) completes, Temporal records that result in a persistent event history. If your process crashes and restarts, Temporal replays your workflow code against that history — completed activities return their cached results without re-executing. Your code "fast-forwards" to the exact point it was interrupted and continues from there.

```
  Without Temporal                       With Temporal
  ────────────────                       ─────────────

  Your business logic                    Your business logic
  + retry logic                          Done.
  + exponential backoff
  + idempotency keys
  + state persistence
  + timeout handling
  + rollback / compensation logic
  + dead-letter queue
  + observability / alerting
```

> **Metaphor:** Temporal is like a flight data recorder for your code. Every step is written to the black box. If the plane (server) goes down, investigators (the next worker) can reconstruct exactly what happened and continue from the last known good state — no step re-runs, no guessing.

### The three superpowers

```
  ┌──────────────────────────────────────────────────────────────────┐
  │  1. DURABLE STATE                                                │
  │     After each step, the result is saved to event history.       │
  │     Crash after step 3? Resume at step 4 with step 3's result.   │
  │     No manual checkpointing. No database columns for progress.   │
  ├──────────────────────────────────────────────────────────────────┤
  │  2. AUTOMATIC RETRIES                                            │
  │     Activity failed? Temporal retries with configurable backoff. │
  │     You declare the policy (max attempts, interval, timeout).    │
  │     Temporal executes it. You never write retry loops again.     │
  ├──────────────────────────────────────────────────────────────────┤
  │  3. FULL VISIBILITY                                              │
  │     Where is this workflow? What step? When did step 2 finish?   │
  │     Why did step 3 fail? What were its inputs and outputs?       │
  │     Full event history in the Temporal UI — every step, forever. │
  └──────────────────────────────────────────────────────────────────┘
```

**What Temporal is — and is not:**

```
  ┌─────────────────────────────────────────┬──────────────────────────────────────┐
  │  Temporal IS                            │  Temporal is NOT                     │
  ├─────────────────────────────────────────┼──────────────────────────────────────┤
  │  Durable execution — code survives      │  A message queue (Kafka, RabbitMQ)   │
  │  crashes                                │                                      │
  │  Workflow orchestrator — multi-step,    │  A cron scheduler (Quartz, Airflow)  │
  │  long-running                           │                                      │
  │  Reliability layer — retries, timeouts  │  A database — stores state only      │
  │  Visibility system — full event history │  A microservice framework            │
  │  State machine in code — if/else/loops, │  A BPM/ESB — no drag-drop, no YAML   │
  │  no YAML DSLs                           │  state machines                      │
  └─────────────────────────────────────────┴──────────────────────────────────────┘
```

### Setup

```bash
npm install @temporalio/client @temporalio/worker @temporalio/workflow @temporalio/activity
```

Run Temporal Server locally via Docker (includes the Web UI at `localhost:8080`):

```bash
docker run -d --name temporal \
  -p 7233:7233 -p 8080:8080 \
  temporalio/auto-setup:latest
```

---

**Scenario check:** Your payment processing function fails halfway — payment was charged but the confirmation email never sent. You have 500 orders in this state. Without Temporal, what would you need to build to recover? With Temporal, what happens?

> **Answer:** Without Temporal, you'd need: a database column tracking "what step was last completed", a recovery job that queries incomplete orders, idempotency logic to avoid charging twice, manual retry code with backoff, and monitoring to detect and alert. With Temporal, the workflow resumes from the exact step that failed — the payment activity already ran and its result is in the event history; Temporal does not re-run it. The email activity runs for the first time. You write zero recovery code.

```
  Temporal = durable execution platform
  ├── Core idea:    record every step result; resume from last checkpoint on crash
  ├── What you get: retries, timeouts, visibility, compensation — all built-in
  ├── Key tradeoff: workflow code must be deterministic (explained in Chapter 3)
  └── Used by:      OpenAI (ChatGPT image gen), Netflix, Stripe, Datadog
```

---

## Chapter 2: The Four Building Blocks

### What you see from the outside

You have a workflow running in production. A human needs to review and approve a generated plan before execution continues. While it waits, you want to be able to ask "what's the current plan?" from another service. And you need a way to inject the approval decision back in.

That requires four things: a durable function that can wait, a way to do actual I/O work, a way to receive the approval, and a way to answer status queries. These map exactly to Temporal's four building blocks.

### What are the four building blocks?

Every Temporal application is built from four primitives. Understanding the boundaries between them is the core mental model.

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  1. WORKFLOW  = The Orchestration Brain                             │
  │     ─────────                                                       │
  │     "Call these activities in this order, handle the results,       │
  │      loop if needed, wait for signals, respond to queries."         │
  │     • MUST be deterministic — no I/O, no randomness, no Date.now() │
  │     • State survives crashes via event history replay               │
  │     • Can run for seconds, hours, or years                          │
  │                                                                     │
  │  2. ACTIVITY  = The Hands (Actual Work)                             │
  │     ────────                                                        │
  │     "Call this API", "write to this database", "send this email"   │
  │     • CAN do I/O — this is the ONLY place side effects live         │
  │     • Automatically retried on failure (configurable policy)        │
  │     • Each execution recorded in event history                      │
  │                                                                     │
  │  3. SIGNAL    = External Input (Fire-and-Forget)                    │
  │     ──────                                                          │
  │     "User approved the plan", "new data arrived", "cancel this"    │
  │     • Async message INTO a running workflow                         │
  │     • Sender does not wait for a response                           │
  │     • Workflow uses condition() to block until signal arrives       │
  │                                                                     │
  │  4. QUERY     = Status Check (Read-Only)                            │
  │     ─────                                                           │
  │     "What step is this on?", "What's the current plan?"            │
  │     • Sync read FROM a running workflow                             │
  │     • Returns immediately with current workflow state               │
  │     • Cannot mutate state — read-only                               │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

> **Metaphor for the split:** The Workflow is a **conductor** of an orchestra. The conductor does not play any instruments — they coordinate who plays when and in what order. The Activity is a **section player** (the violins, the brass). They do the actual work. The conductor calling out cues is orchestration. The section playing their part is execution.

**Why is this split necessary?** For durable execution to work, Temporal must be able to replay your workflow after a crash. Replay means re-running your workflow function against recorded history. If the workflow called an API directly, that API would get called again on replay — double charges, duplicate emails. The split ensures: orchestration is replayed safely (deterministic, no side effects), and work is never replayed (Activity results are replayed from history, not re-executed).

### The minimal working example

**You want to build a user onboarding flow** that sends a welcome email and creates a starter project. Two independent side effects, both must succeed.

First, the activities — the actual work:

```typescript
// src/activities.ts
import { Context } from '@temporalio/activity';

export async function sendWelcomeEmail(userId: string): Promise<void> {
  await emailClient.send({
    to: userId,
    template: 'welcome',
  });
}

export async function createStarterProject(userId: string): Promise<string> {
  const project = await db.projects.create({
    owner: userId,
    name: 'My First Project',
    template: 'starter',
  });
  return project.id;
}
```

Then the workflow — the orchestration:

```typescript
// src/workflows.ts
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

// proxyActivities wraps your activity functions with retry + timeout configuration
const { sendWelcomeEmail, createStarterProject } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',  // each activity must finish within 30s or retry
  retry: {
    maximumAttempts: 3,
    initialInterval: '1 second',
  },
});

export async function onboardUser(userId: string): Promise<string> {
  // orchestration only — no direct I/O
  await sendWelcomeEmail(userId);
  const projectId = await createStarterProject(userId);
  return projectId;
}
```

What this says in plain English:

- `proxyActivities(...)` — "create handles to my activity functions that Temporal will schedule, retry, and track"
- `startToCloseTimeout: '30 seconds'` — "if an activity doesn't finish within 30s, mark it failed and retry"
- `await sendWelcomeEmail(userId)` — "schedule this activity, wait for it to complete, record the result"
- The workflow function has no API calls, no `fetch`, no `Date.now()` — orchestration only

Wire it together with a Worker and a Client:

```typescript
// src/worker.ts
import { Worker } from '@temporalio/worker';
import * as activities from './activities';

const worker = await Worker.create({
  workflowsPath: require.resolve('./workflows'),
  activities,
  taskQueue: 'onboarding',
});

await worker.run();
```

```typescript
// src/client.ts
import { Client } from '@temporalio/client';
import { onboardUser } from './workflows';

const client = new Client();

const projectId = await client.workflow.execute(onboardUser, {
  taskQueue: 'onboarding',
  workflowId: `onboard-${userId}`,   // unique ID = natural idempotency
  args: [userId],
});
```

### Signals and Queries

**You want to add human-in-the-loop approval.** The workflow generates a plan, then waits for a human to approve it before executing. While it waits, a dashboard polls "what's the current plan?" to display it.

```typescript
// src/workflows.ts
import { proxyActivities, defineSignal, defineQuery, setHandler, condition } from '@temporalio/workflow';
import type * as activities from './activities';

const { generatePlan, executePlan } = proxyActivities<typeof activities>({
  startToCloseTimeout: '60 seconds',
});

// Define the signal and query contracts
export const approvalSignal = defineSignal<[boolean]>('approval');
export const currentPlanQuery = defineQuery<Plan | null>('currentPlan');

export async function planApprovalWorkflow(brief: Brief): Promise<Result> {
  let plan: Plan | null = null;
  let decision: boolean | null = null;

  // Register handlers — these run when a signal or query arrives
  setHandler(approvalSignal, (approved: boolean) => {
    decision = approved;
  });

  setHandler(currentPlanQuery, () => plan);

  // Step 1: generate the plan (Activity)
  plan = await generatePlan(brief);

  // Step 2: PARK — costs nothing, could wait hours or days
  // condition() unblocks as soon as decision is no longer null
  await condition(() => decision !== null);

  if (!decision) {
    throw new Error('Plan rejected');
  }

  // Step 3: execute the approved plan (Activity)
  return await executePlan(plan);
}
```

Sending a signal and querying state from another service:

```typescript
// Send approval from an HTTP endpoint, Slack bot, etc.
const handle = client.workflow.getHandle('plan-approval-workflow-001');

// Signal — fire and forget
await handle.signal(approvalSignal, true);

// Query — sync read, returns immediately
const currentPlan = await handle.query(currentPlanQuery);
```

```
  YOUR CODE          CLIENT            TEMPORAL SERVER        WORKER
      │                 │                    │                   │
      │── start() ─────►│                    │                   │
      │                 │── start workflow ──►│                   │
      │                 │                    │── dispatch ───────►│
      │                 │                    │                    │ generates plan
      │                 │                    │◄── completed ──────│
      │                 │                    │  PARKED: awaiting signal
      │── query() ─────►│                    │                   │
      │                 │── getState ────────►│── currentPlan ───►│
      │                 │◄── Plan{...} ───────│◄── Plan{...} ─────│
      │── signal() ────►│                    │                   │
      │                 │── approved=true ───►│                   │
      │                 │                    │── dispatch ───────►│
      │                 │                    │                    │ executes plan
      │                 │                    │◄── completed ──────│
```

---

**Scenario check:** Your approval workflow has been parked waiting for a human decision for 3 days. Your server gets rebooted for a routine maintenance window. When it comes back up, what happens to the workflow, and does the waiting time "reset"?

> **Answer:** Nothing is lost. The workflow's state — including the `plan` it generated, the signal handler registered, and the fact that it is waiting — is stored in Temporal's event history, not in your server's memory. When the new worker starts, it replays the workflow to the current state (plan generated, waiting for signal) in milliseconds. The 3-day wait continues from where it was — no reset, no lost state. The human approves, the signal arrives, and the workflow continues exactly as expected.

```
  Building blocks:
  ├── Workflow    Orchestration. Deterministic. No I/O. Durable.
  ├── Activity    Work. I/O allowed. Auto-retried. Results recorded.
  ├── Signal      Async input into a running workflow. Fire-and-forget.
  └── Query       Sync read from a running workflow. Read-only.
```

---

## Chapter 3: How Replay Works

### What you see from the outside

You start a workflow. It runs three activities. Your server crashes after the second activity. A new worker starts. The workflow picks up at the third activity — the first two results are already available, and neither API was called again. No duplicate charges. No duplicate emails.

This is not magic. It is the result of one mechanism: **replay**.

### What is replay?

Temporal records every event in your workflow as an ordered list called the **event history**. When a worker crashes and a new one picks up, Temporal does not restart the workflow from scratch. Instead, it replays your workflow function against the event history — returning cached results for activities that already ran, without re-executing them.

> **Metaphor:** Replay is like a court reporter reading back the transcript. The hearing continues — same judge, same rules — but the record shows exactly what was already established. The witnesses who already testified do not testify again. The hearing resumes where it left off.

### First execution (happy path)

```
  Workflow Code                         Event History (persisted to Temporal Server)
  ─────────────                         ──────────────────────────────────────────

  onboardUser(userId) starts      →     1: WorkflowExecutionStarted

  sendWelcomeEmail(userId)        →     2: ActivityScheduled { sendWelcomeEmail }
    worker calls your email API   →     3: ActivityCompleted { result: void }

  createStarterProject(userId)    →     4: ActivityScheduled { createStarterProject }
    worker calls your DB          →     5: ActivityCompleted { result: "proj-abc" }

  return "proj-abc"               →     6: WorkflowExecutionCompleted
```

### After a crash (the magic)

```
  Server crashes after event 3. New worker starts. Temporal replays:

  Workflow Code                         Event History
  ─────────────                         ─────────────

  onboardUser(userId) starts      →     1: ✓ match

  sendWelcomeEmail(userId)        →     3: ✓ match — returns CACHED result
                                         (email API NOT called again!)

  createStarterProject(userId)    →     No event for this! NEW work starts here.
                                   →     4: ActivityScheduled
                                   →     5: ActivityCompleted { result: "proj-abc" }

  return "proj-abc"               →     6: WorkflowExecutionCompleted

  KEY: Activities that already ran are NOT re-executed.
  Their results are replayed from history. No duplicate side effects.
```

### Why determinism is the hard rule

For replay to work, your workflow must make the **same decisions** on replay as it made on first execution. If it branches differently, Temporal cannot match workflow code to event history — and the workflow crashes with a `NonDeterministicWorkflowError`.

> **Metaphor:** Determinism is the difference between cooking from a recipe and improvising. If two chefs use the same recipe with the same ingredients, they produce the same dish. Temporal needs the same "recipe" on every replay. If a chef improvises differently each time, the kitchen cannot guarantee anything.

**Common non-determinism traps:**

```
  // ❌ BAD: Date.now() changes on replay
  if (Date.now() > deadline) {
    await sendReminder(userId);
  }

  // ✅ GOOD: Temporal's deterministic time
  import { now } from '@temporalio/workflow';
  if (now() > deadline) {
    await sendReminder(userId);
  }

  // ❌ BAD: Math.random() produces different values
  const variant = Math.random() > 0.5 ? 'A' : 'B';

  // ✅ GOOD: Pass randomness in from outside (via workflow args or activity result)
  const variant = await assignVariant(userId);   // activity records the result

  // ❌ BAD: Direct API call inside a workflow
  const user = await fetch('/api/users/' + userId).then(r => r.json());

  // ✅ GOOD: Put all I/O in activities
  const user = await fetchUser(userId);  // activity, recorded and cached
```

**The golden rule:**

```
  ╔══════════════════════════════════════════════════════════════╗
  ║  IN WORKFLOWS (orchestration):      IN ACTIVITIES (work):   ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  ❌ No fetch / API calls            ✅ API calls            ║
  ║  ❌ No database queries             ✅ Database queries      ║
  ║  ❌ No Math.random()                ✅ Math.random()        ║
  ║  ❌ No Date.now()                   ✅ Date.now()           ║
  ║  ❌ No setTimeout()                 ✅ Any async I/O        ║
  ║  ✅ sleep() from @temporalio/workflow                       ║
  ║  ✅ condition() from @temporalio/workflow                   ║
  ║  ✅ if/else on activity results                             ║
  ║  ✅ Loops, state variables, data transformation             ║
  ╚══════════════════════════════════════════════════════════════╝
```

### Timeout model

Every Activity needs at least a `startToCloseTimeout`. These stack inside a workflow execution timeout:

```
  Workflow Execution Timeout (overall — can be years)
  └── Activity: scheduleToCloseTimeout (total, optional)
      ├── scheduleToStartTimeout (waiting for a worker to pick up)
      └── startToCloseTimeout (executing — REQUIRED if no scheduleToClose)
          └── heartbeatTimeout (liveness check for long-running activities)

  Rule of thumb for common cases:
  ├── Short API call:       startToCloseTimeout: '30 seconds'
  ├── LLM API call (slow):  startToCloseTimeout: '2 minutes'
  └── File upload:          startToCloseTimeout: '10 minutes' + heartbeat every 30s
```

---

**Scenario check:** You add `console.log(Math.random())` inside your workflow function for debugging. Tests pass. In production, after a server crash, the workflow fails with `NonDeterministicWorkflowError`. Why, and what's the fix?

> **Answer:** `Math.random()` produces a different value on every execution. During replay, the new worker runs the workflow code again to fast-forward to the crash point. The `Math.random()` call produces a different value than it did originally — but the event history has no record of this call's output, so Temporal cannot verify that the workflow is behaving identically. The fix: move any non-deterministic operation (randomness, current time, external data) into an Activity, whose result is recorded and returned identically on replay.

```
  Replay:
  ├── Mechanism:    re-run workflow code against event history on crash
  ├── Result:       cached activity results returned, APIs not called again
  ├── Requirement:  workflow must be deterministic — same inputs = same decisions
  └── Practical:    all I/O goes in Activities. Workflows only orchestrate.
```

---

## Chapter 4: Core Patterns

### What you see from the outside

Real applications need more than a simple sequential pipeline. Orders need compensation if they fail halfway. Reports need data from three systems fetched simultaneously. Approval processes need to pause for hours or days. Subscriptions need to check in monthly without running a server continuously.

Temporal has well-established patterns for all of these.

---

### Pattern 1: Saga — Compensating Transactions

**You want to build an order checkout flow:** reserve inventory → charge payment → ship order. If shipping fails, you must undo the charge and the reservation — in reverse order.

Without a framework, compensation is a mess of manual rollback code. The Saga pattern structures it: as each step succeeds, register its compensation function. If any step fails, run compensations in reverse.

> **Metaphor:** A Saga is a surgeon's pre-op checklist with a reversal procedure for every step. Before making any incision, you know exactly how to undo it. The sequence runs forward step by step. If anything goes wrong, the team reverses the steps in order.

```typescript
// src/workflows.ts
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { reserveInventory, chargePayment, shipOrder,
        cancelReservation, refundPayment } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: { maximumAttempts: 3 },
});

export async function checkoutWorkflow(order: Order): Promise<void> {
  const compensations: Array<() => Promise<void>> = [];

  try {
    await reserveInventory(order);
    compensations.push(() => cancelReservation(order));  // register undo

    await chargePayment(order);
    compensations.push(() => refundPayment(order));      // register undo

    await shipOrder(order);  // if this fails, compensations run
  } catch (err) {
    // compensate in reverse order — refund first, then cancel reservation
    for (const compensate of [...compensations].reverse()) {
      await compensate();
    }
    throw err;
  }
}
```

```
  reserveInventory ──✅──► chargePayment ──✅──► shipOrder ──❌ FAIL
                                                               │
                                                               ▼
                                               refundPayment  (undo step 2)
                                               cancelReservation (undo step 1)
```

---

### Pattern 2: Fan-Out / Fan-In — Parallel Execution

**You want to build a dashboard that aggregates user profile, order history, and preferences** — three independent data sources. Fetching them sequentially wastes time: 300ms + 200ms + 150ms = 650ms. Fetching them in parallel: max(300ms, 200ms, 150ms) = 300ms.

> **Metaphor:** Fan-out is a manager distributing tasks to a team simultaneously. Each team member runs their task independently. The manager waits for all to finish (fan-in), then uses all the results together.

```typescript
// src/workflows.ts
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { fetchUserProfile, fetchOrderHistory, fetchPreferences, assembleDashboard } =
  proxyActivities<typeof activities>({ startToCloseTimeout: '10 seconds' });

export async function dashboardWorkflow(userId: string): Promise<Dashboard> {
  // Fan-out: all three start simultaneously
  const [profile, orders, preferences] = await Promise.all([
    fetchUserProfile(userId),
    fetchOrderHistory(userId),
    fetchPreferences(userId),
  ]);

  // Fan-in: all three completed, now assemble
  return await assembleDashboard({ profile, orders, preferences });
}
```

```
  start
    │
    ├── fetchUserProfile ──────┐
    ├── fetchOrderHistory ─────┼──▶  all finish  ──▶  assembleDashboard
    └── fetchPreferences ──────┘
         (each runs in parallel, independently retried)
```

---

### Pattern 3: Human-in-the-Loop — Signal + condition()

**You want an AI content generation workflow** that generates a plan, shows it to a human reviewer, and only executes after explicit approval. The review could take minutes or hours. The workflow must not block a server thread while it waits.

`condition()` in Temporal is a durable park — the workflow suspends consuming zero resources until the condition becomes true.

> **Metaphor:** A purchase order requiring a manager's signature. The purchase order (workflow) is created, placed in the manager's inbox (parked). It sits there — consuming no desk space, no electricity — until the manager signs it (signal arrives). Only then does procurement proceed.

```typescript
// src/workflows.ts
import { proxyActivities, defineSignal, defineQuery, setHandler, condition } from '@temporalio/workflow';
import type * as activities from './activities';

const { generateContentPlan, executeContentPlan } =
  proxyActivities<typeof activities>({ startToCloseTimeout: '2 minutes' });

export const reviewDecisionSignal = defineSignal<[{ approved: boolean; feedback?: string }]>('reviewDecision');
export const currentPlanQuery = defineQuery<ContentPlan | null>('currentPlan');

export async function contentGenerationWorkflow(brief: ContentBrief): Promise<ContentResult> {
  let plan: ContentPlan | null = null;
  let decision: { approved: boolean; feedback?: string } | null = null;

  setHandler(reviewDecisionSignal, (d) => { decision = d; });
  setHandler(currentPlanQuery, () => plan);

  // Step 1: generate plan
  plan = await generateContentPlan(brief);

  // Step 2: park — wait for human. No resources consumed.
  // Could wait seconds, hours, or days. Survives server restarts.
  await condition(() => decision !== null);

  if (!decision!.approved) {
    throw new Error(`Plan rejected: ${decision!.feedback}`);
  }

  // Step 3: execute
  return await executeContentPlan(plan);
}
```

```
  Timeline:
  ──────────────────────────────────────────────────────────►

  │                     │                      │
  ▼ generatePlan        ▼ human reviews plan    ▼ signal: approved = true
  (Activity, ~30s)      (Query: currentPlan)    workflow continues
                        (could be hours)        → executeContentPlan
```

---

### Pattern 4: Long-Running with Durable Timer

**You want to send a follow-up email 7 days after signup if the user hasn't activated.** Without Temporal, you'd need a cron job scanning a database column. With Temporal, `sleep()` is durable — it costs nothing to wait, and it survives server restarts.

> **Metaphor:** A post-dated letter. You write it today, seal it, address it for delivery in 7 days. You don't have to hold it or check in — the postal service (Temporal) delivers it at the right time regardless of what you're doing.

```typescript
// src/workflows.ts
import { proxyActivities, sleep, condition } from '@temporalio/workflow';
import type * as activities from './activities';
import { Duration } from '@temporalio/workflow';

const { sendActivationReminder, sendEscalationEmail, checkActivated } =
  proxyActivities<typeof activities>({ startToCloseTimeout: '30 seconds' });

export const activatedSignal = defineSignal('activated');

export async function activationFollowUpWorkflow(userId: string): Promise<void> {
  let activated = false;
  setHandler(activatedSignal, () => { activated = true; });

  // Wait 7 days. No server resources consumed during this time.
  // If server restarts, sleep resumes from where it left off.
  const didActivate = await condition(() => activated, '7 days');

  if (!didActivate) {
    // 7 days passed and user never activated
    await sendActivationReminder(userId);

    // Check again after 3 more days
    const activatedAfterReminder = await condition(() => activated, '3 days');

    if (!activatedAfterReminder) {
      await sendEscalationEmail(userId);
    }
  }
}
```

---

### Pattern 5: Child Workflows — Decomposition

**You need to sync 10,000 users.** Running a single workflow for all of them creates a massive event history. The solution: one parent workflow that spawns one child workflow per user. Each child has its own isolated history, its own retry policy, and its own failure domain — if user 4,521 fails, users 1–4,520 are unaffected.

```typescript
// src/workflows.ts
import { executeChild } from '@temporalio/workflow';

export async function syncAllUsersWorkflow(userIds: string[]): Promise<void> {
  // Fan-out: start one child workflow per user, run in parallel
  await Promise.all(
    userIds.map((userId) =>
      executeChild(syncSingleUserWorkflow, {
        workflowId: `sync-user-${userId}`,   // unique ID per user
        args: [userId],
      })
    )
  );
}

export async function syncSingleUserWorkflow(userId: string): Promise<void> {
  const userData = await fetchUser(userId);
  await pushToTarget(userData);
}
```

```
  SyncAllUsersWorkflow
       │
       ├── syncSingleUser-001  (own history, own retries, isolated)
       ├── syncSingleUser-002
       ├── syncSingleUser-003
       │   ...
       └── syncSingleUser-N
                │
                └── all complete → parent workflow completes
```

---

**Scenario check:** You use `Workflow.sleep()` for a 30-day billing cycle. Your company migrates to new servers halfway through the cycle. A developer worries the sleep timer was "lost" in the migration. Was it?

> **Answer:** No. `sleep()` in Temporal is not a `setTimeout()` running in your server's memory — it is a durable timer stored in Temporal Server's own database. When the new servers start and workers reconnect, the timer continues from where it was. The 30-day wait is a record in Temporal's persistent state, not a thread or process on your server. Migrating servers has zero effect on running workflow timers.

```
  Core patterns:
  ├── Saga              Compensating transactions — register undos, run on failure
  ├── Fan-out/Fan-in    Parallel activities with Promise.all(), merge results
  ├── Human-in-loop     Signal + condition() — park with zero resource cost
  ├── Durable Timer     sleep() — survives restarts, no cron job needed
  └── Child Workflows   Decompose large workflows, isolated failure domains
```

---

## Chapter 5: Temporal for AI Agents

### What you see from the outside

You build an AI agent: it calls an LLM, the LLM decides to use a tool, the tool runs, the result goes back to the LLM, the LLM replies. Simple in a demo. In production, after 48 hours running continuously:

- The LLM API rate-limits you at 3am — your agent dies.
- A tool call fails with a transient error — the entire agent loop is lost.
- The LLM takes 90 seconds to reply — your server's HTTP timeout kills the request.
- The agent is mid-task when your server deploys — conversation context is gone.
- A user closes their browser and comes back an hour later — agent has no memory of what it was doing.

Every one of these problems has the same root cause: raw agent code is not durable. The solution: run the agent loop as a Temporal workflow.

### Why agents need Temporal

```
  ┌───────────────────────────────────────┬────────────────────────────────────────┐
  │  PROBLEM                              │  TEMPORAL SOLUTION                     │
  ├───────────────────────────────────────┼────────────────────────────────────────┤
  │  LLM API times out (30–90s)           │  startToCloseTimeout + auto-retry      │
  │  LLM API rate-limits you              │  Retry with exponential backoff        │
  │  Tool execution fails                 │  Activity retry — agent loop resumes   │
  │  Server crashes mid-conversation      │  Replay — resumes from last LLM call   │
  │  Need human approval before a tool    │  Signal + condition() — park and wait  │
  │  Want parallel LLM calls             │  Promise.all() on activity proxies     │
  │  "What step is the agent on?"         │  Query — read current agent state      │
  │  No duplicate LLM calls on crash      │  Activity results cached in history    │
  └───────────────────────────────────────┴────────────────────────────────────────┘
```

**OpenAI uses Temporal for ChatGPT's image generation and Codex** — production AI systems at scale.

### The agent loop as a Temporal workflow

Every AI agent is fundamentally a loop:

```
  ┌──────────────┐
  │    START      │
  └──────┬───────┘
         ▼
  ┌──────────────────┐ ◄────────────────┐
  │  Call LLM with    │                  │
  │  context + tools  │                  │
  └───────┬──────────┘                  │
          │                             │
          ▼                             │
  ┌──────────────────┐                  │
  │  LLM response:   │                  │
  │  tool_call?      │                  │
  │  final_answer?   │                  │
  └──┬───────────┬───┘                  │
     │           │                      │
  tool_call   final_answer             │
     │           │                      │
     ▼           ▼                      │
  ┌──────────┐  ┌────────┐             │
  │ Execute  │  │ RETURN │             │
  │ Tool     │  │ result │             │
  │(Activity)│  └────────┘             │
  └────┬─────┘                         │
       │  tool result added to context  │
       └───────────────────────────────┘

  In Temporal terms:
  • The LOOP          = Workflow (deterministic orchestration)
  • Each LLM CALL     = Activity (I/O, retryable, recorded)
  • Each TOOL CALL    = Activity (I/O, retryable, recorded)
  • CONTEXT / STATE   = Workflow instance variables (durable)
  • HUMAN APPROVAL    = Signal + condition() (pause and resume)
  • "What step?"      = Query (read state without mutation)
```

### The complete agent loop implementation

**You want to build a durable AI agent** that calls an LLM in a loop, executes tools when requested, and resumes exactly from its last LLM call if anything fails:

```typescript
// src/activities.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export interface LLMResponse {
  type: 'tool_call' | 'final_answer';
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  text?: string;
}

export async function callLLM(
  messages: Anthropic.MessageParam[],
  tools: Anthropic.Tool[]
): Promise<LLMResponse> {
  // This is an Activity — Temporal retries it automatically on timeout or error.
  // If the Anthropic API takes 90s, Temporal waits up to startToCloseTimeout.
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6-20250514',
    max_tokens: 4096,
    messages,
    tools,
  });

  const block = response.content[0];

  if (block.type === 'tool_use') {
    return { type: 'tool_call', toolName: block.name, toolArgs: block.input as Record<string, unknown> };
  }

  return { type: 'final_answer', text: response.content.find(b => b.type === 'text')?.text };
}

export async function executeTool(toolName: string, args: Record<string, unknown>): Promise<string> {
  // Your tool logic — database queries, API calls, file reads, etc.
  return await toolRegistry.execute(toolName, args);
}
```

```typescript
// src/workflows.ts
import { proxyActivities, defineQuery, setHandler } from '@temporalio/workflow';
import type * as activities from './activities';
import type Anthropic from '@anthropic-ai/sdk';

const { callLLM, executeTool } = proxyActivities<typeof activities>({
  startToCloseTimeout: '3 minutes',  // WHY: LLM calls can be slow
  retry: {
    maximumAttempts: 3,
    initialInterval: '2 seconds',
    backoffCoefficient: 2,
  },
});

export const agentStatusQuery = defineQuery<{ status: string; steps: number }>('agentStatus');

export async function agentWorkflow(userPrompt: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userPrompt }
  ];

  let steps = 0;
  let status = 'RUNNING';

  setHandler(agentStatusQuery, () => ({ status, steps }));

  // The agent loop — runs as a Temporal workflow
  // Every LLM call and tool call is a durable, retryable Activity.
  // If this crashes at any point, replay resumes from the last completed Activity.
  while (true) {
    steps++;
    const response = await callLLM(messages, availableTools);
    messages.push({ role: 'assistant', content: response.text ?? '' });

    if (response.type === 'tool_call') {
      const toolResult = await executeTool(response.toolName!, response.toolArgs!);
      messages.push({ role: 'user', content: toolResult });
      // Loop back — call LLM again with tool result in context
    } else {
      // LLM returned a final answer
      status = 'COMPLETED';
      return response.text!;
    }
  }
}
```

What makes this different from a raw agent loop:

```
  Raw agent loop                         Temporal agent loop
  ──────────────                         ───────────────────
  LLM API fails → agent dies             LLM call is Activity → auto-retried
  Server crashes → context lost          Workflow state is durable → replays
  LLM takes 90s → HTTP timeout           startToCloseTimeout: '3 min' handles it
  "What step?" → check logs              Query returns status + step count instantly
  Duplicate LLM calls on restart         Activity results cached → no duplicates
```

### Adding human-in-the-loop to an agent

**You want the agent to pause before executing high-risk tool calls** (e.g., sending emails, making purchases) and wait for human approval:

```typescript
// src/workflows.ts
import { proxyActivities, defineSignal, defineQuery, setHandler, condition } from '@temporalio/workflow';

export const approveToolCallSignal = defineSignal<[boolean]>('approveToolCall');
export const pendingApprovalQuery = defineQuery<{ toolName: string; args: unknown } | null>('pendingApproval');

const HIGH_RISK_TOOLS = new Set(['sendEmail', 'makePayment', 'deleteRecord']);

export async function agentWithApprovalWorkflow(userPrompt: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userPrompt }];
  let pendingTool: { toolName: string; args: Record<string, unknown> } | null = null;
  let approved: boolean | null = null;

  setHandler(approveToolCallSignal, (decision: boolean) => { approved = decision; });
  setHandler(pendingApprovalQuery, () => pendingTool);

  while (true) {
    const response = await callLLM(messages, availableTools);
    messages.push({ role: 'assistant', content: response.text ?? '' });

    if (response.type === 'tool_call') {
      if (HIGH_RISK_TOOLS.has(response.toolName!)) {
        // Park — show pending tool to human reviewer, wait for decision
        pendingTool = { toolName: response.toolName!, args: response.toolArgs! };
        approved = null;
        await condition(() => approved !== null);

        if (!approved) {
          return 'Tool call rejected by reviewer.';
        }
        pendingTool = null;
      }

      const toolResult = await executeTool(response.toolName!, response.toolArgs!);
      messages.push({ role: 'user', content: toolResult });
    } else {
      return response.text!;
    }
  }
}
```

---

**Scenario check:** Your agent calls the LLM, receives a tool call request, and your server crashes before the tool executes. When the new worker starts and replays the workflow, does the LLM get called again?

> **Answer:** No. The LLM call was an Activity — its result (the tool call request) was recorded in the event history when it completed. During replay, Temporal sees the `ActivityCompleted` event for `callLLM` and returns the cached result without calling Anthropic's API again. The tool call then executes for the first time (no prior event for it), and the workflow continues forward. This is the core value: no duplicate LLM tokens consumed, no duplicate tool side effects, exact resume from failure point.

```
  AI Agent on Temporal:
  ├── LLM call       → Activity (retried on timeout, result cached in history)
  ├── Tool call      → Activity (retried on failure, result cached in history)
  ├── Agent loop     → Workflow (durable, replays cleanly after crash)
  ├── Agent state    → Workflow variables (survives restarts)
  ├── Human review   → Signal + condition() (park mid-loop, wait, resume)
  └── "What step?"   → Query (read status without interrupting the loop)
```

---

## Chapter 6: Side by Side

### When does Temporal make sense?

```
  ┌──────────────────────────────────────────────────────────────────┐
  │  USE TEMPORAL WHEN:                                              │
  │  ──────────────────                                              │
  │  • Your process has 3+ steps that must all complete reliably    │
  │  • Any step can fail and you need to retry or compensate        │
  │  • You need to wait for a human decision (hours, days)          │
  │  • A crash mid-process would leave data in an inconsistent state│
  │  • You need to know "what step is this on?" at any moment       │
  │  • Any step takes longer than your HTTP server's timeout        │
  │                                                                  │
  │  DO NOT ADD TEMPORAL WHEN:                                       │
  │  ─────────────────────────                                       │
  │  • A single function call with a try/catch is sufficient        │
  │  • The process completes in under 2 seconds with no retries     │
  │  • There is no meaningful "state" between steps                 │
  │  • You are doing read-only queries with no side effects         │
  └──────────────────────────────────────────────────────────────────┘
```

### Comparison: Temporal vs traditional approaches

```
  ┌───────────────────────┬──────────────────────────────┬─────────────────────────────┐
  │  Need                 │  Traditional Approach         │  Temporal Approach          │
  ├───────────────────────┼──────────────────────────────┼─────────────────────────────┤
  │  State across steps   │  Save to DB after each step  │  Automatic (event history)  │
  │  Retry logic          │  Retry library + backoff      │  Declare RetryOptions       │
  │  Async coordination   │  Message queues (Kafka, SQS) │  Workflows coordinate direct│
  │  Scheduled work       │  Cron + DB polling            │  sleep() + Temporal Schedule│
  │  Timeout handling     │  Manual per-call              │  Built-in at every level    │
  │  Rollback / undo      │  Complex manual code          │  Saga pattern, 10 lines     │
  │  "What happened?"     │  Dig through logs             │  Full event history, UI     │
  │  Idempotency          │  Idempotency keys + dedup     │  workflowId = natural dedup │
  │  State machines       │  JSON/YAML definitions        │  Just write code            │
  └───────────────────────┴──────────────────────────────┴─────────────────────────────┘
```

### Decision guide

```
  What you need                                         Use
  ──────────────────────────────────────────────────────────────────────

  Multi-step process, any step can fail                 Temporal Workflow
  Undo completed steps if process fails                 Saga pattern
  Fetch from N sources simultaneously                   Fan-out with Promise.all()
  Wait for human decision (minutes to days)             Signal + condition()
  Send an email/check in 30 days from now               sleep() + Workflow timer
  Decompose 10k-item job into isolated units            Child Workflows
  AI agent loop that must survive server crashes        Workflow + Activity per call
  AI agent that needs human approval before tool        Signal + condition() in loop
  Read agent state without interrupting it              Query
```

---

## Glossary

```
  Workflow            Durable function that orchestrates activities. Must be deterministic.
                      Can run for seconds, hours, or years. Survives crashes via replay.

  Activity            Function that does real work (I/O, APIs, DB). Automatically retried.
                      Results recorded in event history. Never re-executed on replay.

  Worker              Process that polls Temporal and runs your workflow/activity code.
                      Scales horizontally. Pulls tasks via long-poll — server never pushes.

  Task Queue          Named channel routing tasks to the right workers.

  Event History       Ordered log of every event in a workflow: started, activity scheduled,
                      activity completed, signal received, workflow completed. Persisted.

  Replay              Re-running workflow code against event history after a crash.
                      Completed activities return cached results — no re-execution.

  Determinism         Requirement that workflow code makes the same decisions on every run.
                      Violation causes NonDeterministicWorkflowError on replay.

  Signal              Async message sent INTO a running workflow. Fire-and-forget.
                      Sender does not wait for a response.

  Query               Sync read FROM a running workflow. Read-only, returns immediately.
                      Cannot mutate state.

  condition()         Durable park in a workflow. Blocks until a condition becomes true.
                      Consumes no resources while waiting. Survives server restarts.

  sleep()             Durable timer in a workflow. Waits for a duration or until a signal.
                      Not setTimeout() — timer lives in Temporal Server, not your process.

  Saga                Pattern for compensating transactions. Register undo functions as each
                      step succeeds; run compensations in reverse if any step fails.

  Fan-out / Fan-in    Start multiple activities in parallel (Promise.all()), merge results.

  Child Workflow      Workflow spawned by another workflow. Isolated history, retry policy,
                      and failure domain. Used to decompose large jobs.

  startToCloseTimeout Per-Activity timeout: how long the execution can take once started.
                      Required unless scheduleToCloseTimeout is set. Triggers retry on expiry.

  workflowId          Unique identifier for a workflow run. Two workflows with the same ID
                      cannot run simultaneously — natural idempotency key.

  Namespace           Isolation boundary in Temporal (like a tenant). Separate history,
                      task queues, and visibility from other namespaces.
```
