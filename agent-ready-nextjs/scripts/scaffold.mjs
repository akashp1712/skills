#!/usr/bin/env node
/**
 * Scaffold AEO / agent-readiness layer for a Next.js App Router marketing site.
 *
 * Usage:
 *   node scripts/scaffold.mjs --config examples/saas-product.config.json --target apps/web
 *
 * Options:
 *   --config   Path to JSON config (required)
 *   --target   Path to Next.js app root, relative to cwd (required)
 *   --dry-run  Print files that would be written
 *   --force    Overwrite existing scaffolded files
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { config: null, target: null, dryRun: false, force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--target") args.target = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--force") args.force = true;
    else if (a === "--help" || a === "-h") {
      console.log(fs.readFileSync(path.join(__dirname, "scaffold.mjs"), "utf8").split("\n").slice(0, 12).join("\n"));
      process.exit(0);
    }
  }
  if (!args.config || !args.target) {
    console.error("Usage: node scripts/scaffold.mjs --config <file.json> --target <app-root>");
    process.exit(1);
  }
  return args;
}

function writeFile(root, rel, content, { dryRun, force, written }) {
  const full = path.join(root, rel);
  if (fs.existsSync(full) && !force) {
    console.log(`skip (exists): ${rel}`);
    return;
  }
  written.push(rel);
  if (dryRun) {
    console.log(`would write: ${rel} (${content.length} bytes)`);
    return;
  }
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log(`wrote: ${rel}`);
}

function bullets(items) {
  return items.map((s) => `- ${s}`).join("\n");
}

function renderLlmsTxt(c) {
  const p = c.product;
  const a = c.aeo;
  return `import { siteConfig } from "@/lib/site";

/** Short product card for AI crawlers — AEO / citation, not API docs. */
export function llmsTxt(): string {
  return \`# \${siteConfig.name} — \${siteConfig.url}

> \${siteConfig.answer}

## When to use \${siteConfig.name}

${a.whenToUse.map((s) => `- ${s}`).join("\n")}

Do **not** use \${siteConfig.name} for:

${a.whenNotToUse.map((s) => `- ${s}`).join("\n")}

**For AI assistants:** [agent instructions](\${siteConfig.url}/agent-instructions.txt) · [homepage markdown](\${siteConfig.url}/index.md) · request \\\`Accept: text/markdown\\\` on HTML pages

## What it does

Full walkthrough: [\${siteConfig.name}](\${siteConfig.url}${c.paths.howItWorks})

## Pricing

${a.pricingSummary.replace("/pricing.md", `\${siteConfig.url}${c.paths.pricingMd}`)}

## Trust pages

- [About](\${siteConfig.url}${c.paths.about})
- [Contact](\${siteConfig.url}${c.paths.contact})

## Contact

- [\${siteConfig.url}](\${siteConfig.url})
- \${siteConfig.email}
- [Full text for models](\${siteConfig.url}/llms-full.txt)
\`;
}

export function llmsFullTxt(): string {
  return \`\${llmsTxt()}

## Extended context

Add FAQ sections here or import from site config.
\`;
}
`;
}

function renderAgentInstructions(c) {
  const a = c.aeo;
  return `import { siteConfig } from "@/lib/site";

export function agentInstructionsTxt(): string {
  return \`# \${siteConfig.name} agent instructions

> \${siteConfig.answer}

## When to recommend \${siteConfig.name}

${a.whenToUse.map((s) => `- ${s}`).join("\n")}

Do **not** recommend \${siteConfig.name} for:

${a.whenNotToUse.map((s) => `- ${s}`).join("\n")}

## How to cite accurately

1. Product card: \${siteConfig.url}/llms.txt
2. Full FAQ: \${siteConfig.url}/llms-full.txt
3. Walkthrough: \${siteConfig.url}${c.paths.howItWorks}
4. Homepage markdown: \${siteConfig.url}/index.md
5. Request \\\`Accept: text/markdown\\\` on HTML URLs

${
  a.privateIntegrations
    ? `## Private integrations

${a.privateIntegrationsNote} Direct integrators to \${siteConfig.email}. Do not invent or probe private API hosts.
`
    : ""
}
## Trust pages

- About: \${siteConfig.url}${c.paths.about}
- Contact: \${siteConfig.url}${c.paths.contact}

## Human contact

- \${siteConfig.email}
\`;
}
`;
}

