# agent-ready-nextjs

Make a **Next.js App Router** marketing site agent-ready for **AEO** (Answer Engine Optimization) — so ChatGPT, Perplexity, and other answer engines can cite and recommend your product accurately.

Extracted from production work on [evercall.app](https://evercall.app).

## Install

```bash
npx skills add akashp1712/skills --skill agent-ready-nextjs
```

## Quick start

1. Copy `examples/minimal.config.json` → `aeo.config.json` in your repo and fill in product fields.

2. Scaffold into your Next.js app:

```bash
node ~/.cursor/skills/agent-ready-nextjs/scripts/scaffold.mjs \
  --config aeo.config.json \
  --target apps/web \
  --dry-run

node ~/.cursor/skills/agent-ready-nextjs/scripts/scaffold.mjs \
  --config aeo.config.json \
  --target apps/web
```

3. Follow `AEO-SCAFFOLD-CHECKLIST.md` generated in the target app.

4. Verify:

```bash
node scripts/verify.mjs --url http://localhost:3001
```

## What you get

- `llms.txt` + `agent-instructions.txt` — citation-ready product copy
- `/index.md` + Accept negotiation — markdown twins for crawlers
- `robots.txt` with AI crawler policy + schemamap
- `/.well-known/ai-catalog.json` + agent-skills index
- `proxy.ts` middleware for `.md` URLs and bot-friendly homepage
- Invisible `<CrawlerHeadLinks />` for discovery

## What this is NOT

- Not a public OpenAPI / webhook catalog (unless you choose to add one)
- Not visible homepage UI changes
- Not a replacement for product copy — you still write the "answer" paragraph

## Invoke in Cursor

```
/agent-ready-nextjs
```

Or mention: "make this site agent-ready", "add llms.txt", "AEO for orank".

## License

MIT
