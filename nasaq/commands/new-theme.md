---
description: Design and build a Nasaq Studio theme as real runtime code with art direction, a builder-driven settings schema, and run the verification gate
argument-hint: "[vertical or brand, e.g. 'specialty coffee roaster']"
---

Create a Nasaq theme. Brief: $ARGUMENTS

Use the `nasaq-theme-build` skill (and `nasaq-ui-design` for tokens and RTL rules). Delegate to the `nasaq-designer` agent if
available. Required outcome:

1. A short written art direction in `DESIGN.md` (palette with light and dark, type with Lusail for Arabic, layout concept,
   imagery, motion, benchmarks), distinct from the approved directions listed in `reference/craft.md`.
2. The theme built to the runtime contract in `reference/runtime-contract.md` (or a newer one in the user's repo): manifest,
   templates, layout, `demo.json`. Fully builder-driven: no hard-coded copy, colours or brand; every setting declared is read.
3. Real bilingual demo content and generated previews named `<device>-<locale>-<page>.png` (plus a dark variant).
4. The full gate in `reference/gate.md`: self-check script, polish audit over every template plus the 404, screenshot
   matrix looked at by you, Lighthouse, scored rubric.
5. Stage with `cms_theme_apply` on a test site, review with `cms_preview_link`, and publish only with approval.

Report the screenshots, audit output, scores and anything unverified.
