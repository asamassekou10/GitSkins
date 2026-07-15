# GitHub SVG: What Works and What Doesn't

> **Corrected July 2026.** An earlier version of this doc claimed GitHub strips
> all SVG animations and advised abandoning animated cards. That was wrong.
> Externally-hosted SVGs embedded with `![](url)` **do animate on GitHub** —
> both SMIL and CSS animation run. This doc records what was actually verified,
> so we build on the real constraints instead of imagined ones.

## TL;DR

When an SVG is referenced from a README with Markdown image syntax
(`![alt](https://…/card.svg)`), GitHub proxies it through its image cache
(camo) and the browser renders it inside an `<img>`. In that context:

- ✅ **SMIL animation** (`<animate>`, `<animateTransform>`, `<animateMotion>`) runs.
- ✅ **CSS animation** (`<style>` with `@keyframes` + `animation:`) runs.
- ✅ **Gradients, filters (blur/glow), clip paths, real `<text>`** render.
- ✅ **Raster images embedded as `data:` URIs** (base64) render.
- ❌ **JavaScript** (`<script>`, `on*` handlers) never executes.
- ❌ **Interactivity** — hover/click/`:hover`, focus, links *inside* the SVG — does nothing.
- ❌ **External resource loads** — remote fonts, `<image href="https://…">`, external stylesheets — are blocked.

Our `/api/card-animated` endpoint stays entirely inside the ✅ column: it uses
only SMIL + CSS animation, gradients, and shapes, embeds nothing external, and
ships no script. That is why it animates in a README.

## How we verified this

Two of the most widely used README widgets prove the two animation techniques
independently, both embedded via `![](url)`:

| Reference widget | Technique it uses | Result on GitHub |
| --- | --- | --- |
| `readme-typing-svg` | SMIL `<animate>` (no CSS) | Animates |
| `github-readme-activity-graph` | CSS `<style>` + `@keyframes` (no SMIL) | Animates |

`card-animated`'s SVG uses **both** of those techniques and references **no**
external resources — so it behaves like the widgets above, not like a
sanitized-static image.

## The real constraints (these are true)

These are the limits worth designing around — not "animation is impossible":

1. **No JavaScript, no interactivity.** SVG-in-`<img>` is a movie, not an app.
   No hover states, no clicks inside the SVG. To make a card clickable, wrap the
   whole image in a link: `[![card](card.svg)](https://…)`.
2. **External resources are blocked → inline everything.** This is why our cards
   embed the avatar as a `data:` URI and use system/inlined fonts. A remote
   `<image href="https://avatars.githubusercontent.com/…">` would render blank.
3. **GitHub caches aggressively.** Images are proxied and cached by camo, so an
   updated card can lag. Bust it with a version query (`…&v=2`).
4. **Animation has no persistent state.** It restarts on each page load; there's
   no way to pause/scrub or remember progress.
5. **Low-power / reduced-motion.** Some browsers pause SVG animation in
   low-power mode or under `prefers-reduced-motion`. Design so the *first frame*
   already looks good — never hide essential content behind an animation.

## Design implications for GitSkins

- **Ship the animated cards as a real feature.** They are a genuine
  differentiator over static-only tools (github-readme-stats, profile-trophy).
- **Keep the first frame legible.** Because of caching and reduced-motion, the
  static first frame must stand on its own.
- **Always inline assets** (avatars as `data:` URIs, no remote fonts). Any
  external reference silently breaks the card.
- **Offer a static fallback** (`/api/premium-card`) for users who prefer it or
  hit a rendering quirk.
- **The interactive showcase is still worth building** — for hover/click, live
  data, and social sharing — but as an *addition*, not a replacement for the
  animated README cards.

## What we found in our own output (and fixed)

Rendering `/api/card-animated` in an actual `<img>` — GitHub's exact context —
revealed that **our cards were failing to render entirely**: a blank/broken
image, for *every* theme. The cause was not GitHub's sanitizer. Our SVG was
**invalid XML**, and an `<img>` (and GitHub) parses SVG strictly, so it refused
to decode it. Two generation bugs produced the malformed markup:

1. **`<animate>` child jammed into an opening tag.** The border/avatar
   animations were interpolated *inside* the `<rect>`/`<circle>` tag
   (`<rect … rx="20" <animate …/>/>`) instead of as child elements. Strict XML
   parse error → whole card fails.
2. **Duplicate `style` attribute.** The staggered fade-in groups emitted a
   second `style="animation-delay: …"` next to the fade-in `style`, which is a
   duplicate attribute → parse error.

Both are fixed in `src/app/api/card-animated/route.tsx` (animations are now
proper children; the delay is merged into a single `style`). After the fix all
five themes are valid XML and render + animate in an `<img>`.

> Lenient HTML parsing (inline `<svg>` in a page, or a browser preview) hid this
> — it tolerated the malformed markup. Only the strict `<img>`/XML path exposed
> it, which is exactly the path GitHub uses. Test in an `<img>`, not inline.

## Still open

- **Deploy required.** The fix lives in the route; the live endpoint serves the
  old (broken) output until deployed.
- **Layout polish.** With the cards finally rendering, a separate pre-existing
  issue is visible: the three stat blocks (Stars / Contributions / Languages)
  overlap instead of sitting side-by-side, and some labels collide. Tracked
  separately from the XML fix.
- **Cross-browser eyeball.** Worth embedding each theme in a real README once
  and capturing screenshots after the layout polish lands.

---

**Bottom line:** The animation *techniques* work in GitHub READMEs — the
constraints that matter are *no JS, no interactivity, and no external
resources*. Our cards additionally have to be **valid XML**, which they now are
after fixing two malformed-markup bugs.
