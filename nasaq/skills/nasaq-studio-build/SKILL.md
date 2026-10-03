---
name: nasaq-studio-build
description: Build a site or app backend on Nasaq Studio over its MCP server, step by step - choose or create a project, model content types, write bilingual entries, import media, build menus, pick and customise a theme, publish, attach a domain, and bind CircleXO apps (Matjar, SeatFor, Qaima). Names the exact cms_* tools and arguments. Use when the user says "build a site on Nasaq", "create a Nasaq project", "add pages/posts/products to my Nasaq site", "publish my Nasaq site", "connect my domain", or any task that calls the nasaq-studio MCP tools.
---

# Build on Nasaq Studio over MCP

Nasaq Studio is a bilingual (English/Arabic) CMS and site engine. Everything below is done with the
`nasaq-studio` MCP server (`https://studio.nasaqui.com/api/mcp`). The full tool table with arguments is in
[`reference/tools.md`](reference/tools.md); content modelling patterns are in
[`reference/content-model.md`](reference/content-model.md); complete example runs are in
[`reference/recipes.md`](reference/recipes.md).

## Ground rules

1. **Drafts first, live last.** Entries are created as drafts and themes are applied as drafts. Nothing goes
   public until `cms_publish`, `cms_bulk_entries` (action `publish`) or `cms_theme_publish`. Ask the user before
   the first publish, before attaching a domain, and before anything destructive.
2. **Bilingual by default.** A site has locales `en` and `ar`. Every localized value is `{"en": "...", "ar": "..."}`.
   Write the Arabic natively for the audience; never machine-mirror English word for word, and never leave one
   locale empty. `cms_translation_status` finds the gaps.
3. **Read before write.** Call the matching list/get tool first (`cms_list_types` before `cms_upsert_type`,
   `cms_list_entries` / `cms_get_entry` before `cms_upsert_entry`) so you update instead of duplicating.
   Upserts are keyed (type `key`, menu `key`, entry `id`). There is no menu read tool: a menu is replaced whole,
   so keep the tree you sent last and resend it complete.
4. **`site` is optional but be explicit.** `site` accepts a project id, slug or host. Omitted, it means the
   workspace's primary site. When the workspace has several sites, always pass it.
5. **The live server is the truth.** `tools/list` can be newer than the table in this plugin. If a tool you
   need is missing or an argument is refused, trust the server's schema and error text. Errors are bilingual
   (`error` / `errorAr`); `403` names the role or scope that is missing, `402` means a paid theme without a licence.
6. **Never print, store or commit a token.** Authentication is OAuth (see `/nasaq:connect`) or a workspace token in
   an environment variable.
7. `platform_*` tools exist only for platform administrators. Do not call them.

## Step 0 - Connected?

Call `cms_list_sites`. If it answers, continue. If the tools are missing or the call returns 401, run the
`/nasaq:connect` command (OAuth sign-in or token) and retry.

## Step 1 - Choose or create the project

- `cms_list_projects` -> list sites with their domains and bound apps. Reuse one if it fits.
- Otherwise `cms_create_project { name: {en, ar}, slug?, default_locale: "en", locales: ["en", "ar"] }`.
  The project gets a free system domain; it is returned in the result. (Needs the "structure" permission.)
- Optional starter: `cms_setup_site { site, template?, profile?, force? }` creates or refreshes a starter home page in
  EN and AR from the organization profile and installed apps. It is idempotent and will not overwrite a home page the
  owner has edited unless `force` is true. `profile` = `{name{en,ar}, description{en,ar}, logo_url, phone, email,
  website, address{en,ar}, primary_color, accent_color}`.

## Step 2 - Content model

- `cms_list_types { site }` to see existing types (`page` and `post` are built in).
- `cms_upsert_type { site, type: { key, name: {en, ar}, route_pattern, fields: [...], in_sitemap, in_feed } }`.
  - `route_pattern` examples: `/{slug}` (pages), `/blog/{slug}`, `/projects/{slug}`. Empty means "not routable".
  - Field: `{ key, type, label: {en, ar}, required?, localized?, options? }`. Types: `text`, `longtext`, `richtext`,
    `number`, `bool`, `date`, `url`, `image`, `images`, `select`, `list`, `json`, `ref`.
  - Convention: `fields.title` is the entry title. Mark user-facing text `localized: true`.