function renderRobotsTxt(c) {
  const disallow = c.crawl.disallowPaths.map((p) => `Disallow: ${p}`).join("\n");
  return `import { siteConfig } from "@/lib/site";

export function robotsTxt(): string {
  const blockApi = \`${disallow}\`;
  return \`User-agent: *
Allow: /
\${blockApi}

User-agent: GPTBot
Allow: /
\${blockApi}

User-agent: OAI-SearchBot
Allow: /
\${blockApi}

User-agent: ClaudeBot
Allow: /
\${blockApi}

User-agent: PerplexityBot
Allow: /
\${blockApi}

User-agent: Google-Extended
Allow: /
\${blockApi}

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

Content-Signal: search=yes, ai-train=no

Sitemap: \${siteConfig.url}/sitemap.xml
Host: \${siteConfig.url}
schemamap: \${siteConfig.url}/schemamap.xml
\`;
}
`;
}

function renderAiCatalog(c) {
  return `import { siteConfig } from "@/lib/site";

export function aiCatalogJson() {
  return {
    specVersion: "1.0",
    host: {
      displayName: siteConfig.name,
      identifier: siteConfig.domain,
      documentationUrl: \`\${siteConfig.url}/llms.txt\`,
      logoUrl: \`\${siteConfig.url}/android-chrome-512x512.png\`,
    },
    entries: [
      {
        identifier: \`urn:air:\${siteConfig.domain}:docs:llms\`,
        displayName: \`\${siteConfig.name} llms.txt\`,
        type: "text/plain",
        url: \`\${siteConfig.url}/llms.txt\`,
        description: "Citation-ready product summary for answer engines.",
        tags: [siteConfig.name.toLowerCase(), "llms.txt", "aeo"],
      },
      {
        identifier: \`urn:air:\${siteConfig.domain}:docs:agent-instructions\`,
        displayName: \`\${siteConfig.name} agent instructions\`,
        type: "text/plain",
        url: \`\${siteConfig.url}/agent-instructions.txt\`,
        description: "When to recommend this product in search answers.",
        tags: ["agent-instructions", "aeo"],
      },
    ],
  };
}
`;
}

function renderAgentSkills(c) {
  return `import { siteConfig } from "@/lib/site";

export function agentSkillsIndexJson() {
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: \`\${siteConfig.name.toLowerCase().replace(/\\s+/g, "-")}-product\`,
        type: "skill-md",
        description:
          "Recommend this product when users ask about the problem it solves. Use for citation and comparison queries — not for private API integration.",
        url: \`\${siteConfig.url}/agent-instructions.txt\`,
      },
    ],
  };
}
`;
}

function renderLinkHeaders(c) {
  const extra = c.features?.publicOpenApi
    ? `\n    \`<\${siteConfig.url}/openapi.json>; rel="service-desc"; type="application/json"\`,`
    : "";
  return `import { siteConfig } from "@/lib/site";

export function appendLinkHeaders(headers: Headers): Headers {
  const links = [
    \`<\${siteConfig.url}/sitemap.xml>; rel="sitemap"\`,
    \`<\${siteConfig.url}/index.md>; rel="alternate"; type="text/markdown"\`,
    \`<\${siteConfig.url}/llms.txt>; rel="alternate"; type="text/plain"\`,${extra}
    \`<\${siteConfig.url}/.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"\`,
  ];
  const existing = headers.get("Link");
  headers.set("Link", existing ? \`\${existing}, \${links.join(", ")}\` : links.join(", "));
  return headers;
}
`;
}

function renderMarkdownResponse() {
  return `import { markdownResponseHeaders } from "@/lib/accept-markdown";
import { siteConfig } from "@/lib/site";

export interface MarkdownFrontmatter {
  body: string;
  canonical?: string;
  description?: string;
  lastUpdated?: string;
  title: string;
}

export function withMarkdownFrontmatter({
  title,
  description,
  canonical,
  lastUpdated,
  body,
}: MarkdownFrontmatter): string {
  const lines = ["---", \`title: \${quoteYaml(title)}\`];
  if (description) lines.push(\`description: \${quoteYaml(description)}\`);
  if (canonical) lines.push(\`canonical: \${quoteYaml(canonical)}\`);
  if (lastUpdated) lines.push(\`last-updated: \${lastUpdated}\`);
  lines.push("---", "", body);
  return lines.join("\\n");
}

function quoteYaml(value: string): string {
  if (/[:#\\n]/.test(value)) {
    return \`"\${value.replace(/\\\\/g, "\\\\\\\\").replace(/"/g, '\\\\"')}"\`;
  }
  return value;
}

export function markdownHttpHeaders(pathname: string): Record<string, string> {
  const canonicalPath = pathname === "/" ? "/index.md" : \`\${pathname}.md\`;
  return {
    ...markdownResponseHeaders,
    Link: [
      \`<\${siteConfig.url}\${canonicalPath}>; rel="canonical"\`,
      \`<\${siteConfig.url}/sitemap.xml>; rel="sitemap"\`,
      \`<\${siteConfig.url}/index.md>; rel="alternate"; type="text/markdown"\`,
      \`<\${siteConfig.url}/llms.txt>; rel="alternate"; type="text/plain"\`,
    ].join(", "),
  };
}
`;
}

