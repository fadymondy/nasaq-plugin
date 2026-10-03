# Nasaq Studio MCP: tool reference

Endpoint `https://studio.nasaqui.com/api/mcp`. Arguments marked `*` are required. `site` is a project id, slug or host and defaults to the workspace's primary site when omitted. Scope: `read` = `cms:read`, `write` = `cms:write`, `admin` = `cms:admin` (workspace owners and admins only). Localized values are `{"en": "...", "ar": "..."}`. A few tools also need a role permission (publishing, structure); a refusal names it.

Always trust `tools/list` from the live server over this table: it is the source of truth and may have grown.

## Sites and projects

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_list_sites` | read | none | List the sites (projects) of this organization. |
| `cms_list_projects` | read | none | List projects (sites) with their domains. |
| `cms_create_project` | write | `name*`, `slug`, `default_locale`, `locales` | Create a project (site) with its system domain. |
| `cms_setup_site` | write | `site`, `template`, `force`, `profile`, `apps` | Set up the free site: create or refresh the starter home page (EN and AR) from the org profile and installed apps, or apply a template. Idempotent. |
| `cms_add_domain` | admin | `site`, `host*` | Attach a custom domain to a project; returns the DNS verification token. |
| `cms_verify_domain` | admin | `host*` | Check the DNS record of a custom domain and mark it verified. |
| `cms_bind_app` | admin | `site`, `app*`, `app_ref`, `role`, `mount_path`, `render_url`, `routes` | Bind an app (for example Matjar) to a project and register its routes. |
| `cms_register_routes` | write | `site`, `app*`, `routes*` | Register the routes an app serves on a site, for sitemap and resolving. |
| `cms_import_site` | admin | `site`, `bundle*` | Import a site bundle (types, entries, menus, redirects). |

## Content types

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_list_types` | read | `site` | List the content types of a site and their fields. |
| `cms_upsert_type` | write | `site`, `type*` | Create or update a content type (fields, route pattern). |

## Entries

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_list_entries` | read | `site`, `type`, `status`, `q`, `limit`, `offset` | List entries of a site, filtered by type and status. |
| `cms_browse_entries` | read | `site`, `type`, `status`, `q`, `term`, `missing`, `sort`, `dir`, `limit`, `offset` | List entries with filters, sorting, status counts, translation state and terms. |
| `cms_get_entry` | read | `id`, `site`, `type`, `slug`, `locale` | Get one entry with its fields and SEO. |
| `cms_upsert_entry` | write | `site`, `id`, `type*`, `slug`, `fields`, `seo`, `status`, `publish_at`, `sort_order` | Create or update an entry (draft by default). |
| `cms_publish` | write | `id*`, `action`, `publish_at` | Publish, schedule or archive an entry. |
| `cms_schedule_entry` | write | `entry_id*`, `publish_at`, `unpublish_at`, `clear_publish`, `clear_unpublish` | Schedule an entry to publish and/or unpublish at a time. |
| `cms_list_scheduled` | read | `site` | List entries waiting to publish or go offline. |
| `cms_bulk_entries` | write | `site`, `ids*`, `action*`, `type`, `terms`, `mode` | Publish, unpublish, archive, restore, delete, move or set terms on many entries. |
| `cms_entry_diff` | read | `entry_id*`, `rev*`, `against` | Show what changed between a revision of an entry and now. |
| `cms_translation_status` | read | `site`, `type`, `missing`, `limit`, `offset` | EN/AR completeness of a site and the entries missing a locale. |
| `cms_set_metrics` | write | `site`, `items*` | Write numeric metric fields (stars, downloads, views, subscribers) onto entries in bulk. |

## Page builder and templates

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_block_types` | read | none | List the page-builder block types with their fields and default data. |
| `cms_page_blocks_get` | read | `entry*` | Get the blocks of a page or entry (the autosaved draft when present). |
| `cms_page_blocks_update` | write | `entry*`, `blocks*`, `publish` | Replace the blocks of a page as a draft; optionally publish. |
| `cms_preview_link` | write | `entry*`, `locale`, `hours` | Create a signed draft preview link on the real host. |
| `cms_discard_draft` | write | `entry*` | Discard the autosaved draft of an entry. |
| `cms_list_page_templates` | read | `site`, `type` | List saved and built-in page templates of a site. |
| `cms_apply_template` | write | `entry*`, `template_id*`, `mode` | Apply a page template to an entry draft (replace or append). |
| `cms_save_page_template` | write | `site`, `entry`, `blocks`, `name_en`, `name_ar`, `type_key` | Save a page as a reusable template. |
| `cms_list_reusable_blocks` | read | `site` | List reusable blocks (patterns). |
| `cms_save_reusable_block` | write | `site`, `key*`, `name`, `blocks*` | Create or replace a reusable block by key. |
| `cms_delete_reusable_block` | write | `site`, `key*` | Delete a reusable block by key. |

