#!/usr/bin/env node
/**
 * carousel-press — render a .deck.md file to carousel slides.
 *
 * Surfaces (platforms that actually have a swipe carousel):
 *
 *     linkedin    1080×1080  PDF document post + PNGs
 *     instagram   1080×1350  feed carousel (4:5 PNGs)
 *     tiktok      1080×1920  photo carousel (9:16 PNGs)
 *     all         all three, in subfolders
 *
 *     node render.mjs deck.md
 *     node render.mjs deck.md --surface instagram
 *     node render.mjs deck.md --surface all -o out/
 */

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, parse as parsePath, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(ROOT, "assets");

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

const LAYOUTS = new Set([
  "cover",
  "statement",
  "quote",
  "list",
  "terminal",
  "data",
  "cta",
]);

// Named after the upload target, not the ratio. X and Facebook are not here:
// X is a 4-image grid, not a swipe carousel. Facebook feed carousels take the
// Instagram 4:5 PNGs.
const SURFACES = {
  linkedin: {
    w: 1080,
    h: 1080,
    pdf: true,
    note: "Upload the PDF to LinkedIn as a document post — that is a carousel.",
  },
  instagram: {
    w: 1080,
    h: 1350,
    pdf: false,
    note: "Upload 01.png … in order as an Instagram feed carousel (4:5).",
  },
  tiktok: {
    w: 1080,
    h: 1920,
    pdf: false,
    note: "Upload 01.png … in order as a TikTok photo carousel (9:16).",
  },
};

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function which(name) {
  const r = spawnSync("which", [name], { encoding: "utf8" });
  if (r.status === 0) {
    const found = r.stdout.trim().split("\n")[0];
    if (found) return found;
  }
  return null;
}

function findChrome() {
  if (process.env.CAROUSEL_CHROME) return process.env.CAROUSEL_CHROME;
  for (const name of ["google-chrome", "chromium", "chrome", "microsoft-edge"]) {
    const found = which(name);
    if (found) return found;
  }
  for (const path of CHROME_CANDIDATES) {
    if (existsSync(path)) return path;
  }
  die(
    "error: no Chrome/Chromium found.\n" +
      "Install Google Chrome, or set CAROUSEL_CHROME to a browser binary."
  );
}

function expandUser(p) {
  if (p.startsWith("~/")) return join(process.env.HOME || "", p.slice(2));
  if (p === "~") return process.env.HOME || p;
  return p;
}

function pad(str, n) {
  return str.length >= n ? str.slice(0, n) : str + " ".repeat(n - str.length);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function parseArgs(argv) {
  const out = {
    deck: null,
    out: null,
    surface: null,
    scale: 2,
    pngOnly: false,
    pdfOnly: false,
    check: false,
  };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    const next = () => {
      const v = args[++i];
      if (v === undefined) die(`error: ${a} needs a value`);
      return v;
    };
    if (a === "-o" || a === "--out") out.out = next();
    else if (a === "--surface") out.surface = next();
    else if (a === "--scale") out.scale = Number(next());
    else if (a === "--png-only") out.pngOnly = true;
    else if (a === "--pdf-only") out.pdfOnly = true;
    else if (a === "--check") out.check = true;
    else if (a === "-h" || a === "--help") {
      console.log(
        "Usage: node render.mjs <deck.md> [-o dir] [--surface linkedin|instagram|tiktok|all]\n" +
          "       [--scale N] [--png-only] [--pdf-only] [--check]"
      );
      process.exit(0);
    } else if (a.startsWith("-")) die(`error: unknown flag ${a}`);
    else if (!out.deck) out.deck = a;
    else die(`error: unexpected argument ${a}`);
  }
  if (!out.deck) die("error: missing deck file");
  if (!Number.isFinite(out.scale) || out.scale < 1) die("error: --scale must be a positive number");
  return out;
}

