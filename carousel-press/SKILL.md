---
name: carousel-press
description: Turn writing into LinkedIn carousel slides in a warm editorial letterpress style — oversized serif headlines, mono eyebrows, hairline rules, one accent color, and a dot-grid dark treatment. Writes a .deck.md file and renders 1080x1080 PNGs plus the square PDF that LinkedIn document posts require, using headless Chrome with no dependencies to install. Auto-applies when turning a post, article, README, or skill into slides. Triggered by /carousel-press.
user_invocable: true
---

# Carousel Press

Renders a plain-text deck file into LinkedIn carousel slides with a fixed, opinionated design system. No template picking, no drag-and-drop, no AI-generated imagery.

**Division of labour:** you do the editorial work — choosing the argument, cutting the words, sequencing the slides. `scripts/render.py` does the rendering, deterministically. Never hand-build HTML for slides; write the deck file and render it.

---

## Why a PDF

On LinkedIn, a "carousel" is a **document post**, and documents are PDFs. The renderer emits both:

- `<name>.pdf` — upload this to LinkedIn
- `01.png … NN.png` at 2160×2160 — for X, Instagram, blog embeds, or previews

---

## Workflow

1. **Find the one argument.** A carousel makes a single point. If the source has three, make three carousels.
2. **Write the deck** to `<name>.deck.md` using the format below.
3. **Validate:** `python3 scripts/render.py <name>.deck.md --check`
4. **Render:** `python3 scripts/render.py <name>.deck.md`
5. **Look at the output** before handing it over. Read at least the cover and one interior slide as images and check for overflow or awkward wraps.

---

## Deck format

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
- Another :: second line is optional
:::

::: data dark
stat: 70%
label: WHAT THE NUMBER MEANS
:::

::: terminal dark
$ npx skills add owner/repo --skill name
Output or supporting line.
:::

::: cta dark
# Closing line.
:::
````

### Layouts

| Layout | Use for |
|--------|---------|
| `cover` | Slide 1 only. Eyebrow, big headline, one supporting line. |
| `statement` | One idea per slide. The workhorse — default if unspecified. |
| `quote` | A real quotation. Accent left rule, mono attribution. |
| `list` | 3–6 items. Auto-numbered `01`, `02`. Use `::` for a sub-line. |
| `data` | One number that carries the slide. |
| `terminal` | Install commands. `$` prefix renders as a prompt. |
| `cta` | Final slide. Shows `footer` instead of the slide counter. |

Add `dark` to any layout for the inverted treatment with the dot grid.

### Inline formatting

- `*phrase*` → accent italic serif. **The signature move — use it once per headline, never twice.**
- `**phrase**` → emphasis in the foreground color
- `` `code` `` → mono, accent colored

---

## Editorial rules

These matter more than the design, because the design is already handled.

**One idea per slide.** If a slide needs a comma-spliced second clause, it is two slides.

**Headlines under 12 words.** The type is 104px. Long headlines auto-shrink, and a shrunken headline is a wasted slide.

**Body text under 30 words.** People swipe. A paragraph is a signal you should have cut.

**8–10 slides.** Under 6 feels thin, over 12 loses people.

**Accent one phrase per headline.** The orange italic is load-bearing. Two on a slide and neither reads.

**Never invent a quotation or a statistic.** Attribute every quote to a real, checkable source. If you cannot verify it, cut the slide.

**Vary the rhythm.** Do not run four `statement` slides in a row. Alternate light and dark, and break up prose with a `data`, `quote`, or `list`.

**Last slide asks for one thing.** One install command or one link. Never both.

### Sequencing that works

```
cover        the claim, stated flatly
statement    the problem the reader recognizes
quote/data   evidence from a real source
statement    the reframe — the thing they haven't considered
list         the system or the steps
terminal     how to get it
cta          the line worth screenshotting
```

---

## Rendering

```bash
python3 scripts/render.py deck.md              # PNGs + PDF
python3 scripts/render.py deck.md --check      # validate, render nothing
python3 scripts/render.py deck.md -o out/      # output directory
python3 scripts/render.py deck.md --pdf-only
python3 scripts/render.py deck.md --scale 1    # 1080px instead of 2160px
```

Uses headless Chrome, already installed on most machines. Override with `CAROUSEL_CHROME=/path/to/browser`. Fonts load from Google Fonts on first render, so the initial run needs network; it falls back to system serif, sans, and mono offline.

---

## When this applies

**Apply when:** converting a post, article, README, thread, or skill into slides; the user says carousel, LinkedIn document, or slide deck for social.

**Do not apply when:** the user wants a presentation to speak over (different medium, different density), an editable PowerPoint, or a single OG image.

---

## Anti-patterns

- **Hand-writing HTML instead of a deck file.** The renderer is the mechanism; bypassing it loses the design system.
- **Cramming a paragraph onto a slide.** Cut it or split it.
- **Fabricated quotes or numbers.** Disqualifying.
- **Two accented phrases in one headline.**
- **Shipping without looking at the images.** Always read at least two rendered slides before delivering.
- **A cover that describes instead of claims.** "Thoughts on productivity" is not a cover. "You lose the first hour rebuilding Friday" is.