## Media

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_list_media` | read | `site`, `q`, `folder`, `kind`, `limit`, `offset` | List the media library of a site with filters. |
| `cms_update_media` | write | `id*`, `alt`, `caption`, `folder`, `filename` | Edit alt text, caption, folder and name of a library file. |
| `cms_import_media_url` | write | `site`, `url*`, `folder`, `alt`, `caption` | Download an external image or file link into the media library. |
| `cms_import_fm_site` | write | `origin*`, `site`, `slug`, `name`, `domain`, `theme`, `no_media`, `no_docs`, `no_scrape` | Copy an existing fm-v2 site (content, media, menus, redirects, SEO) into a project using the `fadymondy` theme. Background job; read-only on the origin; never changes DNS; idempotent. |
| `cms_import_fm_status` | read | `job*` | Progress and result of a `cms_import_fm_site` job. |

## Menus, redirects, taxonomy

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_upsert_menu` | write | `site`, `key*`, `name`, `items*` | Create or replace a navigation menu. |
| `cms_add_redirect` | write | `site`, `from*`, `to`, `status`, `match` | Add a 301, 302 or 410 redirect. |
| `cms_list_redirects` | read | `site` | List the redirect rules of a site. |
| `cms_delete_redirect` | write | `id*` | Delete a redirect rule. |
| `cms_export_redirects` | read | `site` | Export redirects as CSV text. |
| `cms_import_redirects` | write | `site`, `csv*`, `dry_run` | Import redirects from CSV text, with dry run. |
| `cms_upsert_taxonomy` | write | `site`, `taxonomy*` | Create or update a taxonomy (categories, tags). |
| `cms_list_terms` | read | `site`, `taxonomy` | List taxonomies (categories, tags) and terms of a project with entry counts. |
| `cms_upsert_term` | write | `site`, `taxonomy*`, `term*` | Create or update a term in a taxonomy. |
| `cms_save_term` | write | `site`, `taxonomy`, `term*` | Create or update a term with per-locale name, slug, description and SEO. |
| `cms_delete_term` | write | `id*`, `reassign_to` | Delete a term, optionally reassigning its entries to another term. |
| `cms_merge_terms` | write | `from*`, `into*`, `redirect` | Merge one term into another, rewriting entries and leaving redirects. |
| `cms_set_entry_terms` | write | `id`, `site`, `type`, `slug`, `locale`, `terms*`, `create_missing` | Set the categories and tags of an entry, optionally creating missing terms. |

