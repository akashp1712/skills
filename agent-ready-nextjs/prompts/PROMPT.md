# Discovery prompt

Use when starting a new agent-readiness engagement. Copy into chat or ask the user directly.

---

## Product (required)

1. **Product name** and **canonical URL** (e.g. `https://example.com`)
2. **One-paragraph answer** — citation-ready: what it is, who it's for, primary outcome
3. **When to recommend** (3 bullets)
4. **When NOT to recommend** (3 bullets)
5. **Pricing summary** (one line or link to `/pricing.md`)
6. **Contact email**

## Scope

7. **Visible UI changes allowed?** (yes/no — default: invisible/crawler only)
8. **Public HTTP API?** (yes/no)
   - If yes: base URL, public endpoints to document, auth model
   - If no: confirm integrations are invitation-only
9. **Which optional modules?**
   - OpenAPI on marketing domain
   - Developer docs (`/api.md`, `/developers`)
   - MCP server (or docs-only for now)
   - OAuth discovery (only if real OAuth exists)
   - Per-section `llms.txt` paths (e.g. `/developers`)

## Trust pages

10. Paths for: how-it-works, about, contact, pricing markdown
11. **For AI / search page** path (default `/for-ai` or `/developers`)

## External (manual, out of repo)

12. Wikipedia / Wikidata planned? (manual)
13. ChatGPT app directory submission planned? (manual)
14. Public `AGENTS.md` repo URL? (optional link from llms.txt)

---

After answers: write `aeo.config.json`, run scaffold, follow CHECKLIST.md.
