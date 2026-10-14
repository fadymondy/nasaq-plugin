# AGENTS.md

Notes for AI coding agents working in this repository.

- **What it is:** a Claude Code plugin (`nasaq/`: MCP servers, skills, commands, agents) and the matching
  Codex setup (`codex/`), for building on Nasaq Studio and designing with Nasaq UI.
- **Checks:** `claude plugin validate .` and `node scripts/check-tools.mjs`. The second fails if a skill or
  command names an MCP tool that is not in `scripts/tools.json`; update that list from a live `tools/list`
  when the Studio adds tools.
- **Skills** are Markdown with front matter (`nasaq/skills/<name>/SKILL.md` plus `reference/`). Keep
  instructions specific and tool names exact.
- **Secrets:** none belong in this repo. MCP auth happens at install time through the client's OAuth flow.
