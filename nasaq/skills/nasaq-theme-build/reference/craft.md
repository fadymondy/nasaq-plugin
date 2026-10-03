# Theme craft guide

## 1. Brief and art direction (write it down first)

Answer in a short `DESIGN.md` in the theme folder before coding:

- Vertical, audience, the one job the home page must do.
- One memorable element (a signature hero, a type treatment, a motion idea). Spend boldness in one place.
- Palette: 4-6 named colours with light and dark values, and what each is for.
- Type: a display face and a text face for Latin, Lusail for Arabic; sizes on a modular scale of 5-7 steps with fluid `clamp()`.
- Layout concept with a quick ASCII wireframe of home at desktop and mobile.
- Imagery plan: photography, illustration or 3D, one consistent treatment, aspect ratios, alt text in both languages.
- Motion plan: entrance, reveal, hover, transition.
- Then critique the plan against the generic defaults (centered hero over a gradient, three-card features, stock icons) and revise.

## 2. Direction per vertical (starting points, not templates)

| Vertical | Lead with | Avoid |
|---|---|---|
| Restaurant / cafe | Full-bleed food photography, menu as a designed typographic object, booking in the first screen | Stock plates, tiny menu PDFs |
| Clinic / health | Calm palette, real staff and rooms, clear booking and trust signals (credentials, hours) | Cold blue-and-white clipart |
| Real estate | Large listing imagery, filters and map that work, price formatting per locale | Placeholder map boxes |
| Portfolio / agency | Case-study storytelling, big type, deliberate motion | Identical card grids |
| Shop | Product-first grids, fast filtering, trustworthy cart and checkout surfaces | Hiding price and availability |
| Docs / content | Reading comfort, navigation, search | Marketing hero on a reference site |
| Corporate | Proof (numbers, clients, people), restrained palette | Generic "we deliver solutions" copy |

Design Arabic headlines as their own composition: no truncation, no clipped diacritics, no tracking, enough leading.

## 3. Layout and spacing

Content width 1200-1320 px with full-bleed bands for rhythm; never a 960 px column for a marketing theme. 4/8 spacing
scale. Vary section density; alternate imagery and text; keep a clear reading path. Mobile is designed, not collapsed:
check the header, hero, grids and forms at 390 px.

## 4. Imagery

Real images with a consistent crop, grade and aspect ratio. Provide `alt` in EN and AR. Use `next/image` with explicit
dimensions and `priority` for the hero. Import library media through `cms_import_media_url`; do not hotlink third-party
images in production themes.

## 5. Previews for the catalog

Capture them from the running theme with demo content that fits the vertical: home, an inner page, a listing, mobile, in EN
and AR. File names and sizes follow the runtime's contract. Re-capture whenever the design changes.

## 6. Anti-patterns

Same block stack with a new palette; gradient blobs as imagery; tokens defined but unused; header that wraps at 390 px;
hover-only affordances; auto-playing carousels without controls; motion that ignores reduced-motion; centered everything;
English-only strings; dark mode that merely inverts; contrast checked in one mode only; cards inside cards; fake testimonials
and fake logos.

## 7. Rubric (score 0-4, fix anything under 3)

| Criterion | 4 means |
|---|---|
| Art direction | Distinct, intentional, fits the vertical; one memorable element |
| Typography | Clear hierarchy, Lusail for Arabic, fluid scale, good measure |
| Colour and tokens | Complete light and dark palettes, tokens used everywhere, contrast passes |
| Layout and rhythm | Consistent grid, varied density, strong mobile design |
| Imagery | Real, consistent, art-directed, with alt text |
| Interactivity | Real header and drawer, SPA navigation, working widgets |
| Motion | Purposeful, orchestrated, reduced-motion safe |
| Bilingual and RTL | Equal quality in EN and AR; logical CSS; mirrored icons only where right |
| SEO and performance | SSR content, metadata, structured data, budgets met |
| Accessibility | WCAG 2.2 AA, keyboard, focus, targets |
| Content | Real copy, no placeholders, previews are screenshots |
| Robustness | Empty and sample states, uncovered surfaces fall back well |
