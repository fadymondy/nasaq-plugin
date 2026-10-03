# Content models that work

Field types: `text`, `longtext`, `richtext`, `number`, `bool`, `date`, `url`, `image`, `images`, `select`, `list`,
`json`, `ref`. Mark every field a visitor reads as `localized: true`. The entry title is `fields.title`.

Write a type with `cms_upsert_type`:

```json
{
  "site": "acme",
  "type": {
    "key": "service",
    "name": { "en": "Service", "ar": "خدمة" },
    "route_pattern": "/services/{slug}",
    "in_sitemap": true,
    "fields": [
      { "key": "title",   "type": "text",     "label": { "en": "Title", "ar": "العنوان" }, "required": true, "localized": true },
      { "key": "summary", "type": "longtext", "label": { "en": "Summary", "ar": "الملخص" }, "localized": true },
      { "key": "body",    "type": "richtext", "label": { "en": "Details", "ar": "التفاصيل" }, "localized": true },
      { "key": "cover",   "type": "image",    "label": { "en": "Cover image", "ar": "صورة الغلاف" } },
      { "key": "price",   "type": "number",   "label": { "en": "Starting price", "ar": "السعر ابتداءً من" } }
    ]
  }
}
```

## Patterns

| Site | Types | Notes |
|---|---|---|
| Company / agency | `page`, `service`, `project`, `testimonial`, `post` | `service` and `project` get their own routes; testimonials are not routable (empty `route_pattern`) and are pulled into page blocks. |
| Blog / publication | `post`, `author` profile (via `cms_upsert_author`), taxonomies `category` + `tag` | Cover image, excerpt, reading time as a `number`. Posts are routable at `/blog/{slug}`. |
| Restaurant / cafe | `page`, `dish` (price, image, dietary `select`/`list`), taxonomy `menu-section` | Menu page uses the dishes through a block or the Qaima app when it is bound. |
| Clinic / services | `page`, `treatment`, `doctor` (photo, specialty, languages `list`), `faq` | Booking goes through the SeatFor app when bound; do not invent a booking form. |
| Portfolio / CV | `page`, `project`, `skill`, `experience` | Entries can be downloaded as PDF/DOCX/HTML at `/<locale>/<path>/download/<format>` on the site host. |
| Docs / knowledge base | `doc` with `ref` to a parent, taxonomy `topic` | Hierarchical taxonomy for the sidebar tree. |

## Slugs

`slug` is `{en, ar}`. Use short, lowercase, hyphenated English slugs; the Arabic slug may be an Arabic or a
transliterated one. Non-default locales are served under `/ar/...`. A missing slug in one locale shares the other.

## SEO per entry

```json
"seo": {
  "title":       { "en": "Web design in Riyadh | Acme", "ar": "تصميم المواقع في الرياض | أكمي" },
  "description": { "en": "One sentence, under 160 characters.", "ar": "جملة واحدة، أقل من 160 حرفاً." },
  "og_image": "/media/<id>/cover.webp"
}
```

Titles about 50-60 characters, descriptions up to about 160. The site-level title template adds the brand suffix, so do
not repeat it unless you want it twice.

## Sizes and limits

Keep media under a few MB (the library stores each file in the database; large originals should be resized first).
Rate limit is about 120 MCP calls a minute per token; batch with `cms_bulk_entries` and `cms_import_site` for large
imports rather than looping.
