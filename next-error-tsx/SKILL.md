---
name: next-error-tsx
description: Write Next.js App Router error.tsx (and global-error.tsx) so a thrown page does not dump the production digest screen. Auto-applies when creating or editing a data-fetching page.tsx that has no sibling error boundary. Triggered by /next-error-tsx.
user_invocable: true
---

# next-error-tsx

You write the files. The human never has to paste a template.

When a route segment throws, Next shows the digest overlay in production unless `error.tsx` exists. That is the bug. This skill is the file.

**Companion:** [next-loading-skeleton](../next-loading-skeleton) covers the blank wait. This covers the crash.

---

## When this applies

**Apply when:** creating or editing an App Router `page.tsx` that fetches or calls a server action; the user says error boundary, error.tsx, try again, digest screen, or "something went wrong"; a route has `loading.tsx` but no `error.tsx`.

**Do not apply when:** they want to catch a missing record (that is `notFound()` + `not-found.tsx`), they want to swallow an error in a try/catch and keep rendering, or they are on Pages Router.

---

## Workflow

You run every step.

1. Find the App Router root (`app/` or `src/app/`).
2. For the route you just touched, if `error.tsx` is missing, write it next to `page.tsx`.
3. If `app/global-error.tsx` is missing, write it. Root `layout.tsx` errors skip `error.tsx`.
4. If the route is dynamic (`[id]`, `[slug]`, …) and `not-found.tsx` is missing, write that too. A 404 is not a 500.
5. Match existing UI: same shell, spacing, and button component the page already uses. If `@/components/ui/button` exists, use it. Do not add shadcn as a new dependency just for this.
6. Do not show `error.message` or `error.digest` in the UI. Log the digest. Production messages leak internals; the digest is for logs.

---

## `error.tsx`

Must be a Client Component. Receives `{ error, reset }`. `reset()` re-renders the segment — wire it to the primary button.

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold tracking-tight">
        This page failed to load
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        A temporary fault. Try again. If it keeps happening, go back home.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
```

If there is no shadcn Button, use a native `<button>` and `<a href="/">`.

Copy: one sentence the user can act on. No "Oops!", no stack, no digest, no "contact support" unless the product already has a support URL.

---

## `global-error.tsx`

Place at `app/global-error.tsx` (or `src/app/global-error.tsx`). It **replaces the root layout**, so it must render `<html>` and `<body>`.

```tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ fontFamily: "system-ui, sans-serif", padding: 48, textAlign: "center" }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>The app failed to load</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>Try again. If it keeps happening, refresh the page.</p>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
```

Inline styles are fine here — the root layout (and Tailwind) may be the thing that crashed.

---

## `not-found.tsx` (dynamic routes only)

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold tracking-tight">Not found</h2>
      <p className="text-sm text-muted-foreground">That record is gone, or the link is wrong.</p>
      <Link href="/" className="text-sm underline">
        Home
      </Link>
    </div>
  );
}
```

In the page, call `notFound()` when the fetch returns empty. Do not throw a generic Error for a missing row.

---

## Rules the framework already decided

- `error.tsx` does **not** catch errors in its sibling `layout.tsx`. Those bubble to the parent `error.tsx`, or to `global-error.tsx` for the root layout.
- Do not wrap `redirect()`, `notFound()`, or other Next navigation throws in a try/catch without rethrowing. They are control flow, not failures.
- One `error.tsx` per segment you actually fetch in. Do not sprinkle empty error files on every folder.
- `loading.tsx` is a different file. If the page waits on data and has no loading UI, use `next-loading-skeleton`. Do not put a spinner inside `error.tsx`.

---

## Anti-patterns

- **Shipping `page.tsx` with no `error.tsx` after a fetch.** That is this skill's entire job.
- **Rendering `error.message`.** Production users do not need your Prisma query.
- **Rendering `error.digest`.** It is a log key, not UI.
- **`global-error.tsx` without `<html>` and `<body>`.** It will not mount.
- **Using `error.tsx` for 404s.** `notFound()`.
- **Telling the human to paste the template.** You write the file.
