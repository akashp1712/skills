# agent-ready-nextjs — reference

## Architecture

```
Request
  │
  ├─ /.md suffix ──────────────► proxy.ts rewrite ─► /api/markdown/...
  ├─ Accept: text/markdown ───► proxy.ts rewrite ─► /api/markdown/...
  ├─ Bot UA on / only ─────────► proxy.ts rewrite ─► /api/markdown/...
  ├─ /llms.txt ────────────────► app/llms.txt/route.ts
  └─ HTML pages ───────────────► normal Next.js render
                                      │
                                      └─ <CrawlerHeadLinks /> (head, invisible)
```

Markdown responses include YAML frontmatter (`title`, `description`, `canonical`) and `Link:` headers.

## AEO vs developer API

| AEO (do) | Not on marketing site (don't) |
|----------|-------------------------------|
| llms.txt product card | OpenAPI with webhook paths |
| agent-instructions.txt | Public api.md for control plane |
| When to recommend copy | api.evercall.app probing hints |
| Organization JSON-LD | OAuth metadata without real OAuth |

orank may score lower without OpenAPI — that's correct for private control planes.

## proxy.ts merge

If the app already has `proxy.ts` (Clerk, auth), merge these blocks:

1. `.md` suffix rewrite
2. `Accept: text/markdown` rewrite
3. Optional bot UA on `/` only
4. `appendLinkHeaders` on HTML responses

Do not duplicate matchers or break existing auth bypass paths.

## siteConfig requirements

Scaffolded libs import `@/lib/site` and expect:

```ts
export const siteConfig = {
  name: string;
  domain: string;  // evercall.app
  url: string;     // https://evercall.app
  email: string;
  title: string;
  answer: string;  // one-paragraph citation line
  // ...
};
```

## Favicon gotcha

Next.js `app/apple-icon.png` **overrides** `public/apple-icon.png` and dynamic `apple-icon.tsx`.

Delete stale `app/apple-icon.png` when rebranding. Bump `?v=` cache-bust on icon URLs in metadata.

## Load controls

- Bot UA → markdown: **homepage only** (`/`)
- Static routes (`llms.txt`, JSON catalogs): cache `max-age=3600`
- Do not SSR markdown for every crawled URL

## Extending page-markdown

Register each public path in `getPageMarkdown()`:

```ts
"/about": {
  title: "About …",
  description: siteConfig.answer,
  body: aboutMarkdown(),
},
```

Add `.md` twins automatically via proxy (`/about.md` → same content).

## Verification

```bash
node scripts/verify.mjs --url https://evercall.app
```

Checks: llms.txt, index.md frontmatter, robots schemamap, ai-catalog, Accept negotiation, Link headers.

## Evercall reference implementation

`apps/evercall-app/apps/web` in the evercall monorepo — production AEO layer.
