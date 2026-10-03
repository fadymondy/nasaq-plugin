---
name: nasaq-ui-design
description: Build app UIs with Nasaq UI (@fadymondy/nasaq) and shadcn - the app shell, sidebar with workspace switcher and one user menu, forms, data tables, empty/loading/error states, bilingual EN/AR with correct RTL, Lusail Arabic, design tokens, dark mode, motion and accessibility - and prove it with a screenshot checklist (EN/AR, desktop/mobile, light/dark). Use when creating or changing any screen, dashboard, admin, settings page, form or table in a Nasaq-based app, or when the user mentions Nasaq UI, NasaqProvider, AppShell, tokens, RTL or Arabic UI.
---

# Designing with Nasaq UI

Nasaq UI is a React 19 + Base UI + Tailwind v4 component system (about 390 components) built for Arabic and RTL first.
Do not guess its API from memory: the `nasaq-ui` MCP server is the catalogue.

## Find, then use (always in this order)

1. `get_setup { framework }` (`react`, `shadcn`, `inertia`, `vue`, `nuxt`, `blade`, `livewire`, `filament`, `html`, ...) for install, CSS and provider.
2. `search_components { query: "switch between workspaces" }` or `list_components { category }` to find a component by need.
3. `get_component { name, include: "all" }` for the manual: props, examples, RTL notes, accessibility, source, and the
   `shadcn` install command. `framework` returns that stack's code instead.
4. `get_foundation { topic }` for the rules (`color`, `layout`, `setup-react`, `setup-shadcn`, ...) and
   `list_tokens { prefix: "--nq-surface" }` for token values.

If the `nasaq-ui` MCP is not connected, the same catalogue is at `https://nasaq-ui.fadymondy.com` and the registry
index at `https://nasaq-ui.fadymondy.com/registry.json`.

## The non-negotiable rules

1. **Use Nasaq components as they are. Never re-implement one.** Before writing any control, container, table, dialog,
   menu, picker or state, search the catalogue. Compose Nasaq parts; do not fork or restyle their internals. If a
   component truly lacks something, say so and propose the smallest extension, do not build a lookalike.
2. **Tokens, never raw colours.** No hex, `rgb()`, `hsl()`, or Tailwind palette classes (`bg-blue-500`, `text-gray-600`).
   Use semantic classes: `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`,
   `bg-primary`, `ring-ring`, and Nasaq's `nq-*` set (`bg-nq-surface`, `bg-nq-surface-raised`, `bg-nq-hover`,
   `bg-nq-selected`, `text-nq-fg-muted`, `border-nq-line`, status `text-nq-danger-text` / `bg-nq-danger-soft`).
   Rounded corners, spacing and density come from tokens too.
3. **One user menu, in the sidebar footer. Tenant/workspace switcher in the sidebar header.** `UserMenu` goes in
   `SidebarFooter` (identity, account items, theme and language submenus, sign out). `WorkspaceSwitcher` goes in
   `SidebarHeader`. No second avatar menu in the top bar, no duplicate theme/language toggles elsewhere.
4. **Bilingual EN/AR, RTL correct.** Locale and direction live on `<html>` via `NasaqProvider` (`locale`, `onLocaleChange`,
   `locales`). Every user-visible string exists in both languages (no hard-coded English). Use logical CSS only
   (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `border-s`; never `ml-`, `pr-`, `left-`, `text-left`).
   Mirror directional icons (chevrons, arrows, back/forward, progress); do not mirror logos, clocks, play, phone.
   Isolate LTR data inside RTL text (emails, URLs, codes, phone numbers) with `dir="ltr"` or `<bdi>`.
5. **Lusail for Arabic.** The Arabic font stack starts with Lusail (`--nq-font-arabic`). Lusail is a commercial face that
   Nasaq does not redistribute: load the product's licensed files with `@font-face` (`font-display: swap`) and confirm in the
   browser that Arabic text really renders in Lusail (see verification). Arabic needs line-height 1.7 or more and no
   letter-spacing.
6. **Phone and address fields use Nasaq inputs.** Phones: `PhoneInput` (searchable country list, Arabic/English names,
   value stored as E.164). Addresses: Nasaq's `AddressInput` where the installed version exports it (check with
   `search_components "address"` or the package types); until then keep one shared address component for the whole
   app, never per-form ad hoc fields. Country pickers use `CountryFlag` + `Combobox`.
