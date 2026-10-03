# Nasaq plugin for Claude Code and Codex

Build sites, apps and themes on [Nasaq Studio](https://studio.nasaqui.com) over MCP, and design with
[Nasaq UI](https://nasaq-ui.fadymondy.com) components and shadcn, without guessing tool names or breaking RTL.

| Folder | For | What it is |
|---|---|---|
| [`nasaq/`](nasaq/) | Claude Code | The plugin: MCP servers, 5 skills, 5 commands, 2 agents. |
| [`codex/`](codex/) | OpenAI Codex | MCP config, install steps, AGENTS.md roles. Codex can also install the same plugin. |
| [`scripts/`](scripts/) | Maintainers | `check-tools.mjs` verifies every `cms_*` tool named in the docs exists in `tools.json`. |

## What you get

- **MCP**: `nasaq-studio` (`https://studio.nasaqui.com/api/mcp`, OAuth) and `nasaq-ui` (public catalogue of Nasaq components,
  tokens and setup guides).
- **Skills**
  - `nasaq-studio-build`: project, content model, bilingual entries, media, menus, theme, publish, domain, apps; with the exact `cms_*` tools.
  - `nasaq-ui-design`: shell, forms, tables, states, RTL, Lusail, tokens, dark mode, accessibility, and a screenshot checklist.
  - `nasaq-theme-build`: themes as real runtime code: the package contract, builder-driven settings, art direction (with approved examples), previews, live-demo model, porting, and the verification gate with a self-check script.
  - `nasaq-app-build`: CircleXO apps: splash then SSO entry flow, SDK and events webhook, hub manifest, store listings.
  - `nasaq-shadcn`: the `@nasaq` registry, preset, token bridge, shadcn MCP.
- **Commands**: `/nasaq:connect`, `/nasaq:new-site`, `/nasaq:new-theme`, `/nasaq:new-app`, `/nasaq:audit-ui`.
- **Agents**: `nasaq-designer` (builds and verifies), `nasaq-ui-reviewer` (read-only audit).

## Install: Claude Code

```text
/plugin marketplace add fadymondy/nasaq-plugin
/plugin install nasaq@nasaq
```

Then run `/mcp`, pick `nasaq-studio` and sign in (OAuth), or run `/nasaq:connect`.

Headless or CI: create a workspace token in Studio, export `NASAQ_TOKEN` in your shell, then

```bash
claude mcp add --transport http nasaq-studio https://studio.nasaqui.com/api/mcp --header "Authorization: Bearer $NASAQ_TOKEN"
```

Optional shadcn MCP: `claude mcp add shadcn -- npx shadcn@latest mcp`.

## Install: Codex

```bash
codex plugin marketplace add fadymondy/nasaq-plugin
codex plugin add nasaq@nasaq
codex mcp login nasaq-studio
```

Manual setup and token auth: [`codex/README.md`](codex/README.md).

## Auth and safety

- OAuth is the default; no token is shipped in this repo. Tokens (`nsq_...`) come from your own Studio and live in env vars.
- Scopes follow your role: viewers read, editors read and write, owners and admins can also manage domains and apps.
- The skills build drafts first and ask before publishing, attaching a domain, or any destructive call.
- Rate limit is about 120 calls per minute per token.

## Quick start

1. `/nasaq:connect`
2. `/nasaq:new-site "Bilingual website for a specialty coffee roaster in Riyadh"`
3. `/nasaq:audit-ui http://localhost:3000/ar/dashboard`

Examples to try:

- "Add a Services type with title, summary and icon, and create five services in English and Arabic."
- "Restyle the brand kit to a deep green and gold, light and dark, and show me the preview."
- "Build a settings screen with Nasaq UI: phone, address, logo upload, and make sure it works in Arabic."
- "Install the Nasaq data table with shadcn and wire it to this API."

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md).

## Unverified in v0.2.0

- Tool names were checked against the Studio tool registry; a live `tools/list` needs a signed-in token. If a tool is
  missing, trust the server.
- `AddressInput` is not exported by `@fadymondy/nasaq` 1.0.0; the skill says how to handle it.
- The theme runtime contract is documented from the v1 runtime; a newer runtime document in your repo wins on field names.
- The `platform_*` MCP tools are for platform administrators and are not covered by the skills.

## Validate

```bash
claude plugin validate .
node scripts/check-tools.mjs
```

MIT licensed.

---

## بالعربية

إضافة لـ Claude Code وCodex تُسهّل بناء المواقع والتطبيقات والقوالب على **Nasaq Studio** عبر MCP، وتصميم الواجهات بمكوّنات **Nasaq UI** وshadcn بجودة عالية ودعم كامل للعربية وRTL.

**التثبيت في Claude Code**

```text
/plugin marketplace add fadymondy/nasaq-plugin
/plugin install nasaq@nasaq
```

ثم افتح `/mcp` واختر `nasaq-studio` وسجّل الدخول (OAuth)، أو شغّل `/nasaq:connect`.

**التثبيت في Codex**

```bash
codex plugin marketplace add fadymondy/nasaq-plugin
codex plugin add nasaq@nasaq
codex mcp login nasaq-studio
```

**ماذا تحصل عليه**

- مهارات: بناء الموقع على Studio، تصميم الواجهات، بناء القوالب، وshadcn.
- أوامر: `/nasaq:connect` و`/nasaq:new-site` و`/nasaq:new-theme` و`/nasaq:audit-ui`.
- وكلاء: `nasaq-designer` للبناء والتحقق بلقطات الشاشة، و`nasaq-ui-reviewer` للمراجعة.

**قواعد التصميم المضمّنة:** خط Lusail للعربية، مكوّنات `PhoneInput` و`AddressInput` من Nasaq، حقول الصور (رفع / مكتبة / رابط)، ثنائية اللغة مع RTL صحيح، استخدام مكوّنات Nasaq كما هي، قائمة مستخدم واحدة وسط الشريط الجانبي ومبدّل المساحات فيه، وألوان من الـ tokens فقط.

**الأمان:** لا يوجد أي توكن داخل المستودع. الدخول عبر OAuth أو توكن شخصي في متغيّر بيئة (`NASAQ_TOKEN`). تُنشأ المسودات أولاً ولا يتم النشر أو ربط النطاق دون موافقتك.
