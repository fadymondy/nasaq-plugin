# nasaq (Claude Code plugin)

| Piece | Name |
|---|---|
| MCP servers | `nasaq-studio` (your Studio, OAuth) and `nasaq-ui` (public component catalogue) |
| Skills | `nasaq-studio-build`, `nasaq-ui-design`, `nasaq-theme-build`, `nasaq-app-build`, `nasaq-shadcn` |
| Commands | `/nasaq:connect`, `/nasaq:new-site`, `/nasaq:new-theme`, `/nasaq:new-app`, `/nasaq:audit-ui` |
| Agents | `nasaq-designer`, `nasaq-ui-reviewer` |

Self-hosted Studio: set `NASAQ_STUDIO_URL` (origin only) before starting Claude Code.
Run `/nasaq:connect` first.
