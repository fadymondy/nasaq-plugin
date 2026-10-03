---
description: Connect Claude Code to Nasaq Studio (sign in with OAuth or use a workspace token) and verify the MCP works
---

Connect to Nasaq Studio and verify it.

1. Call `cms_list_sites`. If it returns sites, say which workspace and sites are reachable and stop.
2. If the `nasaq-studio` tools are missing or the call returns 401:
   - Tell the user to open `/mcp`, choose `nasaq-studio` and sign in (OAuth). Do not ask for codes, tokens or callback URLs in chat.
   - Alternative for CI or headless use: the user creates a workspace token in Studio (owner or admin), exports it as
     `NASAQ_TOKEN` in their own shell, then runs
     `claude mcp add --transport http nasaq-studio https://studio.nasaqui.com/api/mcp --header "Authorization: Bearer $NASAQ_TOKEN"`.
     Never print, log or write the token to a file.
3. Retry `cms_list_sites`. Also check the `nasaq-ui` MCP (`list_components` with a small limit); it needs no sign-in.
4. Report: connected or not, the access level seen (read, write and admin are narrowed by the user's role), and the next
   step (`/nasaq:new-site`, `/nasaq:new-theme`, `/nasaq:audit-ui`).

If the user's Studio is self-hosted, they set `NASAQ_STUDIO_URL` to its origin before starting Claude Code.
