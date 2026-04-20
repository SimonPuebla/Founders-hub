-- Andén Founders Hub — Initial Schema

-- Settings
create table if not exists settings (
  id text primary key default 'default',
  weekly_focus text,
  google_refresh_token text,
  google_connected boolean default false,
  updated_at timestamp with time zone default now()
);

-- OKRs
create table if not exists okrs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  quarter text,
  status text not null default 'on_track'
    check (status in ('on_track','at_risk','off_track','completed','paused')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  owner text,
  deadline date,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- KPIs
create table if not exists kpis (
  id uuid primary key default gen_random_uuid(),
  okr_id uuid references okrs(id) on delete cascade,
  title text not null,
  current_value numeric default 0,
  target_value numeric default 0,
  unit text,
  frequency text,
  updated_at timestamp with time zone default now()
);

-- Opportunities
create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null default 'other'
    check (type in ('investor','gov_contact','startup','institutional_partner',
                    'ecosystem_ally','media_kol','hire','product','deal','other')),
  origin text,
  person text,
  entity text,
  okr_id uuid references okrs(id) on delete set null,
  potential_value text,
  urgency text not null default 'this_quarter'
    check (urgency in ('immediate','this_month','this_quarter','no_rush')),
  difficulty text check (difficulty in ('easy','medium','hard')),
  status text not null default 'captured'
    check (status in ('captured','reviewing','mapped','active','parked',
                      'delegated','ignored','closed')),
  recommended_action text,
  owner text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo'
    check (status in ('todo','doing','waiting','blocked','done','delegated')),
  priority text not null default 'medium'
    check (priority in ('critical','high','medium','low')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  owner text,
  due_date date,
  okr_id uuid references okrs(id) on delete set null,
  project text,
  opportunity_id uuid references opportunities(id) on delete set null,
  input_id uuid,
  people text[],
  context_note text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Inputs
create table if not exists inputs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'note'
    check (type in ('meeting','note','transcript','voice_note','quick_idea',
                    'day_update','weekly_recap')),
  category text not null default 'other'
    check (category in ('fundraising','government','product','demo','event',
                        'strategy','ecosystem','other')),
  content text,
  date date not null default current_date,
  people text[],
  extracted_tasks jsonb,
  extracted_opps jsonb,
  extracted_decisions text[],
  extracted_followups text[],
  linked_okr_ids uuid[],
  linked_opportunity_ids uuid[],
  calendar_event_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- People
create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  organization text,
  relationship text not null default 'other'
    check (relationship in ('team','investor','government','ecosystem',
                            'startup','media','other')),
  notes text,
  last_contact date,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists tasks_status_idx on tasks(status);
create index if not exists tasks_due_date_idx on tasks(due_date);
create index if not exists tasks_okr_id_idx on tasks(okr_id);
create index if not exists opportunities_status_idx on opportunities(status);
create index if not exists opportunities_urgency_idx on opportunities(urgency);
create index if not exists inputs_date_idx on inputs(date desc);
create index if not exists inputs_type_idx on inputs(type);

-- RLS (Row Level Security) — open for single-user app
alter table settings enable row level security;
alter table okrs enable row level security;
alter table kpis enable row level security;
alter table tasks enable row level security;
alter table opportunities enable row level security;
alter table inputs enable row level security;
alter table people enable row level security;

-- Allow all operations for authenticated users and service role
create policy "Allow all for service role" on settings for all using (true);
create policy "Allow all for service role" on okrs for all using (true);
create policy "Allow all for service role" on kpis for all using (true);
create policy "Allow all for service role" on tasks for all using (true);
create policy "Allow all for service role" on opportunities for all using (true);
create policy "Allow all for service role" on inputs for all using (true);
create policy "Allow all for service role" on people for all using (true);