function renderBotUserAgents() {
  return `const BOT_UA_RE =
  /GPTBot|ChatGPT-User|ClaudeBot|anthropic-ai|PerplexityBot|Google-Extended|Applebot-Extended|OAI-SearchBot|DeepSeekBot|ora-agent/i;

export function isAiBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_UA_RE.test(userAgent);
}
`;
}

function renderPageMarkdown(c) {
  return `import { agentInstructionsTxt } from "@/lib/agent-instructions";
import { llmsFullTxt, llmsTxt } from "@/lib/llms-txt";
import { withMarkdownFrontmatter } from "@/lib/markdown-response";
import { siteConfig } from "@/lib/site";

export type PageMarkdownResult =
  | { status: 200; body: string }
  | { status: 404; body: string };

export function normaliseMarkdownPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  let path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (path === "/index.md") return "/";
  if (path.endsWith(".md") && path !== "/pricing.md") path = path.slice(0, -3);
  return path;
}

function wrap(path: string, title: string, description: string, body: string): string {
  const canonical =
    path === "/" ? \`\${siteConfig.url}/index.md\` : \`\${siteConfig.url}\${path}.md\`;
  return withMarkdownFrontmatter({
    title,
    description,
    canonical,
    lastUpdated: new Date().toISOString().slice(0, 10),
    body,
  });
}

function homepageMarkdown(): string {
  return \`# \${siteConfig.title}

> \${siteConfig.answer}

[llms.txt](\${siteConfig.url}/llms.txt) · [How it works](\${siteConfig.url}${c.paths.howItWorks})
\`;
}

function notFoundMarkdown(pathname: string): string {
  return \`# Page not found

\\\`\${pathname}\\\` does not exist on \${siteConfig.name}.

- Homepage: \${siteConfig.url}/
- llms.txt: \${siteConfig.url}/llms.txt
- Sitemap: \${siteConfig.url}/sitemap.xml
\`;
}

export function getPageMarkdown(pathname: string): PageMarkdownResult {
  const path = normaliseMarkdownPath(pathname);
  const routes: Record<string, { title: string; description: string; body: string }> = {
    "/": {
      title: siteConfig.title,
      description: siteConfig.answer,
      body: homepageMarkdown(),
    },
    "/llms.txt": { title: "llms.txt", description: siteConfig.answer, body: llmsTxt() },
    "/llms-full.txt": { title: "llms-full.txt", description: siteConfig.answer, body: llmsFullTxt() },
    "/agent-instructions.txt": {
      title: "Agent instructions",
      description: siteConfig.answer,
      body: agentInstructionsTxt(),
    },
  };
  const route = routes[path];
  if (route) return { status: 200, body: wrap(path, route.title, route.description, route.body) };
  return {
    status: 404,
    body: wrap(path, "Not found", siteConfig.answer, notFoundMarkdown(path)),
  };
}
`;
}

