/**
 * Single source of truth for branding.
 * To spin up a NEW site from this codebase, change these env vars — not code.
 */
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Pickleball Hub",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Pickleball news, drills, rules, tournaments and how-to guides — everything to level up your game.",
  ogImage: "/og-image.png",
  logo: "/logo.png",
  heroImage: "/hero.jpg", // drop a landscape photo at public/hero.jpg to show it
  twitter: process.env.NEXT_PUBLIC_TWITTER ?? "@pickleball",
  locale: "en_US",
} as const;

/** Primary nav — edit freely as the site grows. */
export const NAV_LINKS = [
  { label: "News", href: "/blog" },
  { label: "Categories", href: "/category" },
  { label: "About", href: "/about" },
] as const;
