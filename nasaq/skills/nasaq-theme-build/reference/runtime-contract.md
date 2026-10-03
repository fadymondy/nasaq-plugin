# Nasaq theme runtime contract (v1)

Field names below match the runtime. If the user's repo ships a newer runtime document or an example theme, follow it.

## Architecture in one paragraph

Every site host is served by a Next app (the site runtime). The Studio API keeps all policy (host lookup, canonical
redirects, redirects and 410s, password gates, media, forms) and the runtime only renders. Content comes from the public
CMS API, so canonical, hreflang, JSON-LD, sitemap and feeds are produced centrally and themes never write metadata. A
host maps to a theme and a path like `/en/blog` is rewritten internally to that theme's route group, so the browser, `next/link`,
history and canonicals only ever see public URLs. Each theme has its own root layout: one theme's CSS and fonts never
load on another theme's hosts. Scope theme CSS under `.nq-t-<id>` anyway.

## Package layout

```
themes/<id>/
  manifest.json   required
  index.tsx       required   export default defineTheme({ manifest, Layout, templates })
  layout.tsx      header, footer, providers (server component)
  templates.tsx   page templates (any file layout works)
  components/     theme components; client ones start with "use client"
  styles.css      optional, scoped under .nq-t-<id>
  demo.json       required   seeded demo content (no API, no database)
  assets/         catalog previews (generated, committed)
  DESIGN.md       art direction and rubric scores
```

Files that must be reachable by URL (fonts, images) go in the theme's public folder and are requested from the site host.
A theme that ships its own route tree (a ported site) marks itself with an empty `custom-routes` file.

## manifest.json

```jsonc
{
  "id": "clinic",                              // [a-z0-9-]{2,40}, equals the folder name
  "name": { "en": "...", "ar": "..." },        // required in both languages
  "description": { "en": "...", "ar": "..." }, // required in both languages
  "version": "1.0.0",
  "coverage": { "cms": "full", "matjar": "none", "seatfor": "partial", "qaima": "none" },   // full | partial | none
  "tokens": {
    "colors": {
      "light": { "primary": "#..", "accent": "#..", "background": "#..", "foreground": "#..", "muted": "#..", "border": "#..", "onPrimary": "#.." },
      "dark":  { /* the same roles, designed for dark */ }
    },
    "radius": "md", "density": "comfortable",
    "fonts": { "latin": "...", "heading": "...", "ar": "Lusail" }
  },
  "routes": [ { "type": "post", "list": "/blog", "entry": "/blog/{slug}" } ],
  "settings": [ /* builder schema, below */ ],
  "seed": { "menus": { "header": [ /* menu items */ ] } },   // optional: content the theme brings the first time a site uses it
  "themeStorageKey": "nq-theme",               // localStorage key holding "light" | "dark"
  "themeFollowsSystem": true,                  // also set data-theme from the OS scheme when nothing is saved
  "previews": { "thumbnail": "assets/desktop-en-home.png", "screens": ["assets/..."] }   // written by the capture script
}
```

Tokens become `:root` variables (`--nq-primary`, `--nq-background`, `--nq-foreground`, `--nq-muted`, `--nq-border`,
`--nq-radius`, with `--nq-bg` / `--nq-fg` aliases). A site's own token overrides and brand kit arrive as `site.tokensCss`
and are emitted after the manifest tokens, so the brand kit wins. `settings` values arrive in `site.settings`.

## Settings schema (the theme builder)

The schema lives with the theme; the values live on the site. The Studio theme builder renders the schema and saves the
values; the theme reads them from `site.settings`. Types: `text`, `ltext` (localized `{en, ar}`), `color`, `bool`,
`select` (with `options` and optional `optionLabels`), `image`, `order` (a sortable list of option keys), `number`.
Each setting has `key`, `label` {en, ar}, optional `group`, `help`, `default`, `multiline`. Values are validated against
the definition and an empty value clears back to the default.

Make the theme builder-driven end to end:

- brand name, logo, announcement text, hero headline, sub-copy, CTA labels and links, contact details;
- every colour that is not a token (accent overrides), badges, chips and ticker items;
- images (hero, section backgrounds) with a sensible default image;
- one `bool` per optional section, and per optional app surface;
- `order` for reorderable lists.

Rules: declare only settings you read; read every setting you declare; defaults produce a finished design; no fake data
(for example invented availability) in place of a real source.

## Theme API

```tsx
import { defineTheme } from "@nq/theme"
export default defineTheme({ manifest, Layout, templates: { home, entry, "entry:post", list, "list:post", term, notFound } })
```

- `Layout({ site, res, locale, dir, path, children })`: server component around every page. Put JSON-LD here.
- Template lookup: entries `home` (the page flagged home, or `page` with slug `home`) -> `entry:<type>` -> `entry`;
  lists `list:<type>` -> `list`; terms `term` -> `list`. `notFound` is required.
- Every template receives `{ site, res, locale, dir, path }`. `res.entry` has fields in the page locale, per-locale values
  and `paths`; `res.list` / `res.term` have `items { id, path, title, summary, image, published_at }`; `res.seo` carries
  the metadata.

| Import | Provides |
|---|---|
| `@nq/theme` | `defineTheme`, `Manifest`, `pickTemplate` |
| `@nq/types` | `SiteCtx`, `Entry`, `Resolution`, `PageProps`, `LayoutProps` |
| `@nq/helpers` | `L(localized, locale)`, `F(entry, key, fallback)`, `menuHref`, `dirOf`, `isRtl`, `switchLocale`, `fmtDate` |
| `@nq/client` | `Link` (SPA), `SpaLinks` (plain anchors inside markdown become SPA), `Reveal`, `HtmlAttrs` |
| `@nq/markdown` | `Markdown` (GFM; internal links navigate client-side) |
| `@nq/render` | `JsonLd`, `ThemeRoot`, `themePage`, `themeMetadata` |
| `@nq/cms` | server helpers: `getSite()`, `resolve`, `entries(type, opts)`, `entry(type, slug)`, `menu(key)`, `search(q)` |

Data helpers are for server components only and are cached per request. Client interactivity (menus, sliders, copy
buttons, motion) lives in `"use client"` components; the page is server-rendered first and hydrates.

## Local run, no API and no database

Run the runtime in demo mode for a theme id; it renders from the theme's `demo.json`. Open `/en` and `/ar`.
`demo.json`: `{ site: { name, defaultLocale, locales, settings, tokensCss }, menus: { header: [...] }, entries: [ { id, type, slug, status, home?, paths: {en, ar}, fields, localized } ] }`.
A list page `/<loc>/<path>` lists the entries whose `paths[loc]` starts with `<path>/`. Demo mode keeps `/_next` for
assets (no proxy in front); the production proxy path uses the dedicated prefix.

## Catalog and licensing

The catalogue entry (listing, price, tokens for the customizer) points at the theme's manifest previews. Built-in themes
are compiled into the image; third-party packages must have this exact shape. Paid templates are a one-time licence per
organisation, sold in the CircleXO store Templates tab.
