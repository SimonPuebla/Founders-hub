# Impeccable Design Skill

Frontend design skill for production-grade interfaces that avoid generic AI aesthetics.

## Absolute Bans

- ❌ Glassmorphism as default decoration (`backdrop-filter: blur` on every card)
- ❌ Gradient text (background-clip: text)
- ❌ Colored side-stripe borders (>1px) on cards or alerts
- ❌ Bounce/elastic easing (`cubic-bezier` with values outside 0–1)
- ❌ Purple gradients as brand color (reflex default)
- ❌ Inter/Roboto/system-ui without reason — choose with intention
- ❌ Pure black (#000) or pure gray (oklch chroma 0) for large areas
- ❌ Gray text on any colored background — use a darker shade of that color instead
- ❌ Light gray placeholder text (fails WCAG 4.5:1)
- ❌ Cards nested inside cards without elevation change
- ❌ Uniform spacing throughout — vary rhythm deliberately

## Color System

Use OKLCH, not HSL. OKLCH is perceptually uniform — equal steps look equal.

```css
/* Page background — barely-there blue-tinted white */
--bg: oklch(97.5% 0.003 250);

/* Surfaces */
--surface: oklch(100% 0 0);         /* white cards */
--surface-raised: oklch(99% 0.003 250);

/* Borders */
--border: oklch(90% 0.005 250);
--border-strong: oklch(82% 0.008 250);

/* Text — always tinted toward brand hue */
--text-primary: oklch(17% 0.015 260);
--text-secondary: oklch(45% 0.012 260);
--text-muted: oklch(65% 0.008 260);

/* Brand — don't reach for blue reflexively; this project uses blue */
--blue: oklch(53% 0.19 250);
--green: oklch(54% 0.155 145);
--red: oklch(48% 0.205 25);
--amber: oklch(70% 0.17 70);
--purple: oklch(52% 0.22 295);
```

60-30-10 visual weight:
- 60% neutral backgrounds & white space
- 30% secondary — text, borders, inactive states
- 10% accent — CTAs, highlights, focus states

## Typography

- Use ONE well-chosen font family in multiple weights (Jost: 300/400/500/600/700)
- Five-tier scale: 11px / 13px / 14px / 18px / 24px+ — fewer sizes, more contrast
- Line length: 60-75ch for body. Use `max-w-prose` or explicit `ch` units
- Tabular numbers for data: `font-variant-numeric: tabular-nums`
- No `font-weight: 400` for everything — vary weights deliberately

## Spatial Design (4pt Base)

Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px

- Tighter within components (4–8px between related elements)
- Looser between sections (24–48px)
- Never uniform padding everywhere — create breathing room deliberately

## Cards

```css
.card {
  background: white;
  border: 1px solid oklch(90% 0.005 250);
  border-radius: 10px;
  box-shadow: 0 1px 2px oklch(0% 0 0 / 0.05), 0 2px 8px oklch(0% 0 0 / 0.04);
}

.card-elevated {
  box-shadow: 0 2px 4px oklch(0% 0 0 / 0.06), 0 8px 24px oklch(0% 0 0 / 0.06);
}
```

## Motion

- Only animate `transform` and `opacity` (no layout recalculation)
- Ease-out for arrivals, ease-in for departures, ease-in-out for toggles
- 100-150ms micro-interactions, 200-300ms state changes
- Always support `prefers-reduced-motion`

## AI Slop Test

Would a viewer immediately recognize AI authorship? Interfaces should prompt curiosity about the design process, not assumptions about its origin.

See reference files: typography.md, color.md, spatial.md, interaction.md, ux-writing.md
