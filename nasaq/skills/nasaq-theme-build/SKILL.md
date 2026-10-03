---
name: nasaq-theme-build
description: Design and build a Nasaq Studio theme as real React/Next code on the Nasaq site runtime - manifest and tokens (light and dark), a builder-driven settings schema, templates and layout, bilingual EN/AR with RTL, SPA navigation, motion, real preview screenshots, composable app coverage, a ThemeForest-style live demo, and a verification gate (self-check, polish audit, screenshot matrix). Also covers staging a theme over MCP (cms_theme_apply, cms_theme_get_brand, cms_theme_set_brand, cms_theme_publish) and porting an existing site 1:1. Use when asked to create, restyle, port or review a Nasaq theme or template, or to make a site "look designed".
---

# Building a Nasaq theme

A theme is a designed product, not a colour swap, and it is **code**: a React/Next package rendered by the Nasaq site
runtime (server rendering, hydration, `next/link` SPA navigation, motion). A JSON blueprint rendered as static HTML is the
wrong model and was rejected. The usual failures: a generic stack of blocks with a new palette, flat blobs instead of
imagery, a header with no mobile menu, no motion, placeholder copy, hard-coded text and colours that the site owner cannot
change, and tokens that never reach the page. Do not ship that.

## Two paths

1. **Use or tune an existing theme (MCP only).** `cms_theme_list`, `cms_theme_get_brand` / `cms_theme_set_brand`,
   `cms_theme_apply` (stages drafts), `cms_preview_link`, `cms_theme_publish`. Details in `nasaq-studio-build` step 6.
   The brand kit wins over theme tokens, so most "make it ours" requests are a brand-kit change, not a new theme. A paid
   theme answers `402` until the org holds its licence (one-time licence per organisation, bought in the CircleXO store).
2. **Author a theme package (code).** Follow the rest of this skill. The package contract (manifest, entry, templates,
   data helpers, settings, previews, demo) is in [`reference/runtime-contract.md`](reference/runtime-contract.md). If the
   user's repo has a newer runtime document or an example theme, that document wins on field names and APIs.

## Ground rules

1. **Look at it.** After every meaningful change open real screenshots at 1440 and 390 px, EN and AR, light and dark.
2. **No placeholders.** No lorem ipsum, "Another update" posts, grey boxes labelled "Map", empty boxes, gradient blobs
   standing in for photography, `href="#"`, buttons that do nothing, fake availability or fake logos. No "localhost",
   "undefined" or "NaN" in rendered text; browser-chrome mock-ups show the demo domain. Fill empty hero halves with real
   content (a "Selected work" strip beats a void).
3. **One art direction per theme, chosen deliberately** (see `reference/craft.md`, which lists approved directions by
   vertical): type pairing, imagery, signature hero, rhythm, motion. Look at two or three best-in-class sites first.
4. **Fully builder-driven.** Every colour, logo, brand name, chip, badge, headline, paragraph, image and section toggle
   comes from tokens and the settings schema, with a good default. Nothing user-visible is hard-coded in TSX, and every
   declared setting is actually read (a declared but unused setting is a bug).
5. **Arabic is designed, not mirrored.** Lusail for Arabic, logical CSS only, RTL screenshots reviewed as hard as EN.
6. **Tokens only.** Components read CSS variables; no raw hex in component code. Dark is designed, not inverted.
7. **Previews are real.** Catalog images are screenshots of the rendered theme with realistic bilingual demo content.
   No SVG or abstract stand-ins.
8. Never print or commit secrets; hosts and tokens come from env.

## What a complete theme contains

- **Manifest**: id, name and description in EN and AR, version, coverage per surface, tokens (light and dark),
  routes, settings schema, `themeStorageKey`, previews. See the contract reference.
- **Tokens**: `background`, `foreground`, `muted`, `border`, `primary`, `accent`, `onPrimary` per mode at minimum, plus
  radius, density and fonts. Check contrast of every foreground/background pair in all four mode/locale combinations.
- **Layout**: real header (sticky or hide-on-scroll, mobile drawer with focus trap, keyboard-operable menus, locale and
  theme toggles) and footer.
- **Templates**: `home`, `entry`, `entry:<type>`, `list`, `list:<type>`, `term`, and a required `notFound`, for every
  content type the theme claims. The not-found boundary must render with a clean console.
- **Sections** with designed empty and sample states.
- **Coverage and fallbacks**: the theme declares which app surfaces it covers (CMS, Matjar shop, SeatFor booking, Qaima
  menu) as `full`, `partial` or `none`. Surfaces it does not cover fall back to the app default, still wearing the
  theme tokens, header and footer. The store lists this as "Works with".
