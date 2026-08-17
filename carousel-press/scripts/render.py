#!/usr/bin/env python3
"""carousel-press — render a .deck.md file to LinkedIn carousel slides.

Outputs 1080x1080 PNGs and a square PDF. LinkedIn document posts (what the
UI calls a carousel) take the PDF; the PNGs are for anywhere else.

Rendering goes through headless Chrome, so there is nothing to install.

    python3 render.py deck.md                 # PNGs + PDF
    python3 render.py deck.md -o out/         # choose the output directory
    python3 render.py deck.md --check         # validate, render nothing
    python3 render.py deck.md --pdf-only
"""

import argparse
import html
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets"

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]

LAYOUTS = {"cover", "statement", "quote", "list", "terminal", "data", "cta"}


def find_chrome() -> str:
    for name in ("google-chrome", "chromium", "chrome", "microsoft-edge"):
        found = shutil.which(name)
        if found:
            return found
    for path in CHROME_CANDIDATES:
        if os.path.exists(path):
            return path
    sys.exit(
        "error: no Chrome/Chromium found.\n"
        "Install Google Chrome, or set CAROUSEL_CHROME to a browser binary."
    )


# ---------------------------------------------------------------- parsing


def parse_frontmatter(text: str):
    meta = {}
    if not text.startswith("---"):
        return meta, text
    end = text.find("\n---", 3)
    if end == -1:
        return meta, text
    for line in text[3:end].strip().splitlines():
        if ":" not in line or line.strip().startswith("#"):
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip().strip("\"'")
    return meta, text[end + 4 :]


def parse_slides(body: str):
    slides, current = [], None
    for raw in body.splitlines():
        line = raw.rstrip()
        stripped = line.strip()

        if stripped.startswith(":::"):
            tokens = stripped[3:].split()
            if current is not None and not tokens:
                slides.append(current)
                current = None
                continue
            if current is not None:
                slides.append(current)
            layout = next((t for t in tokens if t in LAYOUTS), "statement")
            current = {
                "layout": layout,
                "dark": "dark" in tokens,
                "eyebrow": None,
                "heading": None,
                "paras": [],
                "quote": [],
                "attr": None,
                "items": [],
                "lines": [],
                "stat": None,
                "label": None,
            }
            continue

        if current is None or not stripped:
            continue

        low = stripped.lower()
        if low.startswith("eyebrow:"):
            current["eyebrow"] = stripped.split(":", 1)[1].strip()
        elif low.startswith("stat:"):
            current["stat"] = stripped.split(":", 1)[1].strip()
        elif low.startswith("label:"):
            current["label"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("#"):
            current["heading"] = stripped.lstrip("#").strip()
        elif stripped.startswith(">"):
            current["quote"].append(stripped[1:].strip())
        elif stripped.startswith(("—", "--", "– ")):
            current["attr"] = stripped.lstrip("—-– ").strip()
        elif stripped.startswith("$"):
            current["lines"].append(("cmd", stripped[1:].strip()))
        elif re.match(r"^(\d+\.|[-*])\s+", stripped):
            current["items"].append(re.sub(r"^(\d+\.|[-*])\s+", "", stripped))
        elif current["layout"] == "terminal":
            current["lines"].append(("out", stripped))
        else:
            current["paras"].append(stripped)

    if current is not None:
        slides.append(current)
    return slides


def inline(text: str) -> str:
    out = html.escape(text)
    out = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"<em>\1</em>", out)
    out = re.sub(r"`(.+?)`", r'<span class="code">\1</span>', out)
    return out


# ---------------------------------------------------------------- rendering


def render_slide(slide, meta, index, total) -> str:
    layout = slide["layout"]
    parts = []

    if slide["eyebrow"]:
        accent = " accent" if layout in ("cover", "cta") else ""
        parts.append(f'<div class="eyebrow{accent}">{inline(slide["eyebrow"])}</div>')

    head = "".join(parts)
    blocks = []

    if slide["heading"]:
        blocks.append(f"<h1>{inline(slide['heading'])}</h1>")

    if layout == "quote" and slide["quote"]:
        text = " ".join(slide["quote"])
        blocks.append(f'<div class="q">{inline(text)}</div>')
        if slide["attr"]:
            blocks.append(f'<div class="attr">{inline(slide["attr"])}</div>')

    if layout == "data" and slide["stat"]:
        blocks.append(f'<div class="stat">{inline(slide["stat"])}</div>')
        if slide["label"]:
            blocks.append(f'<div class="stat-label">{inline(slide["label"])}</div>')

    if layout == "list" and slide["items"]:
        rows = []
        for i, item in enumerate(slide["items"], 1):
            title, _, sub = item.partition("::")
            cell = f"<strong>{inline(title.strip())}</strong>"
            if sub.strip():
                cell += f"<span>{inline(sub.strip())}</span>"
            rows.append(
                f'<li><span class="n">{i:02d}</span><span class="t">{cell}</span></li>'
            )
        blocks.append(f'<ul class="list">{"".join(rows)}</ul>')

    if layout == "terminal" and slide["lines"]:
        rows = "".join(
            f'<div class="line {kind}">{inline(text)}</div>'
            for kind, text in slide["lines"]
        )
        blocks.append(f'<div class="term">{rows}</div>')

    for para in slide["paras"]:
        blocks.append(f"<p>{inline(para)}</p>")

    align = " top" if layout == "list" and len(slide["items"]) > 6 else ""
    dark = " dark" if slide["dark"] else ""
    cover = " cover" if layout == "cover" else ""

    handle = html.escape(meta.get("handle", ""))
    footer = html.escape(meta.get("footer", ""))
    counter = f"{index:02d} / {total:02d}"
    right = footer if (layout == "cta" and footer) else counter

    head_html = f'<div class="head">{head}</div>' if head else ""

    return f"""<section class="slide {layout}{dark}{cover}">
  {head_html}
  <div class="body{align}">{"".join(blocks)}</div>
  <div class="foot"><span class="handle">{handle}</span><span>{right}</span></div>
</section>"""


