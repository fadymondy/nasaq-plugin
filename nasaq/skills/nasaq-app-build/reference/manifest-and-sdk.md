# CircleXO manifest and SDK reference

## Manifest skeleton

```yaml
manifest_version: 1
id: myapp                       # global, immutable
publisher: <publisher slug>
version: 1.0.0                  # bump on every contract change
name: { en: My App, ar: تطبيقي }
description: { en: "...", ar: "..." }
category: marketing
urls:
  home: https://app.example.com
  launch: https://app.example.com/sso/circlexo
auth:
  redirect_uris: [https://app.example.com/auth/circlexo/callback]
  post_logout_redirect_uris: [https://app.example.com/]
  scopes: [openid, profile, email, org, entitlements]   # org brings org_id / org_role
  service_account: true
lifecycle:
  provision:   { url: https://app.example.com/api/circlexo/provision }
  deprovision: { url: https://app.example.com/api/circlexo/deprovision }
  health:      { url: https://app.example.com/api/health }
webhooks:                       # omit to auto-activate on install
  url: https://app.example.com/api/circlexo/events
  events: [org.*, member.*, subscription.*, entitlement.*]
entitlements:
  features: [custom_domain]
  meters: [entries]
mcp:
  url: https://app.example.com/api/mcp
  transport: streamable-http
  auth: token-exchange
  tools:
    - { name: list_things, effect: read, description: "..." }
listing: { default_locale: en, locales: [en, ar] }
```

Minimum compliance for a store listing: valid manifest, reachable health endpoint, working OIDC login, idempotent
provision and deprovision, verified webhook signatures, every MCP tool declared with its effect.

## SDK packages (Go; a TypeScript SDK mirrors the shape)

| Package | Use |
|---|---|
| `circlexo` | Config from env, discovery, token verifier, hub app-API client |
| `oidc` | Sign-in (PKCE), callback, refresh, logout, sealed cookie session; login accepts `?return_to=` |
| `middleware` | Puts a principal (user, org, role, tenant, scopes, entitlements) in the request context; `RequireFeature` |
| `entitlements` | Cached entitlements, fail-closed grace |
| `usage` | Idempotent usage reporting |
| `webhooks` | Standard Webhooks verification and typed events |
| `service` | Service tokens and token exchange |
| `mcp` | Securing a product MCP endpoint for the gateway |
| `manifest` | Types and `circlexo app validate` |
| `circlexotest` | In-memory hub for tests |

Configuration is read from environment variables (issuer, app id, client id and secret or private key, app key,
optional API URL). Keep every value in a secret store.

## Entry-flow checklist

1. Root and locale roots render the splash, then redirect to the SDK login route with `return_to`.
2. `return_to` is validated as a same-origin local path.
3. The callback honours `return_to`; failures redirect to `/login?circlexo_error=<code>`.
4. Signed-in visitors go to their workspace; deep links survive the round trip.
5. Logout ends both sessions.

## Webhook handler checklist

Verify the signature first; reject stale timestamps; dedupe by event id; `org.app_installed` creates or links the tenant
and confirms it; `member.*` syncs roles; `entitlement.changed` invalidates the cache; `session.revoked` ends the session;
return 2xx only after the work is durable.
