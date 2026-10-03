---
description: Add or integrate a CircleXO app - entry flow with splash and SSO, SDK webhook, hub manifest and store listing
argument-hint: "[app name and what it does]"
---

Integrate a CircleXO app. Brief: $ARGUMENTS

Use the `nasaq-app-build` skill (and `nasaq-ui-design` for screens). Required outcome:

1. Entry flow: no public home or login page; Nasaq UI `BootSplash`, then CircleXO sign-in with `return_to`, then the deep
   link; `/login?circlexo_error=` as the failure screen only.
2. SDK wiring: OIDC routes, `org` scope, verified events webhook, entitlements with fail-closed behaviour.
3. `circlexo.app.yaml` validated, with a bumped version and every MCP tool declared with its effect.
4. A store listing in EN and AR with real screenshots taken from demo data.
5. If the app serves public pages, register its routes with the CMS (`cms_register_routes`, `cms_bind_app`).

Report what was verified (deep link while signed out, bad webhook signature, manifest validation) and what was not.
