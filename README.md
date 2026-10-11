# Pickleball Hub

SEO-first pickleball news + gear site. Next.js 16 (App Router) · React 19 · TypeScript ·
Tailwind v4 · Supabase (DB + Storage) · deployed on Vercel. Reusable admin engine —
spin up a new site by changing env vars, not code.

## Stack & principles

- **Reads** use the Supabase *anon* key and are protected by **RLS** (`lib/supabase/db.ts`).
- **Writes** use the *service-role* key and run only inside authenticated `/api/*` routes
  (`lib/supabase/admin.ts`), after `requireAdmin()` + Zod validation.
- **Rendering**: static SSG + ISR (`export const revalidate = 3600`) + `generateStaticParams`.
- **SEO engine**: `lib/seo.ts` (`buildMetadata`, `buildArticleMetadata`, `blogPostingSchema`, …).
- **Branding**: one file — `site.config.ts` + env vars.

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in the values
npm run dev                     # http://localhost:3000
```

### 1. Supabase
1. Create a project at supabase.com.
2. SQL editor → run `supabase/migrations/0000_init.sql`, then `0001_rls.sql`.
3. Storage → create a **public** bucket named `media`.
4. Copy Project URL + anon key + service-role key into `.env.local`.
5. Auth → **turn OFF open sign-ups** (Authentication → Providers → Email → disable
   "Allow new users to sign up"), then create your admin user manually
   (Authentication → Users → Add user). Put that email in `ADMIN_EMAILS`.

### 2. Run & log in
- Visit `/admin/login`, sign in with the admin user.
- Add categories → authors → articles. Published articles show on `/` and `/blog`.

### 3. Deploy (Vercel)
- Import the repo, add the same env vars (set `NEXT_PUBLIC_SITE_URL` to the real domain).
- Build is static where possible; ISR revalidates on write via `revalidatePath`.

## What's built so far (foundation)

```
site.config.ts            brand/domain (env-driven)
next.config.ts            image hosts + security headers
proxy.ts                  Next 16 middleware — admin auth + role gate
app/
  layout.tsx              fonts (Lato + Work Sans), header/footer, WebSite schema
  page.tsx                home — green hero band + latest posts grid
  globals.css             design tokens from the sportsblog reference
components/
  layout/Header.tsx  Footer.tsx
  content/PostCard.tsx
  seo/JsonLd.tsx          (escaped)
lib/
  supabase/ db.ts admin.ts server.ts client.ts queries.ts types.ts
  auth.ts  seo.ts  validation.ts
supabase/migrations/ 0000_init.sql  0001_rls.sql
```

## Next up (not yet built)

- `/blog`, `/blog/[slug]` (article page + `buildArticleMetadata` + `blogPostingSchema`)
- `/category`, `/category/[slug]`, `/gear`, `/gear/[slug]`, `/compare/*`
- `/go/[slug]` affiliate redirect + click tracking
- `app/admin/*` dashboard (articles/gear/categories/authors) with Tiptap editor + **SEO panel**
- `/api/*` write routes (requireAdmin + Zod + inline `revalidatePath`)
- `app/sitemap.ts`, `app/robots.ts`, marketing pages
- Image upload route (type + size validation) → `media` bucket / S3

## Design tokens (from sportsblog.com)

- Accent green `#28a745`, hero band `#6aa959`, navy `#141a28`, ink `#333`
- Fonts: **Lato** (headings 900 / body 700), **Work Sans** (subheads 800 / buttons 700)
- Radius `4px`, transitions `0.15s ease-in-out`
