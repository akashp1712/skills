---
name: carousel-press
description: Turn writing into swipe-carousel slides for LinkedIn, Instagram, and TikTok in a warm editorial letterpress style — oversized serif headlines, mono eyebrows, hairline rules, one accent color, and a dot-grid dark treatment. Writes a .deck.md file and renders the size each platform actually wants (LinkedIn square PDF, Instagram 4:5 PNGs, TikTok 9:16 PNGs) using headless Chrome with no dependencies to install. Auto-applies when turning a post, article, README, or skill into slides. Triggered by /carousel-press.
user_invocable: true
---

# Carousel Press

Renders a plain-text deck file into swipe-carousel slides with a fixed, opinionated design system. No template picking, no drag-and-drop, no AI-generated imagery. Same deck, three surfaces: LinkedIn, Instagram, TikTok.

**Division of labour:** you (the agent) do the editorial work and run the renderer. The human never has to touch `scripts/render.mjs`. They get files they can upload. Never hand-build HTML for slides; write the deck file and render it yourself.

---

## Surfaces

Only platforms that have a **swipe carousel**. Named after the upload target, not the ratio.

| `--surface` | Size | What to upload |
|-------------|------|----------------|
| `linkedin` (default) | 1080×1080 | PDF as a document post, plus square PNGs |
| `instagram` | 1080×1350 (4:5) | PNGs in order as a feed carousel |
| `tiktok` | 1080×1920 (9:16) | PNGs in order as a photo carousel |
| `all` | all three | subfolders under `-o` |

X is a 4-image grid, not a swipe carousel — do not render a surface for it. Facebook feed carousels take the Instagram 4:5 PNGs.

Type sizes stay the same across surfaces. Extra vertical room on 4:5 and 9:16 is the format, not a cue to write more.

---

## Workflow

You run every step. Do not paste these commands for the human to execute.

1. **Find the one argument.** A carousel makes a single point. If the source has three, make three carousels.
2. **Pick the surface** if they named a platform. If they did not, default to LinkedIn. If they said "Instagram and TikTok" or "everywhere," use `--surface all`.
3. **Write the deck** to `<name>.deck.md` using the format below.
4. **Validate, then render** from this skill's directory (so `scripts/render.mjs` resolves):

```bash
node scripts/render.mjs <name>.deck.md --check
node scripts/render.mjs <name>.deck.md --surface <linkedin|instagram|tiktok|all> -o <out/>
```

5. **Look at the output yourself.** Read at least the cover and one interior slide as images. Check for overflow or awkward wraps. Fix the deck and re-render if needed.
6. **Hand over the files**, not a command. LinkedIn: upload the PDF as a document post. Instagram / TikTok: upload `01.png` … in order. Say where the files are.

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

## Rendering (you run this)

Resolve `scripts/render.mjs` from this skill's install path. Run it with **Node** — already present because the skill was installed with `npx`, and already present for you as the agent. Do not install Python.

The slides are HTML. Chrome (or Chromium, Edge, Brave) paints them to PNG and PDF. It is already on almost every machine that would install this skill — same class of dependency as Node. Do not ask the human to install Chrome unless `render.mjs` actually errors that none was found. Do not ask them to run the renderer.

```bash
node scripts/render.mjs deck.md                         # LinkedIn PNGs + PDF
node scripts/render.mjs deck.md --surface instagram     # 4:5 PNGs
node scripts/render.mjs deck.md --surface tiktok        # 9:16 PNGs
node scripts/render.mjs deck.md --surface all -o out/   # all three, in subfolders
node scripts/render.mjs deck.md --check                 # validate, render nothing
node scripts/render.mjs deck.md --pdf-only
node scripts/render.mjs deck.md --scale 1               # 1× instead of 2× retina
```

Or set `surface: instagram` in the deck frontmatter. `--surface` on the command line wins.

Fonts load from Google Fonts on first render, so the initial run needs network; it falls back to system serif, sans, and mono offline. Override the browser with `CAROUSEL_CHROME=/path/to/browser`.

---

## When this applies

**Apply when:** converting a post, article, README, thread, or skill into slides; the user says carousel, LinkedIn document, Instagram carousel, TikTok photo carousel, or slide deck for social.

**Do not apply when:** the user wants a presentation to speak over (different medium, different density), an editable PowerPoint, or a single OG image.

---

## Anti-patterns

- **Telling the human to run `node scripts/render.mjs`.** That is your job. They upload.
- **Hand-writing HTML instead of a deck file.** The renderer is the mechanism; bypassing it loses the design system.
- **Cramming a paragraph onto a slide.** Cut it or split it.
- **Fabricated quotes or numbers.** Disqualifying.
- **Two accented phrases in one headline.**
- **Shipping without looking at the images.** Always read at least two rendered slides before delivering.
- **A cover that describes instead of claims.** "Thoughts on productivity" is not a cover. "You lose the first hour rebuilding Friday" is.
