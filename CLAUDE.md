# Andén — Founders Hub

Personal operating system for Simo, co-founder and CBO of Andén.

## Stack
- Next.js 14 (App Router), TypeScript
- Supabase (Postgres + RLS)
- Tailwind CSS
- shadcn-style UI components in `/components/ui/`
- Zustand for global state (`/lib/store.ts`)
- Google Calendar API via OAuth2

## Setup

1. Copy `.env.example` to `.env.local` and fill in values
2. Run the migration in Supabase: `supabase/migrations/001_initial_schema.sql`
3. Go to `/settings` and click "Load Seed Data" to populate Andén data
4. Optionally connect Google Calendar from `/settings`

## Dev
```bash
npm install
npm run dev
```

## Structure
- `/app` — pages (App Router)
- `/components/layout` — Sidebar
- `/components/ui` — reusable primitives
- `/components/shared` — StatusBadge, CommandPalette, QuickCapture, KeyboardShortcuts
- `/components/dashboard|strategy|tasks|opportunities|inputs|people` — module components
- `/lib` — Supabase client, Google Calendar, Zustand store, utils
- `/types/index.ts` — all shared TypeScript types
- `/data/seed.ts` — Andén-specific seed data

## Keyboard Shortcuts
- `Cmd+K` — Command palette
- `N` — New task (quick capture)
- `O` — New opportunity (quick capture)
- `I` — New input (quick capture)
- `Esc` — Close any panel/modal

## Design System

Installed: **Impeccable** (`.claude/skills/impeccable/`) — Stripe-inspired, OKLCH colors, clean cards.

**Absolute bans:** glassmorphism as decoration, gradient text, pure black/gray, colored side-stripe card borders, Inter/Roboto by reflex.

**Color:** CSS custom properties in `globals.css` via OKLCH. Use `var(--blue)`, `var(--text-primary)`, etc. Brand hue = 250.

**Cards:** `.card`, `.card-hero`, `.card-elevated` classes. No blur/transparency.

**Typography:** Jost (Google Font), 5-tier scale: 11/12/13/18/24px+. Numbers use `tabular-nums`.

**Commands:** `/audit`, `/polish`, `/critique` — see `.claude/commands/`.

## Key Decisions
- Single-user app, no auth required beyond service role
- RLS policies allow all operations (open policy)
- Jost (Google Font) via next/font — weights 300–700
- Colors via CSS custom properties (OKLCH) in globals.css

## Coding Guidelines (Karpathy)

**Think Before Coding** — State assumptions explicitly. If multiple interpretations exist, present them. If simpler approach exists, say so. Stop and ask when confused.

**Simplicity First** — Minimum code that solves the problem. No features beyond what was asked, no abstractions for single-use code, no speculative flexibility. If 200 lines could be 50, rewrite.

**Surgical Changes** — Touch only what you must. Don't improve adjacent code or refactor things that aren't broken. Every changed line should trace directly to the user's request.

**Goal-Driven Execution** — Transform tasks into verifiable goals. For multi-step tasks, state a brief plan with verification steps.
