-- Pickleball Hub — initial schema
-- Run in Supabase SQL editor (or `supabase db push`).

create extension if not exists "pgcrypto";

-- ───────── categories ─────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ───────── authors ─────────
create table if not exists public.authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  bio        text,
  photo_url  text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ───────── articles (with SEO fields + tags) ─────────
create table if not exists public.articles (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  excerpt            text,
  body               text,
  section            text,
  featured_image_url text,
  author_id          uuid references public.authors(id) on delete set null,
  category_id        uuid references public.categories(id) on delete set null,
  tags               text[] default '{}',
  faqs               jsonb default '[]',
  seo_title          text,
  seo_description    text,
  seo_keywords       text,
  is_published       boolean default false,
  published_at       timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);
create index if not exists articles_published_idx on public.articles (is_published, published_at desc);
create index if not exists articles_category_idx on public.articles (category_id);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare t text;
begin
  foreach t in array array['categories','authors','articles']
  loop
    execute format(
      'drop trigger if exists touch_%1$s on public.%1$s;
       create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;
