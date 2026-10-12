import { z } from "zod";

const faq = z.object({ question: z.string(), answer: z.string() });

export const articleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  excerpt: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  section: z.string().optional().nullable(),
  author_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).optional(),
  faqs: z.array(faq).optional(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(180).optional().nullable(),
  seo_keywords: z.string().optional().nullable(),
  featured_image_url: z.string().url().optional().nullable(),
  is_published: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
});

export const authorSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  bio: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
});

export const settingsSchema = z.object({
  hero_title: z.string().max(160).optional().nullable(),
  hero_subtitle: z.string().max(300).optional().nullable(),
  hero_image_url: z.string().url().optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
});

export type ArticleInput = z.infer<typeof articleSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type AuthorInput = z.infer<typeof authorSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
