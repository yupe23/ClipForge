create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt() ->> 'sub'),
  title text not null,
  status text not null default 'draft',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint projects_status_check check (status in ('draft', 'ready', 'processing', 'completed', 'failed'))
);

create index if not exists projects_user_id_created_at_idx on public.projects (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.projects force row level security;

revoke all on public.projects from anon;
revoke all on public.projects from authenticated;
grant select (id, user_id, title, status, created_at, updated_at), insert (title, status), update (status) on public.projects to authenticated;

do $$
declare
  policy_name text;
begin
  for policy_name in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
  loop
    execute format('drop policy if exists %I on public.projects', policy_name);
  end loop;
end;
$$;

create policy "Users can read their projects"
on public.projects
for select
to authenticated
using (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can create their projects"
on public.projects
for insert
to authenticated
with check (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can update their projects"
on public.projects
for update
to authenticated
using (user_id = (select auth.jwt() ->> 'sub'))
with check (user_id = (select auth.jwt() ->> 'sub'));
