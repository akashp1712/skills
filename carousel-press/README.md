# Carousel Press

**Write a text file. Get carousel slides for the platforms that actually have carousels.**

An opinionated design system in a warm editorial letterpress style — oversized Instrument Serif headlines, mono eyebrows at wide tracking, hairline rules instead of boxes, one accent color, and a masked dot-grid on dark slides.

No template picker. No drag-and-drop. No AI-generated imagery. One deck file in, slides out.

![Cover slide](examples/preview/cover.png)

---

## Install

```bash
npx skills add akashp1712/skills --skill carousel-press
```

Renders through **headless Chrome**, which you almost certainly already have. Uses the **Node** that came with `npx skills add`. No Python, no `npm install`, no Playwright.

---

## Use

```bash
node scripts/render.mjs mypost.deck.md
node scripts/render.mjs mypost.deck.md --surface instagram
node scripts/render.mjs mypost.deck.md --surface tiktok
node scripts/render.mjs mypost.deck.md --surface all -o out/
```

```
mypost.deck.md: 9 slides → instagram
  01  cover     dark Amazon runs on mechanisms. You run on *good intentions*.
  ...
  wrote instagram/01.png (1080×1350)
  wrote instagram/09.png (1080×1350)
  Upload 01.png … in order as an Instagram feed carousel (4:5).
```

| Surface | Size | Upload |
|---------|------|--------|
| `linkedin` (default) | 1080×1080 | PDF document post + square PNGs |
| `instagram` | 1080×1350 (4:5) | PNGs as a feed carousel |
| `tiktok` | 1080×1920 (9:16) | PNGs as a photo carousel |
| `all` | all three | subfolders under `-o` |

X is not a swipe carousel (it is a 4-image grid). Facebook takes the Instagram 4:5 PNGs.

Default LinkedIn output is **2× retina PNGs** plus the **square PDF**. The PDF matters: on LinkedIn a carousel *is* a document post, and documents are PDFs. Instagram and TikTok get PNGs only.

---

## The deck format

````markdown
---
handle: "@yourhandle"
footer: yoursite.com
accent: "#f7591f"
---

::: cover dark
eyebrow: SECTION LABEL
# Headline with an *accented phrase*.
Optional supporting line.
:::

::: quote
> The quoted sentence.
— Attribution
:::

::: list
eyebrow: FIVE THINGS
- Title :: supporting line after the double colon
:::

::: data dark
stat: 70%
label: WHAT THE NUMBER MEANS
:::

::: terminal dark
$ npx skills add owner/repo --skill name
:::

::: cta dark
# The line worth screenshotting.
:::
````

`*phrase*` renders as accent italic serif — the signature move. One per headline.

Seven layouts: `cover`, `statement`, `quote`, `list`, `data`, `terminal`, `cta`. Add `dark` to any of them.

| | |
|---|---|
| ![Quote](examples/preview/quote.png) | ![List](examples/preview/list.png) |

---

## What it handles for you

**Auto-fit.** Oversized headlines shrink until they fit rather than clipping. You write the sentence; the renderer solves the layout.

**Auto-numbering.** List items get `01`, `02`, `03` in mono accent with hairline separators between them.

**Slide counters** in the footer, and the final `cta` slide swaps the counter for your link.

**Hanging indents** on terminal commands, so a wrapped command aligns under itself instead of under the `$`.

**Retina output** at 2× by default (2160 wide). Use `--scale 1` for 1080-wide files.

---

## Options

```bash
node scripts/render.mjs deck.md --surface instagram
node scripts/render.mjs deck.md --surface tiktok
node scripts/render.mjs deck.md --surface all -o out/
node scripts/render.mjs deck.md --check      # validate, render nothing
node scripts/render.mjs deck.md -o out/      # output directory
node scripts/render.mjs deck.md --pdf-only
node scripts/render.mjs deck.md --png-only
node scripts/render.mjs deck.md --scale 1
```

Or set `surface: instagram` in the deck frontmatter. `--surface` on the command line wins.

Override the browser with `CAROUSEL_CHROME=/path/to/chrome`. Fonts load from Google Fonts on first render; offline it falls back to system serif, sans, and mono.

---

## The design system

Tokens follow [littlemight.com](https://www.littlemight.com) — a strict four-color palette and three typefaces, each with exactly one job.

```css
--paper:  #f5f4ed    /* warm off-white */
--ink:    #0b0d0b    /* near-black, faintly green */
--muted:  #52534e    /* warm gray */
--accent: #f7591f    /* burnt orange — the only color */
```

Instrument Serif at weight 400 for display, Inter for body, Geist Mono for eyebrows and metadata. Dark slides invert to ink with a warm opacity ladder rather than gray, plus a masked dot grid.

Everything lives in [`assets/theme.css`](assets/theme.css). Change `accent` in your deck frontmatter for a one-off, or edit the file to make it yours.

**No icons and no illustrations, by design.** The visual identity is type and rules. Adding an icon set breaks it.

---

## Editorial rules

The design is handled. These are what actually decide whether the carousel works.

- **One idea per slide.** A comma-spliced second clause means it is two slides.
- **Headlines under 12 words.** The type is 104px; long headlines auto-shrink, and a shrunken headline is a wasted slide.
- **8–10 slides.** Under 6 feels thin, over 12 loses people.
- **One accented phrase per headline.** Two and neither reads.
- **Never invent a quote or a statistic.** Attribute to a real, checkable source or cut the slide.
- **Vary the rhythm.** Alternate light and dark; break prose with a `data`, `quote`, or `list`.
- **The last slide asks for one thing.** One command or one link, never both.

A sequence that reliably works:

```
cover        the claim, stated flatly
statement    the problem they recognize
quote/data   evidence from a real source
statement    the reframe they haven't considered
list         the system
terminal     how to get it
cta          the line worth screenshotting
```

---

## Example

Rendered decks (PDF + PNGs + post copy) live in [`carousels/`](../carousels). Example:

```bash
node scripts/render.mjs ../carousels/carousel-press/carousel-press.deck.md
```

---

## Companion skills

| Skill | Use |
|-------|-----|
| [amazon-writing](../amazon-writing) | Cut the source text before it becomes slides |
| [four-answers](../four-answers) | Kill weasel words — fatal at 104px |
| [and-nothing-else](../and-nothing-else) | Kill the extra slide you did not ask for |

MIT licensed.
