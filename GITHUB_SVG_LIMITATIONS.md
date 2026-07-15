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

## Still open / not fully verified

- We proved the *techniques* animate on GitHub and that `card-animated` uses
  only those techniques with no external resources. A final belt-and-suspenders
  check is to embed each theme in a real README and eyeball it across
  browsers — worth doing once and pinning screenshots in `examples/`.

---

**Bottom line:** Animated SVG cards work in GitHub READMEs. The constraints that
matter are *no JS, no interactivity, and no external resources* — all of which
our current cards already respect.