- Taxonomies: `cms_upsert_taxonomy { site, taxonomy: { key, name{en,ar}, hierarchical, type_keys[], path_prefix, in_sitemap } }`,
  then `cms_upsert_term { site, taxonomy, term: { name{en,ar}, slug{en,ar}, description{en,ar}, parent?, sort_order? } }`.

See [`reference/content-model.md`](reference/content-model.md) for ready-made models (blog, services, portfolio,
restaurant menu, team).

## Step 3 - Entries and pages

- `cms_upsert_entry { site, type, slug: {en, ar}, fields: {...}, seo: {...}, status: "draft" }`. Pass `id` to update.
  - `seo`: `{ title{en,ar}, description{en,ar}, keywords{en,ar}, og_image, canonical, noindex }`. Fill title and
    description for every public entry in both locales.
  - The home page is the `page` entry with slug `home`.
- Block-built pages (hero, features, FAQ ...): `cms_block_types` lists the available blocks with their fields and
  defaults, then `cms_page_blocks_update { entry, blocks: [{ id, type, data }], publish? }` replaces the draft blocks.
  Read the current ones with `cms_page_blocks_get { entry }`. Start from `cms_list_page_templates` and
  `cms_apply_template { entry, template_id, mode: "replace" | "append" }` instead of an empty page when a template fits.
  Save reusable sections with `cms_save_reusable_block { site, key, name, blocks }`.
- Categories and tags: `cms_set_entry_terms { id, terms: { category: [slug], tag: [slug] }, create_missing: true }`.
- Review a draft on the real host: `cms_preview_link { entry, locale, hours }` returns a signed link. Open it (see
  the verification step) before publishing. `cms_discard_draft { entry }` throws away an autosave.
- Many entries at once: `cms_bulk_entries { site, ids[], action, type?, terms?, mode? }`.

## Step 4 - Media

There is no binary upload tool over MCP. Media comes in by link:

- `cms_import_media_url { site, url, folder?, alt: {en, ar}, caption? }` downloads an external image or file into the
  library and returns a library URL of the form `/media/<id>/<file>`. Use that URL in `image` / `images` fields and
  block data.
- `cms_list_media { site, q?, folder?, kind? }` to find existing files; `cms_update_media { id, alt, caption, folder, filename }`
  to fix alt text. Every image gets alt text in both locales.
- Real imagery only: no grey placeholder boxes, no lorem ipsum. If you have no images, ask the user or leave the
  image field empty and say so.

## Step 5 - Menus and redirects

- `cms_upsert_menu { site, key: "main" | "footer", name, items: [{ label: {en, ar}, url, entry_id?, children?: [...] }] }`
  replaces the whole menu, so send the complete tree. Items can be hidden per locale with `hidden`, and a mega-menu
  panel added with `mega.columns` (see the tool schema).
- `cms_add_redirect { site, from, to, status: 301 | 302 | 410, match: "exact" | "prefix" }`; bulk CSV with
  `cms_import_redirects { site, csv, dry_run: true }` (always dry-run first).

## Step 6 - Theme and brand

A theme is a designed look for the whole site (layout, tokens, sections). Applying one never overwrites content.

1. `cms_theme_list { site }` -> available themes (id, name, price, coverage per surface, which one the site uses).
   Prefer a theme whose coverage includes every surface the site needs (`cms`, plus `matjar` / `seatfor` / `qaima`
   when those apps are bound). A paid theme needs a licence (a `402` says so).
2. `cms_theme_get_brand { site }` then `cms_theme_set_brand { site, brand: {...} }`. Send only the keys to change
   (`null` removes a key). Colors are `#RRGGBB` under `colors.light` and `colors.dark`. The brand kit (name, logos,
   colors, fonts, tagline, voice, contact, social) always wins over theme tokens and survives theme switches.
   Set both light and dark colors and check contrast (4.5:1 for text).
