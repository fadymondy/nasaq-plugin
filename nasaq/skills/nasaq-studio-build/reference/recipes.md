# Recipes

Each recipe lists the calls in order. Replace the sample values. `site` is omitted when the workspace has a single site.

## A. Bilingual company site from nothing

1. `cms_list_projects {}`: nothing suitable.
2. `cms_create_project { "name": {"en":"Acme","ar":"أكمي"}, "slug": "acme", "default_locale": "en", "locales": ["en","ar"] }`
3. `cms_setup_site { "site": "acme", "profile": { "name": {"en":"Acme","ar":"أكمي"}, "description": {"en":"...","ar":"..."}, "primary_color": "#0F766E" } }`
4. `cms_upsert_type` for `service` (see content-model.md) and `testimonial`.
5. For each service: `cms_upsert_entry { "site":"acme", "type":"service", "slug":{"en":"web-design","ar":"تصميم-المواقع"}, "fields":{"title":{"en":"Web design","ar":"تصميم المواقع"}, ...}, "seo":{...}, "status":"draft" }`
6. Images: `cms_import_media_url { "site":"acme", "url":"https://.../cover.jpg", "alt":{"en":"...","ar":"..."} }`, put the returned `/media/...` URL in the entry's `cover`.
7. Home page: `cms_block_types {}`, then `cms_page_blocks_update { "entry": "<home id>", "blocks": [ {"id":"hero","type":"hero","data":{...}}, ... ] }`.
8. `cms_upsert_menu { "site":"acme", "key":"main", "name":"Main", "items":[ {"label":{"en":"Services","ar":"خدماتنا"},"url":"/services"}, ... ] }`
9. `cms_theme_list`, `cms_theme_set_brand`, `cms_theme_apply { "theme": "<id>" }`.
10. `cms_preview_link` for home, one service, one post; look at them in EN and AR, light and dark.
11. `cms_translation_status { "missing": "ar" }` is empty. Ask the user to confirm.
12. `cms_bulk_entries { "ids": [...], "action": "publish" }`, then `cms_theme_publish {}`.
13. `cms_add_domain { "host": "www.acme.com" }`, give the DNS instructions, `cms_verify_domain { "host": "www.acme.com" }`.

## B. Add a blog to an existing site

1. `cms_list_types`: reuse the built-in `post`.
2. `cms_upsert_taxonomy { "taxonomy": { "key":"category", "name":{"en":"Categories","ar":"التصنيفات"}, "hierarchical":true, "type_keys":["post"], "path_prefix":"/blog/category", "in_sitemap":true } }`
3. `cms_upsert_author { "username":"sara", "display_name":{"en":"Sara","ar":"سارة"}, "bio":{...} }`
4. Posts via `cms_upsert_entry` (type `post`, `status: "draft"`), then `cms_set_entry_terms`.
5. Menu item `/blog` through `cms_upsert_menu` (resend the whole tree).
6. Publish with `cms_bulk_entries`; optional `cms_push_broadcast` (confirm first).

## C. Move a WordPress site

1. `cms_import_wxr { "xml": "<export text>", "dry_run": true }` and read the report.
2. Re-run with `"dry_run": false, "media": true`.
3. `cms_translation_status` to see which posts lack Arabic.
4. `cms_import_redirects { "csv": "from,to,status\n/old,/new,301", "dry_run": true }` then for real.

## D. Online shop on a Nasaq site (Matjar)

1. Project and theme as in recipe A; choose a theme whose coverage includes `matjar`.
2. `cms_bind_app { "app":"matjar", "app_ref":"<shop id from CircleXO>", "role":"shop", "mount_path":"/shop", "render_url":"<app url>" }`
3. `cms_block_types`: add the product/catalog block to the home page with `cms_page_blocks_update`.
4. Menu: add `{ "label": {"en":"Shop","ar":"المتجر"}, "url":"/shop" }`.
5. Check `/shop` in both locales; the empty state must read well before products exist.

## E. Bookings (SeatFor) or a menu (Qaima)

Same as D with `app: "seatfor"` / `app: "qaima"`, mount paths `/book` and `/menu`, and a theme that covers that surface.
