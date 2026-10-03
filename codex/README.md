# Nasaq for OpenAI Codex

Codex reads MCP servers from `~/.codex/config.toml` and skills from `~/.codex/skills/`. The skills use the same
`SKILL.md` format as the Claude Code plugin, so they are shared.

## Option A: install the plugin (recommended)

Codex CLI can install Claude-format plugin marketplaces directly:

```bash
codex plugin marketplace add fadymondy/nasaq-plugin
codex plugin add nasaq@nasaq
```

This installs the skills, the commands (Codex exposes them as skills) and the MCP servers from the plugin's `.mcp.json`.
Then sign in (see Auth below).

## Option B: manual

1. Add [`config.toml`](config.toml) to `~/.codex/config.toml`.
2. Copy the skills:

```bash
mkdir -p ~/.codex/skills
for s in nasaq-studio-build nasaq-ui-design nasaq-theme-build nasaq-shadcn; do
  cp -r nasaq/skills/$s ~/.codex/skills/$s
done
```

## Auth

- OAuth: `codex mcp login nasaq-studio`, then follow the browser sign-in. If you use OAuth, remove the
  `bearer_token_env_var` line from the `nasaq-studio` block.
- Token: create a workspace token in Nasaq Studio (owner or admin), export it in your shell and keep it out of files:

```bash
export NASAQ_TOKEN=nsq_...        # PowerShell: $env:NASAQ_TOKEN = "nsq_..."
```

The `nasaq-ui` server is public and needs no sign-in.

## Roles (Codex has no agent files)

Add this to the repo's `AGENTS.md` so Codex follows the same workflow as the Claude agents:

```md
## Nasaq
- Building or changing a screen: follow the nasaq-ui-design skill and use Nasaq components as they are (consult the
  nasaq-ui MCP first). Tokens only, logical CSS, Lusail for Arabic, one user menu in the sidebar, workspace switcher in
  the sidebar header. Do not finish before screenshots in EN/AR, desktop/mobile, light/dark (the "designer" role).
- Reviewing UI: do the same checks read-only and return a scored findings list (the "reviewer" role).
- Building on Nasaq Studio: follow nasaq-studio-build. Drafts first; ask before publishing or attaching a domain.
```

## Slash-command equivalents

Ask in plain words: "connect to Nasaq", "build a new site on Nasaq for ...", "build a Nasaq theme for ...", "audit this
screen against the Nasaq UI rules".
