---
name: nasaq-shadcn
description: Install and use shadcn/ui together with Nasaq UI - the @nasaq registry namespace in components.json, adding Nasaq components with the shadcn CLI, the Nasaq preset and brand themes, how Nasaq tokens map onto shadcn variables, and the optional shadcn MCP server. Use when a project uses shadcn, when the user says "shadcn", "components.json", "npx shadcn add", or wants Nasaq components without the npm package.
---

# shadcn + Nasaq

Nasaq publishes its components as a shadcn registry, and its theme file bridges shadcn's semantic variables to Nasaq's
`--nq-*` tokens. So shadcn components and Nasaq components share one look, one dark mode and one RTL behaviour.

## Pick ONE install channel per project

| Channel | When | Imports |
|---|---|---|
| shadcn CLI (`@nasaq/...`) | Project already uses shadcn, or you want to own and edit the source | `@/components/ui/...` |
| npm package `@fadymondy/nasaq` | You want updates by version bump, no source copy | `@fadymondy/nasaq/web` |

Do not mix both for the same component family; you will get two copies with different behaviour. Plain shadcn
primitives that Nasaq does not provide are fine next to either.

## Set up with the CLI

```bash
npx shadcn@latest init            # if the project has no components.json yet (Tailwind v4, React 19)
```

Add the Nasaq namespace to `components.json`:

```json
{
  "registries": {
    "@nasaq": "https://nasaq-ui.fadymondy.com/r/{name}.json"
  }
}
```

Then add components by name, or the whole preset (tokens, theme bridge, provider, base components):

```bash
npx shadcn@latest add @nasaq/button @nasaq/data-table @nasaq/phone-input
npx shadcn@latest add https://nasaq-ui.fadymondy.com/r/nasaq.json     # preset
npx shadcn@latest add https://nasaq-ui.fadymondy.com/r/theme-<brand>.json   # optional brand theme
```

Component names are the kebab-case catalogue names. The first add also writes `components/nasaq/nasaq-provider.tsx`;
wrap the app in it (same props as the npm `NasaqProvider`: `brand`, `locale`, `onLocaleChange`, `locales`).
Find names and the exact add command per component with the `nasaq-ui` MCP (`search_components`, then `get_component`
which includes the `shadcn` install command) or the index at `https://nasaq-ui.fadymondy.com/registry.json`.
After adding, check what changed in the diff and run the type check; the CLI may add dependencies and CSS.

## Token bridge

Nasaq's `theme.css` uses Tailwind v4 `@theme inline` to point shadcn variables at Nasaq tokens, so:

- `bg-background`, `text-foreground`, `bg-card`, `bg-popover`, `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`,
  `bg-destructive`, `border-border`, `border-input`, `ring-ring`, `bg-sidebar*`, `chart-1..5` all resolve to Nasaq values.
- Nasaq-specific roles are extra utilities: `bg-nq-surface`, `bg-nq-surface-raised`, `bg-nq-surface-overlay`,
  `bg-nq-surface-soft`, `border-nq-line`, `text-nq-fg-muted`, `bg-nq-hover`, `bg-nq-selected`, status
  `nq-success|warning|danger|info`, and `nq-tag-*`.
- Dark mode is the `.dark` class or `[data-theme="dark"]`; `NasaqProvider` and `ThemeSwitcher` manage it.
- Change the look by choosing a brand (`NasaqProvider brand="..."` or a `theme-<brand>` registry item) or by overriding
  `--nq-*` variables in one place (a small CSS file after the imports). Never hard-code colours in components.

Rules from `nasaq-ui-design` apply to shadcn code too: logical CSS (`ms-`, `pe-`, `text-start`), no raw colours, Arabic
font via the token, RTL-safe icons.

## RTL with shadcn components

Stock shadcn components often use physical classes (`left-2`, `ml-auto`, `text-left`). After `shadcn add`, convert them
to logical ones (`start-2`, `ms-auto`, `text-start`) or prefer the Nasaq version of the component, which is already RTL-correct.

## shadcn MCP server (optional)

The official shadcn MCP server lets the agent search registries and install items by prompt. It is not enabled by default
in this plugin (it starts through `npx`, which is slow on first run). Opt in:

```bash
claude mcp add shadcn -- npx shadcn@latest mcp            # Claude Code
```

For Codex see the commented block in `codex/config.toml`. With it connected, ask for "the @nasaq data table" and it
resolves the registry from `components.json`. Without it, use the CLI commands above.

## Checklist

1. `components.json` has the `@nasaq` registry; `tailwind.css` points at the right CSS file and uses CSS variables.
2. Preset or tokens installed; `NasaqProvider` wraps the app; `<html lang dir>` follows the locale.
3. Components come from one channel; imports resolve; type check and build pass.
4. Visual check in EN/AR, light/dark (see `nasaq-ui-design/reference/verification.md`).