## Themes and brand

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_theme_list` | read | `site` | List the available themes with price, coverage and the one a site uses. |
| `cms_theme_apply` | write | `site`, `theme*`, `reset` | Apply a theme to a site as drafts without overwriting existing content. |
| `cms_theme_get_brand` | read | `site` | Read the brand kit of a site (logos, colors, fonts, voice, contact). |
| `cms_theme_set_brand` | write | `site`, `brand*` | Change the brand kit of a site and update the apps that use it. |
| `cms_theme_publish` | write | `site` | Publish the applied theme and return the live url and next steps. |

## Inquiries, comments, community

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_list_inquiries` | read | `site`, `status`, `limit` | List contact-form inquiries of a site, optionally by status. |
| `cms_inbox` | read | `site`, `status`, `q`, `from`, `to`, `limit`, `offset` | The inquiries inbox with status counts, search, notes and reply state. |
| `cms_update_inquiry` | write | `id*`, `status*`, `enum` | Set the status of an inquiry (new, read, replied, spam, archived). |
| `cms_bulk_inquiries` | write | `site`, `ids*`, `action*` | Set a status on or delete many inquiries. |
| `cms_reply_inquiry` | write | `inquiry_id*`, `subject*`, `body*` | E-mail a reply to an inquiry sender and mark it replied. |
| `cms_note_inquiry` | write | `inquiry_id*`, `note*` | Set the internal note of an inquiry. |
| `cms_list_comments` | read | `site`, `status`, `entry_id`, `q`, `limit`, `offset` | List comments with status counts; filter by status, entry and text. |
| `cms_moderate_comments` | write | `site`, `ids*`, `action*` | Approve, mark pending or spam, trash or delete comments. |
| `cms_reply_comment` | write | `site`, `comment_id*`, `body*` | Reply to a comment as the site team. |
| `cms_list_authors` | read | `site` | List author profiles with post counts. |
| `cms_upsert_author` | write | `site`, `id`, `username`, `display_name`, `bio`, `job_title`, `avatar`, `cover`, `website`, `social`, `status` | Create or update a public author profile. |
| `cms_set_entry_community` | write | `site`, `entry_id*`, `sticky`, `visibility`, `password`, `clear_password`, `comments_mode`, `authors` | Set sticky, visibility, password, comments mode and authors of an entry. |
| `cms_community_settings` | read | `site` | Read the community settings (registration, comments, profiles). |
| `cms_set_community_settings` | admin | `site`, `settings*` | Change the community settings of a site. |
| `cms_list_members` | read | `site`, `q`, `role`, `status`, `limit`, `offset` | List the site members (visitor accounts). |
| `cms_invite_member` | admin | `site`, `email*`, `role` | E-mail a member invitation with a role. |

## Web push

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_push_status` | read | `site` | Web push status of a site: enabled, VAPID configured (public key only), subscribers per locale and the latest sends. |
| `cms_push_history` | read | `site`, `kind`, `limit`, `offset` | Send history of web push with delivery counts. |
| `cms_push_broadcast` | write | `site`, `messages`, `audience`, `title`, `body`, `url` | Send a web push with a message per locale and an audience (all or one locale). |
| `cms_push_test` | write | `site`, `messages`, `audience`, `title`, `body`, `url`, `count` | Test send of a web push to the newest subscriptions only. |
| `cms_push_settings` | write | `site`, `enabled`, `on_publish` | Turn web push on or off for a site and set push on publish. |
| `cms_send_push` | write | `site`, `title*`, `body`, `url`, `locale`, `tag` | Send a web push notification to the subscribers of a site. |

## Search, audit, trash, migration

| Tool | Scope | Arguments | What it does |
|---|---|---|---|
| `cms_search` | read | `site`, `q*`, `per` | Search entries, inquiries, redirects, terms and types of a site. |
| `cms_search_admin` | read | `site`, `q*`, `per` | Global admin search across entries, media, content types, menus, redirects and admin screens, grouped by kind. |
| `cms_audit_log` | read | `site`, `action`, `actor`, `target`, `limit`, `offset` | The activity log of a site. |
| `cms_list_trash` | read | `site`, `kind`, `q`, `limit`, `offset` | List deleted entries and media in the trash. |
| `cms_restore` | write | `id*` | Restore an entry or media file from the trash. |
| `cms_purge` | write | `site`, `ids`, `all`, `kind` | Delete trash items for ever or empty the trash. |
| `cms_import_wxr` | admin | `site`, `xml*`, `dry_run`, `media` | Import a WordPress export (WXR): posts, pages, terms, authors, comments. |
| `cms_export_wxr` | read | `site` | Export posts, pages, terms, authors and comments as a WordPress export (WXR). |
