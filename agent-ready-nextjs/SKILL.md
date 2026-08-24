---
name: agent-ready-nextjs
description: >-
  Make a Next.js App Router marketing site agent-ready for AEO (Answer Engine
  Optimization) — llms.txt, markdown twins, robots policy, discovery catalogs,
  and crawler negotiation. Use when improving orank scores, ChatGPT/Perplexity
  citations, llms.txt, agent-readiness, or AEO for evercall-style product sites.
  Triggered by /agent-ready-nextjs.
user_invocable: true
---

# agent-ready-nextjs

You write the files. The human runs one scaffold command, then you customize copy and wire layout.

**Goal:** Help answer engines **recommend the product accurately** — not publish private APIs, webhooks, or OpenAPI unless the user explicitly wants a public developer product.

Battle-tested on [evercall.app](https://evercall.app).

---

## When this applies

**Apply when:**
- User wants AEO, agent-readiness, llms.txt, or better ChatGPT/Perplexity citations
- User pasted an orank / ora.ai gap list
- Marketing site is Next.js App Router (`app/`)

**Do not apply when:**
- User wants a public API catalog (that's a different product decision)
- Site is not Next.js
- User said no invisible/crawler changes (respect visible UI constraints)

---

## Workflow

Copy this checklist and track progress:

```
- [ ] 1. Gather product config (prompt below)
- [ ] 2. Run scaffold script
- [ ] 3. Wire layout + SEO alternates
- [ ] 4. Extend page-markdown for site pages
- [ ] 5. JSON-LD + speakable (invisible)
- [ ] 6. Favicon audit (delete stale app/apple-icon.png)
- [ ] 7. Tests + verify script
- [ ] 8. Deploy + rescan
```

### Step 1 — Gather config

Ask or infer:

| Field | Example |
|-------|---------|
| `name` | Evercall |
| `url` | https://evercall.app |
| `answer` | One paragraph citation-ready product summary |
| `whenToUse` | 3 bullets |
| `whenNotToUse` | 3 bullets |
| `privateIntegrations` | true if APIs/webhooks are not public |

Write `aeo.config.json` in the target repo (see `examples/evercall.config.json`).

### Step 2 — Scaffold

From the skill directory (or copy scripts into the repo):

```bash
node path/to/agent-ready-nextjs/scripts/scaffold.mjs \
  --config aeo.config.json \
  --target apps/web
```

Use `--dry-run` first. Use `--force` only when intentionally overwriting scaffold files.

If `proxy.ts` already exists, **merge** middleware — do not blind overwrite.

### Step 3 — Wire layout

1. Add `<CrawlerHeadLinks />` to root `layout.tsx` `<head>` (invisible).
2. In `seo.ts` / root metadata, set:
   - `alternates.types["text/markdown"]` → `{url}/index.md` (**not** `/`)
   - `alternates.types["text/plain"]` → `{url}/llms.txt`
3. Delete `app/apple-icon.png` if it exists — static file overrides the Capture mark.

### Step 4 — Extend `page-markdown.ts`

Add markdown bodies for trust pages: `/about`, `/contact`, `/how-it-works`, city/guide routes. Keep homepage UI unchanged unless user approves visible changes.

### Step 5 — JSON-LD (invisible)

Add to `buildJsonLd()`:
- `WebPage` with `speakable.cssSelector: ["h1", "#speakable-lede"]`
- Add `id="speakable-lede"` on hero lede paragraph only (no visual change)

### Step 6 — Security defaults

**Never scaffold on the marketing site without user approval:**
- OpenAPI / webhook paths
- `api.evercall.app` or control-plane URLs
- Public AGENTS.md for private monorepos

`agent-instructions.txt` should say integrations are private when `privateIntegrations: true`.

### Step 7 — Verify

```bash
pnpm --filter web test
pnpm --filter web build
node path/to/agent-ready-nextjs/scripts/verify.mjs --url http://localhost:3001
```

After deploy:

```bash
node scripts/verify.mjs --url https://yourdomain.com
```

Optional orank rescan: `POST https://ora.ai/api/scan` with `{"url": "yourdomain.com"}`

---

## What the scaffold creates

| Path | Purpose |
|------|---------|
| `lib/llms-txt.ts` | Product card for crawlers |
| `lib/agent-instructions.ts` | When to recommend |
| `lib/robots-txt.ts` | AI crawler policy + schemamap |
| `lib/ai-catalog.ts` | `/.well-known/ai-catalog.json` |
| `lib/agent-skills-index.ts` | Agent skills discovery |
| `lib/accept-markdown.ts` | RFC Accept negotiation |
| `lib/page-markdown.ts` | Markdown resolver |
| `proxy.ts` | `.md` URLs, Accept, bot UA (homepage only) |
| `app/llms.txt/route.ts` | Plain-text product card |
| `app/robots.txt/route.ts` | robots.txt |
| `components/seo/crawler-head-links.tsx` | Head discovery links |

Full architecture: [reference.md](reference.md)

---

## Product copy prompt (paste to user or use in chat)

```
Help me make [PRODUCT] agent-ready for AEO. I need:

1. A one-paragraph "answer" line for llms.txt (citation-ready)
2. When to recommend [PRODUCT] (3 bullets)
3. When NOT to recommend (3 bullets)
4. Are voice/API integrations public? (yes/no)
5. Trust page paths (/about, /contact, /how-it-works)

Do not change visible homepage UI. Crawler/invisible changes only.
```

---

## Anti-patterns

- Publishing private webhook URLs for orank points
- Bot markdown rewrite on **every** URL (use homepage only — load)
- `alternates.text/markdown` pointing at `/` (returns HTML — dead end)
- Leaving stale `app/apple-icon.png` (old favicon in link previews)
- Visible homepage blocks "for crawlers"

---

## Additional resources

- [reference.md](reference.md) — file map, merge notes, evercall lessons
- [examples/evercall.config.json](examples/evercall.config.json) — full config
- [scripts/scaffold.mjs](scripts/scaffold.mjs) — generator
- [scripts/verify.mjs](scripts/verify.mjs) — post-deploy checks