function parseFrontmatter(text) {
  const meta = {};
  if (!text.startsWith("---")) return { meta, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { meta, body: text };
  for (const line of text.slice(3, end).trim().split("\n")) {
    if (!line.includes(":") || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
    meta[key] = value;
  }
  return { meta, body: text.slice(end + 4) };
}

function blankSlide() {
  return {
    layout: "statement",
    dark: false,
    eyebrow: null,
    heading: null,
    paras: [],
    quote: [],
    attr: null,
    items: [],
    lines: [],
    stat: null,
    label: null,
  };
}

function parseSlides(body) {
  const slides = [];
  let current = null;
  for (const raw of body.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    const stripped = line.trim();

    if (stripped.startsWith(":::")) {
      const tokens = stripped.slice(3).trim().split(/\s+/).filter(Boolean);
      if (current !== null && tokens.length === 0) {
        slides.push(current);
        current = null;
        continue;
      }
      if (current !== null) slides.push(current);
      const layout = tokens.find((t) => LAYOUTS.has(t)) || "statement";
      current = blankSlide();
      current.layout = layout;
      current.dark = tokens.includes("dark");
      continue;
    }

    if (current === null || !stripped) continue;

    const low = stripped.toLowerCase();
    if (low.startsWith("eyebrow:")) current.eyebrow = stripped.split(":").slice(1).join(":").trim();
    else if (low.startsWith("stat:")) current.stat = stripped.split(":").slice(1).join(":").trim();
    else if (low.startsWith("label:")) current.label = stripped.split(":").slice(1).join(":").trim();
    else if (stripped.startsWith("#")) current.heading = stripped.replace(/^#+/, "").trim();
    else if (stripped.startsWith(">")) current.quote.push(stripped.slice(1).trim());
    else if (
      stripped.startsWith("—") ||
      stripped.startsWith("--") ||
      stripped.startsWith("– ")
    ) {
      current.attr = stripped.replace(/^[—\-–\s]+/, "").trim();
    } else if (stripped.startsWith("$")) current.lines.push(["cmd", stripped.slice(1).trim()]);
    else if (/^(\d+\.|[-*])\s+/.test(stripped)) {
      current.items.push(stripped.replace(/^(\d+\.|[-*])\s+/, ""));
    } else if (current.layout === "terminal") current.lines.push(["out", stripped]);
    else current.paras.push(stripped);
  }
  if (current !== null) slides.push(current);
  return slides;
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "<em>$1</em>");
  out = out.replace(/`(.+?)`/g, '<span class="code">$1</span>');
  return out;
}

function renderSlide(slide, meta, index, total) {
  const layout = slide.layout;
  const parts = [];

  if (slide.eyebrow) {
    const accent = layout === "cover" || layout === "cta" ? " accent" : "";
    parts.push(`<div class="eyebrow${accent}">${inline(slide.eyebrow)}</div>`);
  }

  const blocks = [];
  if (slide.heading) blocks.push(`<h1>${inline(slide.heading)}</h1>`);

  if (layout === "quote" && slide.quote.length) {
    blocks.push(`<div class="q">${inline(slide.quote.join(" "))}</div>`);
    if (slide.attr) blocks.push(`<div class="attr">${inline(slide.attr)}</div>`);
  }

  if (layout === "data" && slide.stat) {
    blocks.push(`<div class="stat">${inline(slide.stat)}</div>`);
    if (slide.label) blocks.push(`<div class="stat-label">${inline(slide.label)}</div>`);
  }

  if (layout === "list" && slide.items.length) {
    const rows = slide.items.map((item, i) => {
      const cut = item.indexOf("::");
      const title = cut === -1 ? item : item.slice(0, cut);
      const sub = cut === -1 ? "" : item.slice(cut + 2);
      let cell = `<strong>${inline(title.trim())}</strong>`;
      if (sub.trim()) cell += `<span>${inline(sub.trim())}</span>`;
      const n = String(i + 1).padStart(2, "0");
      return `<li><span class="n">${n}</span><span class="t">${cell}</span></li>`;
    });
    blocks.push(`<ul class="list">${rows.join("")}</ul>`);
  }

  if (layout === "terminal" && slide.lines.length) {
    const rows = slide.lines
      .map(([kind, text]) => `<div class="line ${kind}">${inline(text)}</div>`)
      .join("");
    blocks.push(`<div class="term">${rows}</div>`);
  }

  for (const para of slide.paras) blocks.push(`<p>${inline(para)}</p>`);

  const align = layout === "list" && slide.items.length > 6 ? " top" : "";
  const dark = slide.dark ? " dark" : "";
  const cover = layout === "cover" ? " cover" : "";
  const handle = escapeHtml(meta.handle || "");
  const footer = escapeHtml(meta.footer || "");
  const counter = `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const right = layout === "cta" && footer ? footer : counter;
  const headHtml = parts.length ? `<div class="head">${parts.join("")}</div>` : "";

  return `<section class="slide ${layout}${dark}${cover}">
  ${headHtml}
  <div class="body${align}">${blocks.join("")}</div>
  <div class="foot"><span class="handle">${handle}</span><span>${right}</span></div>
</section>`;
}

const FIT_SCRIPT = `
<script>
// Shrink oversized display type until the slide stops overflowing. Keeps long
// headlines from clipping without forcing the author to count characters.
for (const slide of document.querySelectorAll('.slide')) {
  const body = slide.querySelector('.body');
  const targets = slide.querySelectorAll('h1, .q, .stat, .term, .list');
  let guard = 0;
  while (body.scrollHeight > body.clientHeight && guard < 40) {
    for (const el of targets) {
      const size = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = (size * 0.96) + 'px';
    }
    guard++;
  }
}
document.documentElement.setAttribute('data-fitted', '1');
</script>
`;

function buildPage(slidesHtml, accent, w, h) {
  let css = readFileSync(join(ASSETS, "theme.css"), "utf8");
  css += `
:root { --stage-w: ${w}px; --stage-h: ${h}px; }
@page { size: ${w}px ${h}px; margin: 0; }
`;
  if (accent) css += `\n:root { --accent: ${accent}; }\n`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>${css}
.code { font-family: var(--mono); font-size: 0.86em; color: var(--accent); }
</style></head>
<body>${slidesHtml}${FIT_SCRIPT}</body></html>`;
}

function chromeRun(chrome, extra, htmlPath) {
  const result = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-sandbox",
      "--allow-file-access-from-files",
      "--virtual-time-budget=4000",
      ...extra,
      pathToFileURL(htmlPath).href,
    ],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim().split("\n");
    const tail = detail.filter(Boolean).at(-1) || "unknown error";
    die(`error: chrome failed (${tail})`);
  }
}

