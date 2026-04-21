# Color & Contrast (Impeccable Reference)

## Use OKLCH, not HSL

OKLCH is perceptually uniform. Equal lightness steps look equal, unlike HSL where yellow at 50% looks bright while blue at 50% looks dark.

`oklch(lightness% chroma hue)` — lightness 0–100%, chroma 0–0.4, hue 0–360.

To build shades: hold chroma+hue constant, vary lightness. Reduce chroma as you approach white or black.

## This Project's Palette

Brand hue: 250 (blue). All neutrals tint toward 250.

| Token | OKLCH | Use |
|-------|-------|-----|
| --bg | oklch(97.5% 0.003 250) | Page background |
| --surface | white | Cards, panels |
| --border | oklch(90% 0.005 250) | Card borders, dividers |
| --border-strong | oklch(82% 0.008 250) | Input borders |
| --text-primary | oklch(17% 0.015 260) | Headings, labels |
| --text-secondary | oklch(45% 0.012 260) | Body text |
| --text-muted | oklch(65% 0.008 260) | Placeholders, captions |
| --blue | oklch(53% 0.19 250) | CTAs, links |
| --blue-light | oklch(95% 0.02 250) | Blue tint backgrounds |
| --green | oklch(54% 0.155 145) | Success, done |
| --red | oklch(48% 0.205 25) | Error, critical |
| --amber | oklch(70% 0.17 70) | Warning, at-risk |
| --purple | oklch(52% 0.22 295) | OKR tags |

## 60-30-10 Rule

- **60%** neutral backgrounds and white space
- **30%** secondary — text, borders, inactive
- **10%** accent — CTAs, highlights, focus

## Never

- Pure black `#000` — adds tiny chroma: `oklch(5% 0.01 260)`
- Pure gray (chroma 0) — tint toward brand: min chroma 0.005
- Gray text on any colored background — use darker shade of that color
- Gradient text — banned entirely
- Heavy alpha (rgba everywhere) — define explicit colors per context
