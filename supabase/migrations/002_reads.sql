-- Reads — saved articles, links, and resources
create table if not exists reads (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text,
  notes text,
  tags text[],
  status text not null default 'unread'
    check (status in ('unread', 'reading', 'done')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists reads_status_idx on reads(status);
create index if not exists reads_created_at_idx on reads(created_at desc);

alter table reads enable row level security;
create policy "Allow all for service role" on reads for all using (true);