function renderSurface(chrome, slides, meta, outDir, surface, scale, pngOnly, pdfOnly, stem) {
  const spec = SURFACES[surface];
  const { w, h } = spec;
  const accent = meta.accent;
  const total = slides.length;
  mkdirSync(outDir, { recursive: true });
  let wantPng = !pdfOnly;
  let wantPdf = spec.pdf || (pdfOnly && !pngOnly);
  if (pngOnly) wantPdf = false;

  const tmpDir = mkdtempSync(join(tmpdir(), "carousel-press-"));
  try {
    if (wantPng) {
      slides.forEach((slide, i) => {
        const n = i + 1;
        const src = join(tmpDir, `s${String(n).padStart(2, "0")}.html`);
        writeFileSync(src, buildPage(renderSlide(slide, meta, n, total), accent, w, h));
        const png = join(outDir, `${String(n).padStart(2, "0")}.png`);
        chromeRun(
          chrome,
          [
            `--screenshot=${png}`,
            `--window-size=${w},${h}`,
            `--force-device-scale-factor=${scale}`,
          ],
          src
        );
        console.log(`  wrote ${surface}/${String(n).padStart(2, "0")}.png (${w}×${h})`);
      });
    }
    if (wantPdf) {
      const all = slides.map((s, i) => renderSlide(s, meta, i + 1, total)).join("");
      const src = join(tmpDir, "deck.html");
      writeFileSync(src, buildPage(all, accent, w, h));
      const pdf = join(outDir, `${stem}.pdf`);
      chromeRun(chrome, [`--print-to-pdf=${pdf}`, "--no-pdf-header-footer"], src);
      console.log(`  wrote ${surface}/${stem}.pdf`);
    }
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
  console.log(`  ${spec.note}`);
}

function slideHasContent(s) {
  return Boolean(
    s.heading || s.quote.length || s.items.length || s.lines.length || s.stat || s.paras.length
  );
}

function main() {
  const args = parseArgs(process.argv);
  const deckPath = resolve(expandUser(args.deck));
  if (!existsSync(deckPath)) die(`error: ${deckPath} not found`);

  const { meta, body } = parseFrontmatter(readFileSync(deckPath, "utf8"));
  const slides = parseSlides(body);

  if (!slides.length) {
    die("error: no slides found. Blocks look like:\n\n::: cover\n# Headline\n:::");
  }

  const empty = slides
    .map((s, i) => (slideHasContent(s) ? null : i + 1))
    .filter(Boolean);
  if (empty.length) die(`error: slide(s) ${empty.join(", ")} have no content`);

  const surface = (args.surface || meta.surface || "linkedin").trim().toLowerCase();
  if (!(surface in SURFACES) && surface !== "all") {
    die(`error: unknown surface '${surface}'. Use: ${Object.keys(SURFACES).join(", ")}, all`);
  }

  const targets = surface === "all" ? Object.keys(SURFACES) : [surface];
  const total = slides.length;
  const { base, name } = parsePath(deckPath);
  console.log(`${base}: ${total} slides → ${targets.join(", ")}`);
  slides.forEach((s, i) => {
    const label = s.heading || s.quote[0] || s.stat || "";
    const flag = s.dark ? " dark" : "";
    console.log(
      `  ${String(i + 1).padStart(2, "0")}  ${pad(s.layout, 9)}${pad(flag, 5)} ${label.slice(0, 52)}`
    );
  });

  if (total > 20) console.log("\nwarning: carousels past ~12 slides lose readers.");

  if (args.check) {
    console.log("\nok — nothing rendered (--check)");
    return 0;
  }

  const outDir = args.out
    ? resolve(expandUser(args.out))
    : join(dirname(deckPath), `${name}-out`);
  const chrome = findChrome();
  console.log();

  for (const surf of targets) {
    const dest = surface === "all" ? join(outDir, surf) : outDir;
    renderSurface(
      chrome,
      slides,
      meta,
      dest,
      surf,
      args.scale,
      args.pngOnly,
      args.pdfOnly,
      name
    );
    console.log();
  }

  console.log(outDir);
  return 0;
}

process.exit(main());