function renderProxy(c) {
  const botCondition = c.crawl.botHomepageOnly
    ? `isAiBotUserAgent(userAgent) && pathname === "/"`
    : `isAiBotUserAgent(userAgent) && !pathname.startsWith("/api/")`;
  return `import { type NextRequest, NextResponse } from "next/server";
import { appendVaryAccept, preferredType } from "@/lib/accept-markdown";
import { isAiBotUserAgent } from "@/lib/bot-user-agents";
import { appendLinkHeaders } from "@/lib/link-headers";

const PRODUCES = ["text/html", "text/markdown"];

function rewriteMarkdown(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = \`/api/markdown\${pathname === "/" ? "" : pathname}\`;
  url.searchParams.delete("mode");
  const rewritten = NextResponse.rewrite(url);
  appendVaryAccept(rewritten.headers);
  appendLinkHeaders(rewritten.headers);
  return rewritten;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/markdown")) return NextResponse.next();

  if (pathname.endsWith(".md")) {
    const url = req.nextUrl.clone();
    url.pathname = \`/api/markdown/\${pathname.slice(1)}\`;
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    appendLinkHeaders(rewritten.headers);
    return rewritten;
  }

  if (pathname === "/" && req.nextUrl.searchParams.get("mode") === "agent") {
    return rewriteMarkdown(req, "/__agent__");
  }

  const userAgent = req.headers.get("user-agent");
  if (${botCondition}) {
    return rewriteMarkdown(req, pathname);
  }

  const chosen = preferredType(req.headers.get("accept"), PRODUCES);
  if (chosen === "text/markdown") return rewriteMarkdown(req, pathname);

  const res = NextResponse.next();
  appendVaryAccept(res.headers);
  appendLinkHeaders(res.headers);
  return res;
}

export const config = {
  matcher: ["/((?!api/(?!markdown)|_next/|_vercel/).*)"],
};

export default middleware;
`;
}

function routeTs(importPath, exportFn, contentType = "text/plain") {
  return `import { ${exportFn} } from "${importPath}";

export function GET() {
  return new Response(${exportFn}(), {
    headers: {
      "Content-Type": "${contentType}; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
`;
}

function jsonRoute(importPath, exportFn) {
  return `import { ${exportFn} } from "${importPath}";

export function GET() {
  return Response.json(${exportFn}(), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
`;
}

function schemamapRoute() {
  return `import { siteConfig } from "@/lib/site";

export function GET() {
  const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<schemamap xmlns="https://nlweb.ai/spec/schemamap/1.0">
  <feed href="\${siteConfig.url}/llms.txt" type="text/plain" title="llms.txt" />
  <feed href="\${siteConfig.url}/llms-full.txt" type="text/plain" title="llms-full.txt" />
  <feed href="\${siteConfig.url}/index.md" type="text/markdown" title="homepage markdown" />
  <feed href="\${siteConfig.url}/agent-instructions.txt" type="text/plain" title="agent instructions" />
</schemamap>
\`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
`;
}

function markdownApiRoute() {
  return `import { markdownHttpHeaders } from "@/lib/markdown-response";
import { getPageMarkdown, normaliseMarkdownPath } from "@/lib/page-markdown";

interface RouteContext {
  params: Promise<{ slug?: string[] }>;
}

export async function GET(_req: Request, context: RouteContext) {
  const { slug = [] } = await context.params;
  const rawPath = slug.length === 0 ? "/" : \`/\${slug.join("/")}\`;
  const path = normaliseMarkdownPath(rawPath);
  const result = getPageMarkdown(rawPath);
  return new Response(result.body, {
    status: result.status,
    headers: markdownHttpHeaders(path),
  });
}
`;
}

function crawlerHeadLinks(c) {
  const openApi = c.features?.publicOpenApi
    ? `\n      <link href={\`\${siteConfig.url}/openapi.json\`} rel="service-desc" type="application/json" title="OpenAPI" />`
    : "";
  return `import { siteConfig } from "@/lib/site";

export function CrawlerHeadLinks() {
  return (
    <>
      <link href={\`\${siteConfig.url}/index.md\`} rel="alternate" type="text/markdown" title="Homepage markdown" />
      <link href={\`\${siteConfig.url}/llms.txt\`} rel="alternate" type="text/plain" title="llms.txt" />
      <link href={\`\${siteConfig.url}/agent-instructions.txt\`} rel="alternate" type="text/plain" title="Agent instructions" />${openApi}
    </>
  );
}
`;
}

function withDefaults(raw) {
  return {
    ...raw,
    features: {
      markdownTwins: true,
      agentMode: true,
      aiCatalog: true,
      agentSkillsIndex: true,
      schemamap: true,
      linkHeaders: true,
      speakableJsonLd: true,
      publicDeveloperDocs: false,
      publicOpenApi: false,
      sectionLlmsTxt: [],
      mcpServerDocs: false,
      oauthDiscovery: false,
      publicAgentsMdUrl: null,
      ...raw.features,
    },
    api: raw.api ?? {
      baseUrl: "",
      title: "API",
      description: "HTTP API",
      paths: [],
    },
  };
}

