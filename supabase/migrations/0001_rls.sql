-- Row Level Security: anon can READ published content only.
-- Writes happen exclusively through the service-role key in /api routes (bypasses RLS),
-- so we intentionally create NO insert/update/delete policies for anon/authenticated.

alter table public.categories enable row level security;
alter table public.authors    enable row level security;
alter table public.articles   enable row level security;

-- Public read: reference tables fully visible
drop policy if exists "read categories" on public.categories;
create policy "read categories" on public.categories for select to anon, authenticated using (true);

drop policy if exists "read authors" on public.authors;
create policy "read authors" on public.authors for select to anon, authenticated using (true);

-- Public read: only published articles
drop policy if exists "read published articles" on public.articles;
create policy "read published articles" on public.articles
  for select to anon, authenticated using (is_published = true);
