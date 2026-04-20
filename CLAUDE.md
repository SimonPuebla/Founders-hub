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

## Key Decisions
- Single-user app, no auth required beyond service role
- RLS policies allow all operations (open policy)
- Geist font for both sans and mono
- All colors use explicit hex values (no CSS variables for core palette)