- **Demo content** (`demo.json`) and **previews** that drive the catalog and the live demo.

## Runtime rules that bite

- **Asset prefix.** Behind the Studio proxy the site runtime serves its chunks under a dedicated prefix (`/_sn`), because
  the admin owns `/_next` on the same host. Standalone demo or preview runs with no proxy keep `/_next`. Hard-coding or
  mixing the two leaves every theme unstyled.
- **Pre-paint theme.** Set `themeStorageKey` (and `themeFollowsSystem` if your CSS keys off `data-theme`) in the manifest.
  The runtime injects one pre-paint script that applies the saved light/dark choice before first paint. Do not ship a
  boot script per theme.
- **Reveal.** Use the runtime `Reveal` (it marks content `data-nq-reveal`). Content must be fully visible under
  `prefers-reduced-motion` and with JavaScript off. Hidden-until-scrolled content with no fallback is a hard fail.
- **Titles.** Headlines may carry inline emphasis (`*word*`). Strip it for metadata, OG titles, tabs and cards with a
  `plain()` helper; the runtime already does for SEO fields, so do the same anywhere you build a title yourself.
- **Navigation.** `next/link` through the runtime `Link`; internal navigation makes zero document requests.
- **Fonts and files** you serve by URL live under the theme's public folder; self-host fonts.

## Interactivity, bilingual, SEO

Detailed rules and budgets are in `reference/craft.md`. In short: one orchestrated entrance, scroll reveals, purposeful
hover and press, widgets that work with keyboard and touch, `dir`/`lang` from the locale, logical properties, mirrored
directional icons only, Arabic line-height 1.7+ with no tracking, server-rendered content, per-route metadata, LCP
<= 2.5 s, CLS <= 0.05, INP <= 200 ms, JS per route <= 170 KB gzip, WCAG 2.2 AA.

## Previews and catalog

Capture previews with a script from the running theme in demo mode, never by hand. Files are PNGs named
`<device>-<locale>-<page>.png` (`desktop`/`mobile` x `en`/`ar` x `home` and the main inner page, plus
`desktop-en-home-dark.png`). The catalogue serves exactly the manifest previews, and the store parses the names into the
gallery, so keep the naming. Every theme needs EN and AR name and description. Galleries need a full-screen viewer with
zoom. Details: [`reference/gate.md`](reference/gate.md).

## Live demo

A theme with `demo.json` gets a ThemeForest-style live demo: iframe only, a short-lived signed token, a branded
"link expired" page for direct opens, `frame-ancestors`, a `Sec-Fetch-Dest: iframe` check, a top-window guard, anti-copy
deterrents, `no-store`. These are deterrents, not protection: the real defence is that the demo only ever shows seeded
content. See [`reference/demo-and-porting.md`](reference/demo-and-porting.md).

## Porting an existing site

Port the real CSS, assets and DOM 1:1, preserve every URL (301 for anything that moves), and prove it with per-URL
screenshot diffs. Approximate re-creations are rejected. See the demo-and-porting reference.

## Verification gate (a theme is not done without it)

1. Static self-check of the theme folder (manifest, tokens both modes, previews are PNG/JPG/WebP and cover EN/AR and
   desktop/mobile, no SVG art, DESIGN.md present).
2. Polish audit over **every template plus the 404**, light and dark, at 1440, 834 and 390, EN and AR: horizontal
   overflow, broken images, suspicious text (`localhost`, `undefined`, `NaN`), console errors and warnings, failed
   requests, dark-mode background really dark, content visible with no JS and under reduced motion, and an SPA run that
   shows zero document requests during client navigation.
3. **Look at the screenshots yourself.** The audit cannot judge taste.
4. Lighthouse (mobile) for home and one inner page against the budgets.
5. Score the `reference/craft.md` rubric 0-4; anything below 3 is fixed and re-verified.
6. Stage on a test site with `cms_theme_apply`, open `cms_preview_link` for home and two inner pages in both locales,
   and publish only with the owner's approval (`cms_theme_publish`).

Report with: screenshots taken, audit result, rubric scores, Lighthouse numbers, and anything not verified.

## Hard fails

Unreadable token contrast in any mode/locale; header without a working mobile menu or a nav that overflows at 390 px;
dead controls, `#` links or reloads on internal navigation; console errors (including on the 404); missing dark palette
keys; physical left/right CSS, unmirrored directional icons or non-Lusail Arabic; hard-coded copy, colours or brand
that the builder cannot change; declared-but-unused settings; placeholder content, empty boxes or abstract art in
previews; content hidden without JS or under reduced motion; no screenshot evidence in the report.

Anti-patterns the owner has rejected are collected in [`reference/craft.md`](reference/craft.md) section 6.
