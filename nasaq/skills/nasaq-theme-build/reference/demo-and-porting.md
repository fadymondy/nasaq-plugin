# Live demo and porting an existing site

## ThemeForest-style live demo

Every theme that ships `demo.json` gets a live demo: the real runtime renders the seeded content, read-only, inside an
iframe on the Studio theme page with a bar for device width, EN/AR, light/dark and "Use this theme". The store's Templates
tab opens that viewer.

Model, in order of importance:

1. **Separate demo host**, not a path on the admin host. Themes emit root-relative links, so a path prefix would break SPA
   links. It serves no tenant and no database: the platform tells the runtime which theme to show with an internal header
   authenticated by a shared secret, and the runtime serves that theme's `demo.json`. Inbound copies of those headers are
   stripped, so a client can neither choose a theme nor reach tenant data.
2. **Short-lived signed token.** The viewer asks for a token (same-origin only, rate limited): claims are the theme id and
   an expiry of about ten minutes, signed with HMAC-SHA256. The iframe URL carries it; the document request validates it
   and sets a partitioned, HttpOnly, Secure, SameSite=None session cookie bound to the theme. SPA navigation, RSC fetches
   and forms ride on the cookie. With no signing secret configured the demo is disabled.
3. **Iframe only.** The document request must carry `Sec-Fetch-Dest: iframe`. A top-level open, a missing header, a
   missing, expired, tampered or wrong-theme token all get a branded, bilingual "demo link expired, open it from the theme
   page" page (403, `no-store`, noindex). Every response sends `Content-Security-Policy: frame-ancestors <allowed origins>`.
   A tiny client guard replaces the page if `window.top === window.self`.
4. **Deterrents (demo host only).** Disable context menu, selection, drag, copy and print outside form fields; block the
   view-source, save, print, devtools shortcuts; `Cache-Control: no-store`; no production source maps. Menus, tabs and forms
   keep working.
5. **Be honest about limits.** These are deterrents. DevTools opened from the browser menu, `curl` (which can forge the
   fetch-metadata header) or a headless browser still see what the browser renders. The real protection is that the demo
   contains only seeded demo content.
6. Safari blocks third-party cookies in cross-site embeds, so other products open the Studio viewer rather than embedding
   the demo host directly. Two themes demoed side by side in one browser profile share a cookie and the last one wins.

## Porting an existing site as a theme

The bar is fidelity, not resemblance. Approximate re-creations are rejected.

1. Inventory the live site: every URL, template, menu, form, asset, redirect and metadata rule.
2. Port the **real CSS, assets and DOM 1:1** into the theme (as a custom-routes theme if its URL structure needs its own
   route tree). Do not "rebuild it in your own style".
3. Drive content from the CMS (types, entries, menus, settings) so the owner edits it in Studio; seed the content so the
   site looks identical on day one.
4. **Preserve every URL.** Anything that moves gets a 301; keep sitemap, feeds, canonical and per-entry SEO. Share cards,
   favicon and brand icon too.
5. **Prove it** with per-URL screenshot diffs of the old and new site at desktop and mobile, listing each URL, its diff
   percentage and the reason for any remaining difference. Also run the gate in `gate.md`.
6. Keep the old site reachable (or the DNS cut-over reversible) until the diff report is accepted.
