#!/usr/bin/env node
/**
 * Verify AEO endpoints on a deployed site.
 *
 * Usage:
 *   node scripts/verify.mjs --url https://evercall.app
 *   node scripts/verify.mjs --url http://localhost:3001
 */

const checks = [
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

function parseArgs(argv) {
  let url = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--url") url = argv[++i];
  }
  if (!url) {
    console.error("Usage: node scripts/verify.mjs --url https://example.com");
    process.exit(1);
  }
  return url.replace(/\/$/, "");
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

  return { name: check.name, ok: failures.length === 0, failures };
}

const base = parseArgs(process.argv);
let failed = 0;

console.log(`Verifying ${base}\n`);

for (const check of checks) {
  try {
    const result = await runCheck(base, check);
    if (result.ok) {
      console.log(`✓ ${result.name}`);
    } else {
      failed++;
      console.log(`✗ ${result.name}`);
      for (const f of result.failures) console.log(`    ${f}`);
    }
  } catch (err) {
    failed++;
    console.log(`✗ ${check.name}`);
    console.log(`    ${err.message}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
