#!/usr/bin/env node
/**
 * Verify agent-readiness endpoints.
 *
 * Usage:
 *   node scripts/verify.mjs --url https://example.com
 *   node scripts/verify.mjs --url http://localhost:3000 --profile full
 */

const CORE_CHECKS = [
  {
    name: "llms.txt",
    path: "/llms.txt",
    expectStatus: 200,
    bodyIncludes: ["# "],
  },
  {
    name: "agent-instructions.txt",
    path: "/agent-instructions.txt",
    expectStatus: 200,
    bodyIncludes: ["agent instructions"],
  },
  {
    name: "index.md",
    path: "/index.md",
    expectStatus: 200,
    contentTypeIncludes: "text/markdown",
    bodyStartsWith: "---",
  },
  {
    name: "robots.txt schemamap",
    path: "/robots.txt",
    expectStatus: 200,
    bodyIncludes: ["schemamap:", "Sitemap:"],
  },
  {
    name: "ai-catalog.json",
    path: "/.well-known/ai-catalog.json",
    expectStatus: 200,
    bodyIncludes: ['"entries"'],
  },
  {
    name: "agent-skills index",
    path: "/.well-known/agent-skills/index.json",
    expectStatus: 200,
    bodyIncludes: ['"skills"'],
  },
  {
    name: "Accept markdown homepage",
    path: "/",
    headers: { Accept: "text/markdown" },
    expectStatus: 200,
    contentTypeIncludes: "text/markdown",
  },
  {
    name: "Link headers",
    path: "/",
    expectStatus: 200,
    headerIncludes: { Link: ["/index.md", "/llms.txt"] },
  },
];

const FULL_CHECKS = [
  {
    name: "openapi.json (optional)",
    path: "/openapi.json",
    expectStatus: 200,
    bodyIncludes: ['"openapi"'],
    optional: true,
  },
  {
    name: "schemamap.xml",
    path: "/schemamap.xml",
    expectStatus: 200,
    bodyIncludes: ["<schemamap"],
  },
  {
    name: "agent mode query",
    path: "/?mode=agent",
    headers: { Accept: "text/html" },
    expectStatus: 200,
    optional: true,
  },
];

function parseArgs(argv) {
  let url = null;
  let profile = "core";
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--url") url = argv[++i];
    else if (argv[i] === "--profile") profile = argv[++i];
  }
  if (!url) {
    console.error(
      "Usage: node scripts/verify.mjs --url https://example.com [--profile core|full]"
    );
    process.exit(1);
  }
  return { base: url.replace(/\/$/, ""), profile };
}

async function runCheck(base, check) {
  const res = await fetch(`${base}${check.path}`, {
    headers: check.headers ?? {},
    redirect: "follow",
  });
  const body = await res.text();
  const ct = res.headers.get("content-type") ?? "";
  const failures = [];

  if (res.status !== check.expectStatus) {
    failures.push(`status ${res.status} !== ${check.expectStatus}`);
  }
  if (check.contentTypeIncludes && !ct.includes(check.contentTypeIncludes)) {
    failures.push(`content-type "${ct}" missing ${check.contentTypeIncludes}`);
  }
  for (const needle of check.bodyIncludes ?? []) {
    if (!body.includes(needle)) failures.push(`body missing "${needle}"`);
  }
  if (check.bodyStartsWith && !body.startsWith(check.bodyStartsWith)) {
    failures.push(`body does not start with ${check.bodyStartsWith}`);
  }
  if (check.headerIncludes) {
    const link = res.headers.get("Link") ?? "";
    for (const [key, needles] of Object.entries(check.headerIncludes)) {
      const val = key === "Link" ? link : res.headers.get(key) ?? "";
      for (const n of needles) {
        if (!val.includes(n)) failures.push(`header ${key} missing "${n}"`);
      }
    }
  }

  return { name: check.name, ok: failures.length === 0, failures, optional: check.optional };
}

const { base, profile } = parseArgs(process.argv);
const checks = profile === "full" ? [...CORE_CHECKS, ...FULL_CHECKS] : CORE_CHECKS;
let failed = 0;

console.log(`Verifying ${base} (profile: ${profile})\n`);

for (const check of checks) {
  try {
    const result = await runCheck(base, check);
    if (result.ok) {
      console.log(`✓ ${result.name}`);
    } else if (result.optional) {
      console.log(`○ ${result.name} (optional — skipped)`);
    } else {
      failed++;
      console.log(`✗ ${result.name}`);
      for (const f of result.failures) console.log(`    ${f}`);
    }
  } catch (err) {
    if (check.optional) {
      console.log(`○ ${check.name} (optional — ${err.message})`);
    } else {
      failed++;
      console.log(`✗ ${check.name}`);
      console.log(`    ${err.message}`);
    }
  }
}

console.log(failed ? `\n${failed} required check(s) failed` : "\nAll required checks passed");
process.exit(failed ? 1 : 0);
