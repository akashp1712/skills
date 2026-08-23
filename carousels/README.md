# Carousels

Rendered LinkedIn decks. Each folder is the full kit: source `.deck.md`, the PDF to upload, retina PNGs, and `post.md` copy.

| Folder | Upload this PDF |
|--------|-----------------|
| [carousel-press](carousel-press) | `carousel-press/carousel-press.deck.pdf` |

Regenerate from this repo root:

```bash
python3 carousel-press/scripts/render.py carousels/carousel-press/carousel-press.deck.md -o carousels/carousel-press
```
