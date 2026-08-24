# Agent-readiness checklist (orank / ora.ai aligned)

Use this after scaffolding. Mark each item: **auto** (scaffold), **agent** (you implement), **manual** (outside codebase), **skip** (not applicable).

## Discovery

| Item | Layer | How |
|------|-------|-----|
| Developer resource discoverability | Discovery | **agent**: `/for-ai` or `/developers` page with product name in title; link from `llms.txt` |
| Wikipedia / Wikidata entity | Discovery | **manual**: notability + cited article; set P856 to your domain |
| `/.well-known/ai-catalog.json` | Discovery | **auto**: scaffold when `features.aiCatalog` |
| ChatGPT app directory | Discovery | **manual**: submit to OpenAI apps/connectors when ready |
| robots.txt AI crawler policy | Discovery | **auto**: allow answer-engine bots; block CCBot/Bytespider; `Content-Signal` |
| Public `AGENTS.md` / agent configs | Discovery | **agent**: link from `llms.txt` when `features.publicAgentsMdUrl` set |

## Access

| Item | Layer | How |
|------|-------|-----|
| `/.well-known/agent-skills/index.json` | Access | **auto** when `features.agentSkillsIndex` |
| `?mode=agent` structured view | Access | **auto** when `features.agentMode` |
| Content efficiency (≥5% text/HTML) | Access | **agent**: SSR copy; avoid huge hydration blobs on marketing pages |
| `/index.md` homepage markdown | Access | **auto**: markdown twins via proxy |
| Per-page `.md` twins | Access | **auto** + extend `page-markdown.ts` per route |
| SSR content without JS (H1 + 500 chars) | Access | **agent**: ensure hero + lede in server HTML |
| NLWeb `schemamap:` in robots.txt | Access | **auto** when `features.schemamap` |
| HTTP `Link:` headers (RFC 8288) | Access | **auto** when `features.linkHeaders` |
| Per-section `llms.txt` files | Access | **auto** for each path in `features.sectionLlmsTxt` |
| `llms.txt` markdown links | Access | **agent**: use `[text](url)` not bare URLs |
| Speakable JSON-LD | Access | **agent**: `WebPage.speakable` + `#speakable-lede` on hero (invisible) |
| Markdown `<link rel="alternate">` → `/index.md` | Access | **auto**: must not point at `/` (HTML) |
| YAML frontmatter on markdown | Access | **auto**: `title`, `description`, `canonical` |
| Bot-UA markdown on homepage | Access | **auto**: configurable `crawl.botHomepageOnly` |

## Usability

| Item | Layer | How |
|------|-------|-----|
| MCP server / manifest | Usability | **agent**: build MCP server when API is public; see `docs/MCP.md` stub |
| JSON error responses on API | Usability | **agent**: API host returns `{ error, message, resolution }` — not HTML |
| OAuth `/.well-known/oauth-*` | Usability | **agent**: only when real OAuth exists; see optional scaffold |
| OpenAPI 3.1 spec | Usability/Discovery | **auto** when `features.publicOpenApi` — **never** for private webhooks |

## Quality gates

```bash
pnpm test && pnpm build
node scripts/verify.mjs --url http://localhost:3000
node scripts/verify.mjs --url https://yourdomain.com --profile full
```

Rescan (optional): `POST https://ora.ai/api/scan` with `{"url": "yourdomain.com"}`

## Decision: public API on marketing site?

| Situation | Recommendation |
|-----------|----------------|
| Public developer product | Enable `publicOpenApi` + `publicDeveloperDocs` + optional MCP |
| Private / invitation-only API | Keep `privateIntegrations: true`; no OpenAPI on marketing domain |
| API on separate host | Document contact email only; put OpenAPI on `api.` subdomain if public |
