# agent-ready-nextjs

Open-source [Cursor Agent Skill](https://cursor.com/docs/agent/skills) for **agent-readiness** and **AEO** (Answer Engine Optimization) on **Next.js App Router** marketing sites.

Help ChatGPT, Perplexity, and answer engines cite your product accurately — with optional modules for public OpenAPI, developer docs, MCP, and OAuth discovery when you're ready.

## Install

```bash
npx skills add akashp1712/skills --skill agent-ready-nextjs
```

Or clone [akashp1712/skills](https://github.com/akashp1712/skills) and point Cursor at `agent-ready-nextjs/`.

## Quick start

```bash
# 1. Config
cp examples/minimal.config.json /path/to/your-repo/aeo.config.json
# Edit product name, url, answer, feature flags

# 2. Scaffold (dry-run first)
node agent-ready-nextjs/scripts/scaffold.mjs \
  --config aeo.config.json \
  --target apps/web \
  --dry-run

node agent-ready-nextjs/scripts/scaffold.mjs \
  --config aeo.config.json \
  --target apps/web

# 3. Follow generated AGENT-READY-SCAFFOLD-CHECKLIST.md + skill CHECKLIST.md

# 4. Verify
node agent-ready-nextjs/scripts/verify.mjs --url http://localhost:3000
```

## What's included

| Component | Description |
|-----------|-------------|
| `scripts/scaffold.mjs` | Generates libs, routes, proxy, optional OpenAPI/MCP/OAuth docs |
| `scripts/verify.mjs` | HTTP checks for core + full profiles |
| `CHECKLIST.md` | Full orank-aligned gap matrix (auto / agent / manual) |
| `prompts/PROMPT.md` | Questions to gather config from any product |
| `examples/` | `minimal` and `saas-product` configs |

## Feature flags

Enable only what you need:

- **Core (default on):** llms.txt, markdown twins, robots, ai-catalog, agent-skills, schemamap
- **Optional:** `publicOpenApi`, `publicDeveloperDocs`, `sectionLlmsTxt`, `mcpServerDocs`, `oauthDiscovery`

Set `aeo.privateIntegrations: true` when your API is not public.

## Invoke

```
/agent-ready-nextjs
```

Or: "make this site agent-ready", "add llms.txt", "improve orank score".

## License

MIT
