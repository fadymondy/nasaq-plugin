# Verification gate, previews and catalog

A theme is not done until every item here has been run and looked at. "It builds" proves nothing for UI.

## 1. Previews (generated, never hand-made)

Capture from the theme running in demo mode against its `demo.json`:

- Files are PNG (JPG or WebP also pass), named `<device>-<locale>-<page>.png`:
  `desktop-en-home`, `desktop-ar-home`, `mobile-en-home`, `mobile-ar-home`, the same four for the main inner page
  (`work`, `menu`, `shop`, `doctors`...), plus `desktop-en-home-dark.png`. Desktop 1440x900, mobile 390x844 at 2x.
- Before each shot: set the locale by URL, wait for fonts and network idle, scroll to the bottom and back so lazy images
  and reveals fire, wait for the entrance animation to settle, then screenshot.
- Write the list into `manifest.previews` (`thumbnail` plus `screens[]`). The catalogue serves exactly those files and the
  store parses the file names into the gallery (device, locale, page, dark), so keep the pattern.
- Open every file. Reject a shot with a skeleton, a blank section, an unloaded image, a cut-off sticky header, "localhost"
  in mock browser chrome (show the demo domain), the wrong locale, an overlay, or an empty box (a "00" pause box, a map
  placeholder).
- Never: SVG or CSS-drawn thumbnails, gradient posters, device mock-ups of wireframes, screenshots of the editor,
  previews from another theme or an older version. Catalog cards show real screenshots only.
- Every theme has EN and AR `name` and `description`.
- Any gallery in the store needs a full-screen viewer with zoom; a small inline thumbnail is not enough.

## 2. Static self-check (fast, run on every change)

`node scripts/theme-selfcheck.mjs <theme-dir>` (shipped with this skill, no dependencies, exit 1 on any ERROR). It checks:

- manifest: valid id, EN and AR name and description, version, coverage, both colour modes with the six roles plus
  `onPrimary`, contrast (foreground/background, foreground/muted, text on primary), dark differs from light, Arabic font
  is Lusail;
- previews: at least 8 screens plus a thumbnail, no SVG, files exist and are not tiny, EN and AR and desktop and mobile
  all present, `DESIGN.md` present;
- code: physical left/right CSS and Tailwind utilities, `transition: all`, lorem and other placeholder copy, `href="#"`,
  empty or log-only handlers, internal plain `<a href>` (use the SPA `Link`), `<img>` without alt, removed focus outlines,
  animations without reduced-motion handling, missing `next/link`, missing mobile nav or footer; warnings for raw hex,
  runtime Google Fonts, `window.location` navigation, click handlers on divs.

Justify every warning in `DESIGN.md`. Passing proves nothing about taste.

## 3. Polish audit (every template plus 404)

Pick one representative per content type and depth (home, page, list, entry, term, search) plus every list route plus a
non-existent URL. For each, in light and dark, at 1440, 834 and 390, in EN and AR, check:

- horizontal overflow (`scrollWidth - innerWidth <= 1`);
- images that finished loading with zero natural width; failed requests (status >= 400, except the expected 404);
- visible text matching `localhost`, `undefined`, `[object`, `NaN`, or the replacement character;
- console errors and warnings (the expected 404 resource message on the not-found page is the only allowed one);
- dark mode really dark (body background luminance), after seeding the theme storage key with `dark`;
- with JavaScript disabled and again with reduced motion: no content stays invisible (reveal content must be shown);
- an SPA run: click through at least five internal links and assert zero document requests and no console output.

Scroll the page before measuring so lazy content and reveals have fired. Fix the cause, not the audit.

## 4. Look at it

The audit cannot judge hierarchy, rhythm, crowding or taste. Open the 1440 and 390 shots for every template in EN and AR
and in dark, and critique them against `craft.md`. Check the 404 too.

## 5. Performance, accessibility, rubric

Lighthouse (mobile) on home and one inner page against LCP <= 2.5 s, CLS <= 0.05, INP <= 200 ms, JS per route <= 170 KB
gzip. Contrast of every pair in all four mode/locale combinations (measure programmatically over text nodes). Score the
`craft.md` rubric; fix anything under 3.

## 6. Stage and report

`cms_theme_apply` on a test site, `cms_preview_link` for home and two inner pages in both locales, publish only with
approval. The report lists screenshots, audit output, rubric scores, Lighthouse numbers, and what you could not verify.
