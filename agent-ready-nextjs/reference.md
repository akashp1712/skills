# agent-ready-nextjs — reference

## Architecture

```
Request
  ├─ *.md URL ─────────────────► proxy.ts ─► /api/markdown/...
  ├─ Accept: text/markdown ────► proxy.ts ─► /api/markdown/...
  ├─ Bot UA (homepage only) ───► proxy.ts ─► /api/markdown/...
  ├─ /llms.txt ────────────────► route handler
  └─ HTML ─────────────────────► Next.js + CrawlerHeadLinks (head)
```

Markdown bodies use YAML frontmatter: `title`, `description`, `canonical`, `last-updated`.

## Config schema

```json
{
  "product": { "name", "domain", "url", "email", "title", "answer", "locale" },
  "aeo": { "whenToUse", "whenNotToUse", "pricingSummary", "privateIntegrations" },
  "crawl": { "disallowPaths", "botHomepageOnly", "cacheBust" },
  "paths": { "howItWorks", "about", "contact", "pricingMd", "forAiPage" },
  "features": { "...flags..." },
  "api": { "baseUrl", "title", "description", "paths": [{ "path", "method", "summary", "operationId" }] }
}
```

## siteConfig contract

Scaffolded libs import `@/lib/site`:

```ts
export const siteConfig = {
  name: string;
  domain: string;
  url: string;
  email: string;
  title: string;
  answer: string;
};
```

Adapt import path in generated files if your project differs.

## Citation-only vs public API

| Mode | Config | Marketing site publishes |
|------|--------|--------------------------|
| Citation-only | `privateIntegrations: true`, OpenAPI off | llms.txt, agent-instructions, trust pages |
| Public API | `publicOpenApi: true`, fill `api.paths` | + openapi.json, developer markdown |
| Full integrator | + `mcpServerDocs`, real MCP server | + MCP manifest in ai-catalog |

Never publish webhook secrets, internal hostnames, or private control-plane paths on the marketing domain unless explicitly requested.

## proxy.ts merge

If Clerk/auth middleware exists, merge in order:

1. Skip `/api/markdown`
2. `.md` suffix rewrite
3. `?mode=agent` → `__agent__` markdown
4. Bot UA (homepage only by default)
5. `Accept: text/markdown`
6. `appendLinkHeaders` on HTML responses

## JSON-LD speakable (invisible)

```ts
{
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#speakable-lede"],
  },
}
```

Add `id="speakable-lede"` to hero lede `<p>` only.

## Favicon gotcha

`app/apple-icon.png` overrides `public/` and `apple-icon.tsx`. Delete stale file on rebrand; bump `?v=` on icon URLs.

## Load / security

- Bot → markdown: default homepage only
- Cache static discovery files (`max-age=3600`)
- Do not SSR markdown for every crawled path

## Verification profiles

```bash
node scripts/verify.mjs --url https://example.com              # core
node scripts/verify.mjs --url https://example.com --profile full  # + optional endpoints
```

## File map (core scaffold)

| File | Role |
|------|------|
| `lib/llms-txt.ts` | Product card |
| `lib/agent-instructions.ts` | Recommendation rules |
| `lib/robots-txt.ts` | Crawler policy |
| `lib/page-markdown.ts` | Markdown resolver |
| `lib/accept-markdown.ts` | Accept negotiation |
| `proxy.ts` | Rewrites |
| `app/llms.txt/route.ts` | Plain-text endpoint |

Optional: `lib/openapi-spec.ts`, `docs/agent-ready/*.md`, section `llms.txt` routes.
