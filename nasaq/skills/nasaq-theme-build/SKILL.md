---
name: nasaq-theme-build
description: Design and build a Nasaq Studio theme with real art direction - manifest and tokens (light and dark), bilingual EN/AR with RTL, templates and sections, SPA navigation, motion, SEO/performance/accessibility budgets, real preview screenshots, and a verification gate with a scored rubric. Also covers staging a theme over MCP (cms_theme_apply, cms_theme_get_brand, cms_theme_set_brand, cms_theme_publish). Use when asked to create, restyle, port or review a Nasaq theme or template, or to make a site "look designed".
---

# Building a Nasaq theme

A theme is a designed product, not a colour swap. The usual failure is a generic stack of blocks with a new palette, flat
gradient blobs instead of imagery, a header with no mobile menu, no motion, placeholder copy, and tokens that never reach
the page. Do not ship that.

## Two paths

1. **Use or tune an existing theme (MCP only).** `cms_theme_list`, `cms_theme_get_brand` / `cms_theme_set_brand`,
   `cms_theme_apply` (stages drafts), preview, `cms_theme_publish`. Details in `nasaq-studio-build` step 6. The brand kit
   always wins over theme tokens, so most "make it ours" requests are a brand-kit change, not a new theme.
2. **Author a theme package (code).** A manifest plus a React/Next package that the Studio site runtime renders. Follow the
   rest of this skill. Be upfront with the user about the package contract: Nasaq's public theme-runtime reference is
   still being published. Before writing code, ask the user for (or locate in their repo) the current runtime contract and a
   working example theme, and follow its field names and APIs over anything written here. The sections below describe what a
   good theme must contain and prove, not the exact file layout.

## Ground rules

1. **Look at it.** After every meaningful change open real screenshots at 1440 and 390 px, EN and AR, light and dark.
2. **No placeholders.** No lorem ipsum, "Another update" posts, grey boxes labelled "Map", gradient blobs standing in for
   photography, `href="#"`, or buttons that do nothing. Write real bilingual copy for the vertical.
3. **One art direction per theme, chosen deliberately** (see `reference/craft.md`): type pairing, imagery direction,
   signature hero, rhythm, motion language. Look at two or three best-in-class real sites for the vertical first.
4. **Arabic is designed, not mirrored.** Lusail for Arabic, logical CSS only, RTL screenshots reviewed as hard as EN.
5. **Tokens only.** Components read CSS variables; no raw hex in component code. Tokens exist for light and dark, and dark is
   designed, not an inversion.
6. **Previews are real.** Catalog images are captured from the rendered theme with realistic bilingual demo content
   (desktop and mobile, EN and AR). No SVG or abstract stand-ins.
7. Never print or commit secrets; hosts and tokens come from env.

## What a complete theme contains

- **Manifest**: id, name (EN/AR), version, kind, coverage per surface (`cms`, and `matjar` / `seatfor` / `qaima` when it
  claims them), tokens (light and dark), a settings schema for the customizer, previews, routes.
- **Tokens**: named roles at minimum `background`, `foreground`, `muted`, `border`, `primary`, `accent`, plus surface, ring,
  status colours, radius, shadow, spacing and type scale. Expose as `--nq-*` custom properties (with the aliases the
  runtime documents). Check contrast of every foreground/background pair in all four mode/locale combinations.
- **Layout**: a real header (sticky or hide-on-scroll, working mobile drawer with focus trap, keyboard-operable menus,
  locale and theme toggles) and footer.
- **Templates** for every content type the theme claims: home, page, post, list, 404, search, taxonomy; product/cart and
  others if covered.
- **Sections** (block renderers) with designed empty/sample states.
- **Fallbacks**: surfaces the theme does not cover still inherit tokens, fonts, header and footer.

## Interactivity and motion

- Internal navigation uses the framework router (`next/link`), no full document reloads; prefetch on.
- One orchestrated entrance, scroll reveals with IntersectionObserver, purposeful hover/press states, optional page
  transitions. Every animation honours `prefers-reduced-motion`.
- Widgets (slider, tabs, accordion, search, lightbox, filters) work with keyboard and touch. No dead handlers.

## Bilingual and RTL

`dir` and `lang` on `<html>` from the locale; logical properties everywhere; mirror directional icons, not logos, clocks,
play buttons or phone glyphs; Arabic line-height 1.7+, no letter-spacing, no uppercase; digits decided per theme and not
mixed within one figure; `<bdi>` or `dir="auto"` around mixed content; emails, URLs, codes and phones isolated LTR.

## SEO, performance, accessibility budgets

Server-rendered content (view-source shows the text); per-route metadata with hreflang alternates, canonical, OG/Twitter,
JSON-LD where it fits; LCP <= 2.5 s, CLS <= 0.05, INP <= 200 ms, JS per route <= 170 KB gzip; hero image preloaded;
fonts `font-display: swap`. WCAG 2.2 AA: 4.5:1 text contrast (3:1 large text and UI), visible `:focus-visible`, skip
link, landmarks, 44 px touch targets, full keyboard paths.

## Verification gate (a theme is not done without it)

1. Screenshot matrix: 1440 and 390 x en and ar x light and dark, for home, an inner page, a post, a list, and 404.
2. Interaction checks in a real browser: open and close the mobile menu, tab through the header, switch language and
   theme, trigger each widget, confirm no document reload on internal links.
3. Console clean, no hydration warnings, no failed asset requests, no horizontal overflow at 390.
4. Lighthouse (mobile) for home and one inner page against the budgets above.
5. Score `reference/craft.md` rubric 0-4 per criterion; anything below 3 is fixed and re-verified.
6. Stage it for review with `cms_theme_apply`, open `cms_preview_link` for the home page and two inner pages in both
   locales, then publish only with the owner's approval (`cms_theme_publish`).

Report with: the screenshots taken, rubric scores, Lighthouse numbers, and anything not verified.

Detailed craft guidance, per-vertical direction and the rubric are in [`reference/craft.md`](reference/craft.md).

## Hard fails

Unreadable token contrast in any mode/locale; header without a working mobile menu or a nav that overflows at 390 px; dead
controls, `#` links or reloads on internal navigation; console errors; missing dark palette keys; physical left/right CSS,
unmirrored directional icons or Arabic in a non-Lusail face; placeholder content or imagery in previews; no screenshot
evidence in the report.
