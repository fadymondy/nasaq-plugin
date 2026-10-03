---
name: nasaq-app-build
description: Build or integrate a CircleXO app (a Nasaq-family product such as a shop, booking, menu or custom product) so it launches from the CircleXO hub - no public home or login page, a branded splash then CircleXO single sign-on with return_to, the CircleXO SDK (sign-in, events webhook, entitlements), the circlexo.app.yaml hub manifest, store listings in EN and AR with real screenshots, priced collections, and CMS route registration for SEO. Use when asked to add a product to CircleXO, wire SSO or the events webhook, write or bump a hub manifest, prepare a store listing, or make an app's entry flow.
---

# Building a CircleXO app

CircleXO is the hub: it owns sign-in, organisations, plans, entitlements and the store. An app owns its own domain logic
and data. Join in stages (listed, SSO, entitlements, billing, MCP); nothing needs a big bang. Full examples and field
tables: [`reference/manifest-and-sdk.md`](reference/manifest-and-sdk.md).

## 1. Entry flow (no public front door)

A product host has **no public home page and no login page**. Every entry URL (`/`, `/en`, `/ar`, any deep link) does this:

1. Show the Nasaq UI `BootSplash` (the logo animation), the same loader every CircleXO product shows.
2. If there is no session, go straight to CircleXO sign-in through the SDK login route, passing `return_to` with the
   page the visitor asked for (a same-origin path only; validate it to prevent open redirects).
3. After the callback, land on that deep link. A signed-in visitor skips the hub round trip and goes to their workspace.
4. `/login` exists only as a failure screen: `/login?circlexo_error=<code>` renders the reason (no org, unverified email,
   failed) with a retry, never a form.
5. Sign-out ends the app session and the hub session.

Marketing for the product lives in the hub store listing, not on the product host.

## 2. SDK integration (every app)

- **Sign-in**: the SDK's OIDC relying party exposes login (accepts `return_to`), callback and logout routes. The launch
  URL in the manifest is `https://<host>/sso/circlexo`. Link users by the hub subject and verified email; never merge
  accounts silently.
- **Org scoping**: request the `org` scope, otherwise the `org_id` / `org_role` claims the app scopes by are absent.
- **Events webhook** (`/api/circlexo/events`): verify the Standard Webhooks signature; handle `org.app_installed`
  (create or link your tenant, then confirm it with the SDK), member added/removed/role changed, `entitlement.changed`
  (invalidate the cache) and `session.revoked`. Handlers are idempotent.
- **Entitlements**: gate features and meters through the SDK and fail closed (read-only grace when the hub is
  unreachable, never delete data because of it); answer `402` when the plan lacks a feature.
- **Tenant = hub org.** Every tenant table carries `tenant_id` with row-level security.
- Secrets (client secret, webhook secret, keys) come from the app's own secret store and env. Never put them in the
  manifest, the repo or examples.

## 3. Hub manifest (`circlexo.app.yaml`)

Declarative and versioned: id, publisher, version, bilingual name, category, urls (home, launch), auth (redirect URIs,
scopes, service account), lifecycle (provision, deprovision, health), webhooks, entitlements (features, meters), an
optional MCP block with every tool declared with its effect (`read`, `write`, `destructive`), and listing locales.

- A manifest **without webhooks auto-activates on install**; one with webhooks waits for the app to confirm its tenant.
- **Bump `version`** whenever the contract changes (a scope, a webhook, a tool). The hub seed republishes only on a new
  version; an unchanged version silently keeps the old contract.
- Changes that widen scopes, add webhooks or add destructive tools need review and org re-consent.
- Validate with the SDK CLI (`circlexo app validate`) before pushing. Every MCP tool name in the manifest must match the
  tools the server registers (keep a test for it).

## 4. Store listing and solutions

- Name, tagline and description in **EN and AR**, written natively; categories and keywords; support and privacy links.
- **Real screenshots** captured from seeded demo data (desktop and mobile, EN and AR, light and dark where it matters),
  shown with a full-screen zoom viewer. No mock-ups, no empty states, no "localhost" in browser chrome.
- Plans (monthly and yearly, trial) map to the manifest's features and meters. Solutions are **curated, priced
  collections** per business type: a story, a flow diagram of the apps, per-collection plans showing the saving versus
  the apps alone, an FAQ, and a one-click "Get started" that runs the guided journey with per-app progress and retry.
- Themes are templates in the store's Templates tab: paid ones are a one-time licence per organisation, free ones apply
  on install. Cards show real preview screenshots and "Works with" chips from the theme's coverage.

## 5. CMS integration

Nasaq Studio is the shared CMS and site engine, consumed through the SDK. An app that serves public pages registers its
routes with `cms_register_routes` / `cms_bind_app` so they appear in the sitemap and resolve with SEO, and its surface is
styled by the site theme (tokens, header, footer). Design empty and sample states for each embedded surface.

## 6. UI

Build screens with Nasaq UI as is (see `nasaq-ui-design`): Lusail for Arabic, logical CSS, tokens only, one user menu in
the sidebar footer, workspace switcher in the sidebar header, `PhoneInput` / `AddressInput` for those fields.

## Definition of done

Entry flow shows splash, then sign-in, then the deep link (test with a deep link while signed out); a failed sign-in
shows `circlexo_error`; the webhook rejects a bad signature and accepts a good one idempotently; the manifest validates
and its version is bumped; the listing has EN and AR copy and real screenshots; screenshots of the app in EN/AR and
light/dark exist; no secret appears in git history or logs.
