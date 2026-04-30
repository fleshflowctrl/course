-- Run in Supabase: SQL Editor → New query → paste → Run
-- Or: supabase db push (if you use Supabase CLI linked to this project)
--
-- Supports app/supabase-example/page.tsx (select from public.todos).

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now()
);

comment on table public.todos is
  'Demo table for Next.js Supabase example. Replace with your product tables when ready.';

-- Helpful for API / PostgREST
alter table public.todos enable row level security;

-- Drop policies if re-running this script during development
drop policy if exists "todos_select_anon_authenticated" on public.todos;
drop policy if exists "todos_insert_authenticated" on public.todos;
drop policy if exists "todos_update_authenticated" on public.todos;
drop policy if exists "todos_delete_authenticated" on public.todos;

-- Anonymous + logged-in users can read (so the marketing site example page works without login)
create policy "todos_select_anon_authenticated"
  on public.todos
  for select
  to anon, authenticated
  using (true);

-- Optional: only signed-in users can change data (tune for your app)
create policy "todos_insert_authenticated"
  on public.todos
  for insert
  to authenticated
  with check (true);

create policy "todos_update_authenticated"
  on public.todos
  for update
  to authenticated
  using (true)
  with check (true);

create policy "todos_delete_authenticated"
  on public.todos
  for delete
  to authenticated
  using (true);

-- Seed rows (safe to run multiple times: skips if already present)
insert into public.todos (name)
select v
from (values
  ('Welcome — Supabase is connected'),
  ('Add your own rows in the Table Editor or via SQL')
) as t(v)
where not exists (select 1 from public.todos limit 1);
