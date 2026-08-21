# Carousels

Rendered LinkedIn decks. Each folder is the full kit: source `.deck.md`, the PDF to upload, retina PNGs, and `post.md` copy.

| Folder | Upload this PDF |
|--------|-----------------|
| [day-job-founder](day-job-founder) | `day-job-founder/day-job-founder.deck.pdf` |
| [solo-founder](solo-founder) | `solo-founder/solo-founder.deck.pdf` |
| [carousel-press](carousel-press) | `carousel-press/carousel-press.deck.pdf` |

Regenerate from this repo root:

```bash
python3 carousel-press/scripts/render.py carousels/day-job-founder/day-job-founder.deck.md -o carousels/day-job-founder
python3 carousel-press/scripts/render.py carousels/solo-founder/solo-founder.deck.md -o carousels/solo-founder
python3 carousel-press/scripts/render.py carousels/carousel-press/carousel-press.deck.md -o carousels/carousel-press
```
