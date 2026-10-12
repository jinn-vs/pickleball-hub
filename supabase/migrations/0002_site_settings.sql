-- Singleton site settings (editable from the admin panel).
-- One row per site (each site has its own Supabase project), id is always 1.

create table if not exists public.site_settings (
  id             int primary key default 1,
  hero_title     text,
  hero_subtitle  text,
  hero_image_url text,
  logo_url       text,
  updated_at     timestamptz default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists touch_site_settings on public.site_settings;
create trigger touch_site_settings before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- RLS: anyone can read settings; writes only via service role (admin API).
alter table public.site_settings enable row level security;
drop policy if exists "read site settings" on public.site_settings;
create policy "read site settings" on public.site_settings
  for select to anon, authenticated using (true);