3. `cms_theme_apply { site, theme, reset? }` stages the theme's pages, menus, tokens and layout as drafts.
4. Review with `cms_preview_link` on the home page and two inner pages, in EN and AR.
5. `cms_theme_publish { site }` makes it live and returns the live URL and next steps.

To build a new theme rather than pick one, use the `nasaq-theme-build` skill.

## Step 7 - Quality gate before going live

- `cms_translation_status { site, missing: "ar" }` and again with `"en"`: fix every incomplete entry.
- `cms_browse_entries { site, status: "draft" }`: nothing should be a stray draft.
- Every public entry has `seo.title` and `seo.description` in both locales, and an `og_image` where it matters.
- Menus resolve (no link to an unpublished or missing page).
- Open the preview links at desktop and mobile width, EN and AR, light and dark, and look at them.

## Step 8 - Publish

- One entry: `cms_publish { id, action: "publish" }` (also `schedule` with `publish_at`, `unpublish`, `archive`).
- Many: `cms_bulk_entries { site, ids, action: "publish" }`. Timed: `cms_schedule_entry { entry_id, publish_at, unpublish_at }`
  and `cms_list_scheduled { site }`.
- Theme layer: `cms_theme_publish { site }`.
- Check the result on the live URL (fetch the home page, `/sitemap.xml`, `/robots.txt`, and an Arabic URL under `/ar/`).

## Step 9 - Custom domain

1. `cms_add_domain { site, host }` returns a DNS verification token (needs the admin scope: workspace owner or admin).
2. Tell the user exactly which DNS record to create (TXT with the token, plus the A/CNAME the result names) and wait.
   Do not claim it is done until it verifies.
3. `cms_verify_domain { host }` checks the record and marks the domain verified.

## Step 10 - Connect CircleXO apps (Matjar, SeatFor, Qaima)

Apps render inside the site's header, footer and tokens. A theme that does not cover an app surface still gets the
app's default UI styled with the site's tokens, fonts and brand.

- `cms_bind_app { site, app: "matjar" | "seatfor" | "qaima" | ..., app_ref, role, mount_path, render_url, routes }`
  binds the app to the project and registers its routes (admin scope).
- `cms_register_routes { site, app, routes[] }` adds or refreshes routes for sitemap and resolving.
- `cms_block_types` lists the section blocks that embed an app on a CMS page (for example a product grid or a
  booking widget); add them with `cms_page_blocks_update`.
- Make the page that hosts the app reachable from the main menu with `cms_upsert_menu`.
- Check the apps' own empty state, then a real state, in EN and AR.

## Step 11 - Operate

- Inquiries: `cms_inbox { site, status }`, `cms_reply_inquiry { inquiry_id, subject, body }`, `cms_note_inquiry`,
  `cms_update_inquiry { id, status }`.
- Comments and community: `cms_list_comments`, `cms_moderate_comments { ids, action }`, `cms_reply_comment`,
  `cms_community_settings`, `cms_invite_member`.
- Web push: `cms_push_status`, `cms_push_broadcast { site, messages: {en: {title, body, url}, ar: {...}}, audience }`;
  test first with `cms_push_test`.
- Find things: `cms_search { site, q }`, `cms_search_admin { site, q }`, `cms_audit_log { site }`.
- Mistakes: `cms_list_trash` and `cms_restore { id }`; `cms_entry_diff { entry_id, rev }` shows what changed.
- Migrating: `cms_import_wxr { site, xml, dry_run: true }` for WordPress exports (admin scope), `cms_export_wxr`.

## Destructive or high-impact calls (confirm first)

`cms_purge`, `cms_bulk_entries` with `delete`, `cms_delete_term`, `cms_merge_terms`, `cms_delete_redirect`,
`cms_delete_reusable_block`, `cms_import_site`, `cms_import_redirects` without `dry_run`, `cms_theme_apply` with
`reset: true`, `cms_set_community_settings`, `cms_push_broadcast`, `cms_publish`, `cms_theme_publish`, `cms_add_domain`.
