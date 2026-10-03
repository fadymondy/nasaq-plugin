# UI verification

Run this against the running app (dev server or a preview URL). Use whatever browser tool you have (Chrome DevTools MCP,
Playwright, a preview tool). Looking at real screenshots is mandatory; a passing build is not evidence of good design.

## Screenshot matrix

For each changed screen capture 8 shots:

| Width | Locale | Theme |
|---|---|---|
| 1440 | en | light |
| 1440 | en | dark |
| 1440 | ar | light |
| 1440 | ar | dark |
| 390 | en | light |
| 390 | en | dark |
| 390 | ar | light |
| 390 | ar | dark |

Also capture the loading, empty, error and a long-content state for the screens that have them.

## Checks (mark pass or fail with evidence)

1. **Direction**: in `ar`, `<html dir="rtl" lang="ar">`; sidebar on the right; chevrons and arrows mirrored; no clipped or overlapping text.
2. **Font**: evaluate `getComputedStyle(document.body).fontFamily` in `ar` and confirm Lusail is first and loaded
   (`document.fonts.check('16px Lusail')` is true). If the product has no Lusail licence, report it instead of passing.
3. **Overflow**: `document.documentElement.scrollWidth <= innerWidth` at 390 and 1440; tables scroll inside their container.
4. **Console**: no errors or hydration warnings; no failed network requests for assets.
5. **Colour**: search the diff for hex, `rgb(`, `hsl(`, palette classes (`-(red|blue|gray|slate|zinc|green)-\d`). None allowed.
6. **Logical CSS**: search for `\b(ml|mr|pl|pr)-\d`, `left-`, `right-`, `text-left`, `text-right`. None allowed.
7. **Shell rules**: exactly one user menu (in the sidebar footer); workspace switcher in the sidebar header; no duplicate theme/language toggles.
8. **Components**: no hand-built dropdown, modal, tabs, table or picker where a Nasaq component exists.
9. **Forms**: every control labelled; errors adjacent to fields; `PhoneInput` for phones; image fields have upload, library and link.
10. **States**: loading, empty (with action), error (with retry) exist and look intentional.
11. **Dark mode**: designed, not inverted. Borders and surfaces separate; text contrast holds; images and shadows still read.
12. **Accessibility**: tab through the screen (visible focus, logical order, no traps); Escape closes overlays;
    contrast at least 4.5:1 for text, 3:1 for UI; touch targets at least 44px on mobile; reduced motion respected.
13. **Strings**: switching language changes every visible string; no English in `ar`, no raw keys.

## Score and report

Rate each of: Layout and hierarchy, Consistency with Nasaq, RTL/bilingual, Tokens and theming, States, Accessibility
(0-5). Anything below 4 is fixed before you call it done. Report: screenshots taken (list), failed checks with file and
line, fixes made, and what could not be verified.
