# next-error-tsx

**A thrown App Router page should not become the digest screen.**

Next.js already named the file: `error.tsx`. Agents still ship `page.tsx` without it. In production that is "Application error: a client-side exception has occurred."

This skill writes the boundary — `error.tsx` next to the page, `global-error.tsx` at the root, `not-found.tsx` on dynamic routes.

```
app/dashboard/
├── page.tsx
├── loading.tsx    ← next-loading-skeleton
└── error.tsx      ← this
```

---

## Install

```bash
npx skills add akashp1712/skills --skill next-error-tsx
```

Auto-applies when you create a data page. Or `/next-error-tsx`.

Pairs with [next-loading-skeleton](../next-loading-skeleton) — wait vs crash.

---

## What it writes

- **`error.tsx`** — Client Component, `reset()` on the button, no stack, no digest in the UI
- **`global-error.tsx`** — full `html`/`body`, because the root layout is the thing that died
- **`not-found.tsx`** — only on `[param]` routes; missing rows are not 500s

---

MIT licensed.
