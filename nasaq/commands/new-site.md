---
description: Build a new bilingual site on Nasaq Studio step by step over MCP (project, content model, pages, theme, publish)
argument-hint: "[site name or short brief]"
---

Build a site on Nasaq Studio. Brief: $ARGUMENTS

Use the `nasaq-studio-build` skill and follow its steps in order. Specifically:

1. Run the connection check (`cms_list_sites`). If it fails, do what `/nasaq:connect` says.
2. If the brief is thin, ask at most four questions in one message: audience and goal, pages needed, tone and languages
   (EN/AR), and any brand assets (logo, colours, photos). Otherwise proceed with sensible defaults and state them.
3. Reuse or create the project, model the content, write real bilingual entries as drafts, import media by link, build the
   main and footer menus, set the brand kit, and stage a theme.
4. Preview every key page (home plus two inner pages) in EN and AR, desktop and mobile, light and dark. Look at them and fix issues.
5. Show the user a summary and the preview links. Publish (`cms_publish`, `cms_theme_publish`) and attach a domain only
   after they approve.
