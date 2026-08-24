---
name: agent-ready-nextjs
description: >-
  Scaffold and implement agent-readiness / AEO for Next.js App Router marketing
  sites — llms.txt, markdown twins, robots policy, discovery catalogs, optional
  OpenAPI/MCP/OAuth modules. Use for orank/ora.ai gaps, ChatGPT/Perplexity
  citations, llms.txt, or "make this site agent-ready". Triggered by
  /agent-ready-nextjs.
user_invocable: true
---

# agent-ready-nextjs

Generic skill for any product site. You run the scaffold, wire layout, customize copy, verify.

**Primary goal:** Answer Engine Optimization (AEO) — help ChatGPT, Perplexity, Claude Search, and similar surfaces **cite and recommend the product accurately**.

**Secondary goal (optional):** Public developer discovery when `features.publicOpenApi` / `publicDeveloperDocs` are enabled in config.

---

## When this applies

- User wants agent-readiness, AEO, llms.txt, or orank/ora.ai improvements
- Next.js App Router marketing site (`app/`)
- User may want **full** coverage (including OpenAPI, MCP, OAuth) or **citation-only**

**Stop and ask** if user forbids invisible/crawler changes or visible homepage edits.

---

## Workflow

```
- [ ] 1. Copy examples/minimal.config.json → aeo.config.json
- [ ] 2. Fill product + feature flags (see prompts/PROMPT.md)
- [ ] 3. node scripts/scaffold.mjs --config aeo.config.json --target <app>
- [ ] 4. Wire layout, SEO alternates, page-markdown routes
- [ ] 5. Work CHECKLIST.md — auto vs manual items
- [ ] 6. pnpm test && pnpm build
- [ ] 7. node scripts/verify.mjs --url <deployed-url> --profile full
```

### Scaffold command

```bash
node path/to/agent-ready-nextjs/scripts/scaffold.mjs \
  --config aeo.config.json \
  --target apps/web \
  --dry-run

node path/to/agent-ready-nextjs/scripts/scaffold.mjs \
  --config aeo.config.json \
  --target apps/web
```

Merge `proxy.ts` if the app already has auth middleware.

---

## Config feature flags

| Flag | Default | Purpose |
|------|---------|---------|
| `markdownTwins` | true | `/index.md`, Accept negotiation, frontmatter |
| `agentMode` | true | `?mode=agent` structured product view |
| `aiCatalog` | true | `/.well-known/ai-catalog.json` |
| `agentSkillsIndex` | true | `/.well-known/agent-skills/index.json` |
| `schemamap` | true | NLWeb schemamap in robots.txt |
| `linkHeaders` | true | RFC 8288 Link headers |
| `speakableJsonLd` | true | WebPage speakable (agent implements JSON-LD) |
| `publicDeveloperDocs` | false | `/api.md` + developer markdown |
| `publicOpenApi` | false | `/openapi.json` from `api.paths` |
| `sectionLlmsTxt` | `[]` | e.g. `["/developers"]` → `/developers/llms.txt` |
| `mcpServerDocs` | false | `docs/agent-ready/MCP.md` guide |
| `oauthDiscovery` | false | `docs/agent-ready/OAUTH-DISCOVERY.md` guide |
| `publicAgentsMdUrl` | null | Link public AGENTS.md from llms.txt |

Set `aeo.privateIntegrations: true` when APIs/webhooks are **not** public — scaffold will not expose them.

See `examples/saas-product.config.json` for a public-API example.

---

## Full orank coverage

[CHECKLIST.md](CHECKLIST.md) maps every common orank gap to **auto** (scaffold), **agent** (you code), or **manual** (Wikipedia, ChatGPT app store, etc.).

Layers:
- **Discovery** — llms.txt, ai-catalog, robots, developer page, AGENTS.md link
- **Access** — markdown twins, agent-skills, schemamap, Link headers, speakable
- **Usability** — OpenAPI, JSON API errors, MCP, OAuth metadata (all optional)

---

## Wire-up (always manual)

1. `<CrawlerHeadLinks />` in root `layout.tsx` `<head>`
2. `alternates.types["text/markdown"]` → `{url}/index.md` (**never** `/`)
3. Extend `lib/page-markdown.ts` for `/about`, `/contact`, guides, etc.
4. `WebPage` + `SpeakableSpecification` in JSON-LD; `#speakable-lede` on hero (invisible)
5. Delete stale `app/apple-icon.png` if favicon previews show old logo
6. Respect user's visible UI constraints

---

## Optional modules (when flags enabled)

### Public OpenAPI (`publicOpenApi: true`)

- Edit `api.paths` in config before scaffold
- Customize `lib/openapi-spec.ts` after scaffold
- API must return JSON errors: `{ error, message, resolution }`

### MCP (`mcpServerDocs: true`)

- Scaffold writes implementation guide only
- Build MCP server separately; add to ai-catalog when live

### OAuth (`oauthDiscovery: true`)

- Scaffold writes guide only — **do not** ship fake `/.well-known/oauth-*` in production
- Implement when a real authorization server exists

---

## Verify

```bash
node scripts/verify.mjs --url http://localhost:3000
node scripts/verify.mjs --url https://yourdomain.com --profile full
```

Optional rescan: `POST https://ora.ai/api/scan` body `{"url":"yourdomain.com"}`

---

## Anti-patterns

- Publishing private webhook URLs to score orank points
- Bot markdown on every URL (default: homepage only — `crawl.botHomepageOnly`)
- Markdown alternate pointing at HTML `/`
- Placeholder OAuth metadata in production
- Visible "crawler-only" homepage blocks without user approval

---

## Resources

- [CHECKLIST.md](CHECKLIST.md) — full gap matrix
- [reference.md](reference.md) — architecture
- [prompts/PROMPT.md](prompts/PROMPT.md) — questions to ask the user
- [examples/saas-product.config.json](examples/saas-product.config.json)
- [scripts/scaffold.mjs](scripts/scaffold.mjs)
- [scripts/verify.mjs](scripts/verify.mjs)