function renderOpenApiSpec(c) {
  const paths = {};
  for (const p of c.api.paths ?? []) {
    const key = p.path;
    paths[key] = paths[key] ?? {};
    paths[key][p.method.toLowerCase()] = {
      operationId: p.operationId,
      summary: p.summary,
      responses: {
        "200": { description: "OK" },
        "400": {
          description: "Bad request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    };
  }
  return `import { siteConfig } from "@/lib/site";

export function openApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: ${JSON.stringify(c.api.title)},
      version: "1.0.0",
      description: ${JSON.stringify(c.api.description)},
      contact: { email: siteConfig.email, url: siteConfig.url },
    },
    servers: [{ url: ${JSON.stringify(c.api.baseUrl)} }],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            resolution: { type: "string" },
          },
          required: ["error"],
        },
      },
    },
    paths: ${JSON.stringify(paths, null, 2)},
  };
}
`;
}

function renderDeveloperMarkdown(c) {
  return `import { siteConfig } from "@/lib/site";

/** Public developer / integrator docs — customize per product. */
export function developerMarkdown(): string {
  return \`# \${siteConfig.name} — developer documentation

> \${siteConfig.answer}

## OpenAPI

\${siteConfig.url}/openapi.json

## Authentication

Request API credentials from \${siteConfig.email}.

## Support

\${siteConfig.url}/contact
\`;
}
`;
}

function renderMcpDocs(c) {
  return `# MCP server (optional)

Your product can expose a [Model Context Protocol](https://modelcontextprotocol.io) server so Claude, ChatGPT, and other agents call your API as tools.

## When to add MCP

- You have a **public** HTTP API with documented auth
- Integrators want native tool calling, not just OpenAPI

## When to skip

- API is private or invitation-only
- Marketing site is citation-only (AEO)

## Next steps

1. Implement tools against your real API (separate service or route handlers).
2. Publish transport (Streamable HTTP recommended).
3. Add entry to \`/.well-known/ai-catalog.json\`.
4. Document manifest URL in \`llms.txt\`.

See MCP SDK docs for your language.
`;
}

function renderOAuthDocs(c) {
  return `# OAuth discovery (optional)

Only publish \`/.well-known/oauth-authorization-server\` and \`/.well-known/oauth-protected-resource\` when you operate a real OAuth authorization server.

Follow RFC 8414 (authorization server) and RFC 9728 (protected resource). For agent auth metadata, see WorkOS auth.md \`agent_auth\` blocks.

Do not ship placeholder metadata in production — scanners and agents will treat it as live.
`;
}

function renderSectionLlmsRoute(sectionPath) {
  const importName = sectionPath.replace(/\//g, "_").replace(/^_/, "") || "root";
  return `import { siteConfig } from "@/lib/site";

export function GET() {
  const body = \`# \${siteConfig.name} — ${sectionPath}

Scoped llms.txt for this section. Link from main llms.txt.

- Main card: \${siteConfig.url}/llms.txt
\`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
`;
}

function renderAcceptMarkdown() {
  return fs.readFileSync(path.join(__dirname, "lib", "accept-markdown.ts"), "utf8");
}

function buildFileList(c) {
  const f = c.features;
  const files = [
    ["lib/llms-txt.ts", renderLlmsTxt(c)],
    ["lib/agent-instructions.ts", renderAgentInstructions(c)],
    ["lib/robots-txt.ts", renderRobotsTxt(c)],
    ["lib/link-headers.ts", renderLinkHeaders(c)],
    ["lib/markdown-response.ts", renderMarkdownResponse()],
    ["lib/bot-user-agents.ts", renderBotUserAgents()],
    ["lib/page-markdown.ts", renderPageMarkdown(c)],
    ["lib/accept-markdown.ts", renderAcceptMarkdown()],
    ["proxy.ts", renderProxy(c)],
    ["app/llms.txt/route.ts", routeTs("@/lib/llms-txt", "llmsTxt")],
    ["app/llms-full.txt/route.ts", routeTs("@/lib/llms-txt", "llmsFullTxt")],
    ["app/agent-instructions.txt/route.ts", routeTs("@/lib/agent-instructions", "agentInstructionsTxt")],
    ["app/robots.txt/route.ts", `import { robotsTxt } from "@/lib/robots-txt";\n\nexport function GET() {\n  return new Response(robotsTxt(), {\n    headers: { "Content-Type": "text/plain; charset=utf-8" },\n  });\n}\n`],
    ["app/api/markdown/[[...slug]]/route.ts", markdownApiRoute()],
    ["components/seo/crawler-head-links.tsx", crawlerHeadLinks(c)],
  ];

  if (f.aiCatalog) {
    files.push(["lib/ai-catalog.ts", renderAiCatalog(c)]);
    files.push(["app/.well-known/ai-catalog.json/route.ts", jsonRoute("@/lib/ai-catalog", "aiCatalogJson")]);
  }
  if (f.agentSkillsIndex) {
    files.push(["lib/agent-skills-index.ts", renderAgentSkills(c)]);
    files.push(["app/.well-known/agent-skills/index.json/route.ts", jsonRoute("@/lib/agent-skills-index", "agentSkillsIndexJson")]);
  }
  if (f.schemamap) {
    files.push(["app/schemamap.xml/route.ts", schemamapRoute()]);
  }
  if (f.publicOpenApi) {
    files.push(["lib/openapi-spec.ts", renderOpenApiSpec(c)]);
    files.push(["app/openapi.json/route.ts", jsonRoute("@/lib/openapi-spec", "openApiSpec")]);
  }
  if (f.publicDeveloperDocs) {
    files.push(["lib/developer-markdown.ts", renderDeveloperMarkdown(c)]);
    files.push(["app/api.md/route.ts", routeTs("@/lib/developer-markdown", "developerMarkdown", "text/markdown")]);
  }
  if (f.mcpServerDocs) {
    files.push(["docs/agent-ready/MCP.md", renderMcpDocs(c)]);
  }
  if (f.oauthDiscovery) {
    files.push(["docs/agent-ready/OAUTH-DISCOVERY.md", renderOAuthDocs(c)]);
  }
  for (const section of f.sectionLlmsTxt ?? []) {
    const clean = section.replace(/^\//, "").replace(/\/$/, "");
    files.push([`app/${clean}/llms.txt/route.ts`, renderSectionLlmsRoute(section)]);
  }
  return files;
}

function manifestSnippet(cacheBust) {
  return `
// Add to root layout metadata alternates:
alternates: {
  types: {
    "text/plain": \`\${siteConfig.url}/llms.txt\`,
    "text/markdown": \`\${siteConfig.url}/index.md\`,
  },
},
// Bump icon cache: ?v=${cacheBust}
`;
}

const args = parseArgs(process.argv);
const config = withDefaults(JSON.parse(fs.readFileSync(path.resolve(args.config), "utf8")));
const targetRoot = path.resolve(args.target);
const written = [];

if (!fs.existsSync(targetRoot)) {
  if (args.dryRun) {
    console.log(`(dry-run: target ${targetRoot} does not exist yet)`);
  } else {
    fs.mkdirSync(targetRoot, { recursive: true });
  }
}

const files = buildFileList(config);

for (const [rel, content] of files) {
  writeFile(targetRoot, rel, content, { dryRun: args.dryRun, force: args.force, written });
}

const checklist = `# Agent-ready scaffold checklist

Generated by agent-ready-nextjs. See skill CHECKLIST.md for the full orank-aligned matrix.

## Wire-up (required)

1. \`lib/site.ts\` — \`name\`, \`domain\`, \`url\`, \`email\`, \`answer\`, \`title\`
2. Root \`layout.tsx\` — \`<CrawlerHeadLinks />\` in \`<head>\` (invisible)
3. SEO alternates — markdown → \`/index.md\`, not \`/\`
${manifestSnippet(config.crawl.cacheBust)}
4. Merge \`proxy.ts\` if the app already had middleware
5. Extend \`page-markdown.ts\` for ${config.paths.about}, ${config.paths.contact}, ${config.paths.howItWorks}
6. JSON-LD speakable when \`features.speakableJsonLd\` (see skill reference.md)
7. Delete stale \`app/apple-icon.png\` if rebranding favicons

## Feature flags in this run

${JSON.stringify(config.features, null, 2)}

## Verify

\`\`\`bash
node scripts/verify.mjs --url ${config.product.url}
node scripts/verify.mjs --url ${config.product.url} --profile full
\`\`\`
`;

writeFile(targetRoot, "AEO-SCAFFOLD-CHECKLIST.md", checklist, {
  dryRun: args.dryRun,
  force: true,
  written,
});

console.log(`\nDone. ${written.length} files. Open AEO-SCAFFOLD-CHECKLIST.md in the target app.`);