FIT_SCRIPT = """
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
"""


def build_page(slides_html: str, accent: str | None) -> str:
    css = (ASSETS / "theme.css").read_text()
    if accent:
        css += f"\n:root {{ --accent: {accent}; }}\n"
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>{css}
.code {{ font-family: var(--mono); font-size: 0.86em; color: var(--accent); }}
</style></head>
<body>{slides_html}{FIT_SCRIPT}</body></html>"""


def chrome_run(chrome: str, args: list[str], html_path: Path) -> None:
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-sandbox",
        "--allow-file-access-from-files",
        "--virtual-time-budget=4000",
        *args,
        html_path.as_uri(),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "").strip().splitlines()
        tail = detail[-1] if detail else "unknown error"
        sys.exit(f"error: chrome failed ({tail})")


def main() -> int:
    ap = argparse.ArgumentParser(description="Render a .deck.md to carousel slides.")
    ap.add_argument("deck")
    ap.add_argument("-o", "--out", help="output directory")
    ap.add_argument("--scale", type=int, default=2, help="pixel density (default 2)")
    ap.add_argument("--png-only", action="store_true")
    ap.add_argument("--pdf-only", action="store_true")
    ap.add_argument("--check", action="store_true", help="validate only")
    args = ap.parse_args()

    deck_path = Path(args.deck).expanduser().resolve()
    if not deck_path.is_file():
        sys.exit(f"error: {deck_path} not found")

    meta, body = parse_frontmatter(deck_path.read_text())
    slides = parse_slides(body)

    if not slides:
        sys.exit("error: no slides found. Blocks look like:\n\n::: cover\n# Headline\n:::")

    empty = [
        i
        for i, s in enumerate(slides, 1)
        if not any((s["heading"], s["quote"], s["items"], s["lines"], s["stat"], s["paras"]))
    ]
    if empty:
        sys.exit(f"error: slide(s) {', '.join(map(str, empty))} have no content")

    total = len(slides)
    print(f"{deck_path.name}: {total} slides")
    for i, s in enumerate(slides, 1):
        label = s["heading"] or (s["quote"][0] if s["quote"] else s["stat"]) or ""
        flag = " dark" if s["dark"] else ""
        print(f"  {i:02d}  {s['layout']:<9}{flag:<5} {label[:52]}")

    if total > 20:
        print("\nwarning: LinkedIn documents cap at 300 pages, but carousels "
              "past ~12 slides lose readers.")

    if args.check:
        print("\nok — nothing rendered (--check)")
        return 0

    out_dir = Path(args.out).expanduser() if args.out else deck_path.parent / f"{deck_path.stem}-out"
    out_dir.mkdir(parents=True, exist_ok=True)

    chrome = os.environ.get("CAROUSEL_CHROME") or find_chrome()
    accent = meta.get("accent")
    print()

    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)

        if not args.pdf_only:
            for i, slide in enumerate(slides, 1):
                page = build_page(render_slide(slide, meta, i, total), accent)
                src = tmp_dir / f"s{i:02d}.html"
                src.write_text(page)
                png = out_dir / f"{i:02d}.png"
                chrome_run(
                    chrome,
                    [
                        f"--screenshot={png}",
                        "--window-size=1080,1080",
                        f"--force-device-scale-factor={args.scale}",
                    ],
                    src,
                )
                print(f"  wrote {png.name}")

        if not args.png_only:
            allslides = "".join(
                render_slide(s, meta, i, total) for i, s in enumerate(slides, 1)
            )
            src = tmp_dir / "deck.html"
            src.write_text(build_page(allslides, accent))
            pdf = out_dir / f"{deck_path.stem}.pdf"
            chrome_run(
                chrome,
                [f"--print-to-pdf={pdf}", "--no-pdf-header-footer"],
                src,
            )
            print(f"  wrote {pdf.name}")

    print(f"\n{out_dir}")
    if not args.png_only:
        print("Upload the PDF to LinkedIn as a document post — that is a carousel.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