7. **Image fields offer three sources in one control: upload, choose from the library, paste a link.** Single or multi,
   with EN/AR alt text. Build it once per app from Nasaq parts (`FileUpload`, `Dialog`, `Tabs`, `Input`) and reuse it everywhere.
8. **Design every state.** Loading, empty, error (with retry), signed-out, forbidden, and the populated state. Use `DataState`
   (fixed order: loading, signed out, unavailable, error with retry, empty with action, content) or `LoadingState`,
   `EmptyState`, `ErrorState`. No spinner-only screens; no blank panels.
9. **Accessible by default.** Visible focus (`ring`), 44px touch targets on mobile, labelled controls (`Field`, `FieldLabel`),
   `aria-current` on active nav (Nasaq's `SidebarItem` handles it), keyboard operable everything, contrast 4.5:1, status never
   by colour alone (`Status` and `Badge` carry a label and icon). Respect `prefers-reduced-motion`.
10. **Flat layouts.** Content sits on `surface`; separate groups with space and headings. Cards only for units the user acts
    on or compares (KPI, plan, app tile). No cards inside cards, no decorative filler widgets.

## Project setup (React, Next.js, Vite)

```bash
pnpm add @fadymondy/nasaq lucide-react
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@fadymondy/nasaq/tokens.css";
@import "@fadymondy/nasaq/theme.css";
@import "@fadymondy/nasaq/web/styles.css";
@source "../node_modules/@fadymondy/nasaq/dist/web";   /* path relative to this file */
```

```tsx
import { NasaqProvider, Toaster } from "@fadymondy/nasaq/web";

export function Providers({ locale, children }: { locale: "en" | "ar"; children: React.ReactNode }) {
  return (
    <NasaqProvider brand="nasaq" locale={locale} onLocaleChange={switchLocale} locales={[
      { value: "en", label: "English", dir: "ltr" }, { value: "ar", label: "العربية", dir: "rtl" },
    ]}>
      {children}
      <Toaster />
    </NasaqProvider>
  );
}
```

Next.js: put the locale in the URL (`/en/...`, `/ar/...`), validate it in `app/[locale]/layout.tsx`, and switch locale with a
full page load so `<html lang dir>` is re-rendered from the root layout. With the shadcn CLI instead of npm, see the
`nasaq-shadcn` skill. Use one install channel for Nasaq components per project.

## Screen anatomy

- Frame: `AppShell` with `sidebar={...}`; `AppHeader` (with `SidebarTrigger`, breadcrumbs, search trigger); `AppMain` for content.
- Page: `PageHeader` (breadcrumbs, title, description, actions at the inline end) then the content.
- Lists: `DataTable` with `useDataTable` (search, facet filters, sorting, column visibility, selection, row actions,
  pagination). Define `columns` outside the component or memoise them.
- Forms: `Field` / `FieldLabel` / `FieldDescription` / `FieldError` around `Input`, `Textarea`, `Select`, `Combobox`, `PhoneInput`,
  `Switch`. Validation errors under the field in the user's language. Primary action once per view; destructive actions
  through `ConfirmButton` or a type-to-confirm dialog.
- Feedback: `toast` for results of actions, `Alert` for persistent messages, `Dialog` / `Sheet` / `Drawer` for focused tasks.
- Mobile: the sidebar becomes a sheet below `md`; check dense tables (switch to a card list or horizontal scroll inside
  the table container, never the page).

Worked examples (shell, table page, form, states, three-source image field, RTL notes) are in
[`reference/patterns.md`](reference/patterns.md).

## Motion

Short and purposeful: 150-300 ms for state changes, one orchestrated entrance at most, no looping decoration in tools.
Use transform/opacity, never animate layout properties; honour `prefers-reduced-motion` (Nasaq components already do;
custom motion must too).

## Definition of done (verification)

A screen is not finished until you have looked at it. Follow [`reference/verification.md`](reference/verification.md):
screenshots in EN and AR, desktop (1440) and mobile (390), light and dark (8 shots), plus the console, overflow, font and
raw-colour checks. Use `/nasaq:audit-ui` or the `nasaq-ui-reviewer` agent to run it and score the result.
