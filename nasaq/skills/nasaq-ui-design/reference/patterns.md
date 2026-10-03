# Nasaq UI patterns

Short, working compositions. Confirm exact props with `get_component` before relying on them; versions move.

## App shell: workspace switcher up top, one user menu at the bottom

```tsx
import {
  AppShell, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarItem,
  AppHeader, AppMain, SidebarTrigger, WorkspaceSwitcher, UserMenu,
} from "@fadymondy/nasaq/web";
import { LayoutDashboard, Users, Settings } from "lucide-react";

export function Shell({ children, user, workspaces, workspaceId, onWorkspace, onSignOut, t, path }: ShellProps) {
  return (
    <AppShell
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <WorkspaceSwitcher workspaces={workspaces} value={workspaceId} onValueChange={onWorkspace} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label={t("nav.main")}>
              <SidebarItem href="/" icon={<LayoutDashboard />} active={path === "/"}>{t("nav.home")}</SidebarItem>
              <SidebarItem href="/customers" icon={<Users />} active={path.startsWith("/customers")}>{t("nav.customers")}</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <UserMenu user={user} variant="sidebar" onSignOut={onSignOut} />
          </SidebarFooter>
        </Sidebar>
      }
    >
      <AppHeader><SidebarTrigger /></AppHeader>
      <AppMain>{children}</AppMain>
    </AppShell>
  );
}
```

Notes: `SidebarItem` renders a plain `<a>`; wire it to your router (`onClick` + `preventDefault` + `router.push`) or wrap
it. Keep `AppShell` inside `NasaqProvider`. Theme and language switching live inside `UserMenu`, not in the header.

## Page with a table

```tsx
import { PageHeader, DataState, DataTable, useDataTable, DataTableToolbar, DataTableSearch,
  DataTablePagination, Button } from "@fadymondy/nasaq/web";

const columns = [/* defined at module level, headers from t() */];

function CustomersPage() {
  const q = useCustomers();               // react-query or similar
  const table = useDataTable({ data: q.data ?? [], columns });
  return (
    <>
      <PageHeader title={t("customers.title")} description={t("customers.desc")}
        actions={<Button onClick={openCreate}>{t("customers.add")}</Button>} />
      <DataState loading={q.isLoading} error={q.error} onRetry={q.refetch}
        empty={q.data?.length === 0} emptyAction={<Button onClick={openCreate}>{t("customers.add")}</Button>}>
        <DataTableToolbar table={table}><DataTableSearch table={table} /></DataTableToolbar>
        <DataTable table={table} />
        <DataTablePagination table={table} />
      </DataState>
    </>
  );
}
```

Format numbers, dates and currency with `Intl` using the active locale. Put numeric columns at the inline end
(`text-end`) and keep Latin digits or Arabic-Indic digits consistent per product decision.

## Form

```tsx
<form onSubmit={submit} className="grid gap-4 max-w-xl">
  <Field invalid={!!errors.name}>
    <FieldLabel>{t("form.name")}</FieldLabel>
    <Input value={name} onChange={...} />
    <FieldError>{errors.name}</FieldError>
  </Field>
  <Field>
    <FieldLabel>{t("form.phone")}</FieldLabel>
    <PhoneInput value={phone} onValueChange={setPhone} defaultCountry="SA" />
    <FieldDescription>{t("form.phoneHint")}</FieldDescription>
  </Field>
  <Button type="submit" loading={saving}>{t("common.save")}</Button>
</form>
```

Disable only while saving, show the server error in the field it belongs to, keep entered values on failure.

## Three-source image field (build once, reuse)

Tabs inside a Dialog or Popover: **Upload** (`FileUpload`: type and size limits, progress, drag and drop), **Library**
(grid of existing media with search, select one or many), **Link** (URL `Input`, validate, preview, then import/store).
Always show a preview, a remove button, and alt text inputs for each language. The field returns `{ url, alt: {en, ar} }`.
Where the backend can only ingest by link (for example Nasaq Studio over MCP), the Upload tab sends the file to your own
storage first, then stores the resulting URL.

## States

| State | Component | Content |
|---|---|---|
| loading | `LoadingState` / `Skeleton` shaped like the content | no spinner-only screens |
| empty | `EmptyState` | what this is, why empty, one primary action |
| error | `ErrorState` | plain-language cause, retry, support path |
| forbidden | `EmptyState` variant | who can grant access |
| partial | inline `Alert` | what failed, keep the rest usable |

## RTL specifics

- Direction comes from the provider; never set `dir` by hand on layout wrappers.
- Logical utilities only. Search your diff for `\b(ml|mr|pl|pr|left|right)-` and `text-(left|right)`.
- Icons that imply direction get `rtl:-scale-x-100` (or the component's built-in mirroring).
- Mixed content: wrap Latin fragments in `<bdi>`; show phone numbers and emails with `dir="ltr"` and `text-start`.
- Numerals and units follow `Intl.NumberFormat(locale)`; do not concatenate strings to build sentences, use ICU messages.
- Arabic body copy: font `--nq-font-arabic` (Lusail first), line-height 1.7+, no uppercase transforms, no letter-spacing.

## Forbidden shortcuts

Hand-built dropdowns, modals, tabs, date pickers or tables; second user menus; raw hex/rgb; inline `style={{color:...}}`;
hard-coded `px` colours in CSS modules; English-only strings; cards inside cards; screens without loading/empty/error.
