---
description: Design and build a Nasaq Studio theme with real art direction and run the verification gate
argument-hint: "[vertical or brand, e.g. 'specialty coffee roaster']"
---

Create a Nasaq theme. Brief: $ARGUMENTS

Use the `nasaq-theme-build` skill (and `nasaq-ui-design` for tokens and RTL rules). Delegate to the `nasaq-designer` agent if
available. Required outcome:

1. A short written art direction (palette with light and dark, type with Lusail for Arabic, layout concept, imagery, motion).
2. The theme built to the runtime contract found in the user's repo or docs. If no contract or example theme is available,
   stop and ask for it rather than inventing field names.
3. Real bilingual demo content and real preview screenshots.
4. The full verification gate: screenshot matrix (1440 and 390, EN and AR, light and dark), interaction checks, console,
   Lighthouse, scored rubric.
5. Stage with `cms_theme_apply` on a test site, review with `cms_preview_link`, and publish only with approval.

Report the screenshots, scores and anything unverified.
