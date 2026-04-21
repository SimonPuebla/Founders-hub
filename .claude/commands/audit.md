# /audit

Run a design quality check on the specified area. Report issues — no edits.

## Process

1. Identify the target (page, component, or feature area from the argument)
2. Check against all impeccable bans:
   - Glassmorphism as default decoration
   - Gray text on colored backgrounds
   - Pure black/gray (unchromatic)
   - Colored side-stripe card borders
   - Bounce/elastic easing
   - Gradient text
   - Uniform spacing throughout
   - Overloaded accent color (>10% visual weight)
3. Check typography: size contrast, weight variety, line length
4. Check color: WCAG contrast ratios, tinted neutrals
5. Check spacing: 4pt rhythm, visual hierarchy
6. Check motion: transform/opacity only, reduced-motion support

## Output Format

Report: ✅ passes, ⚠️ warnings, ❌ critical issues with file:line references.
End with: top 3 priorities to fix first.
