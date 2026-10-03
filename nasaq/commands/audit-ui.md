---
description: Screenshot-based review of a Nasaq UI screen against the design rules (EN/AR, desktop/mobile, light/dark)
argument-hint: "[URL or route to audit]"
---

Audit the UI at: $ARGUMENTS (if empty, ask for a URL or find the dev server).

Use the `nasaq-ui-reviewer` agent if available, otherwise do it directly following
`nasaq-ui-design/reference/verification.md`:

1. Capture the 8-shot matrix (1440 and 390, en and ar, light and dark) with the available browser tool.
2. Run the checks: RTL direction, Lusail loaded for Arabic, overflow, console errors, raw colours, physical CSS
   properties, one user menu in the sidebar, workspace switcher in the sidebar header, Nasaq components used as-is,
   PhoneInput/AddressInput, three-source image fields, loading/empty/error states, dark mode, accessibility.
3. Score each area 0-5 and list findings by severity with file and line when the source is available.
4. Offer to fix. Fix only what the user approves, then re-run the failing checks.
