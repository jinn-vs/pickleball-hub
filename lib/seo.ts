import type { Metadata } from "next";
import { SITE } from "@/site.config";
import type { ArticleWithRelations } from "@/lib/supabase/types";

/** Generic page metadata (static pages, listings). */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${SITE.url}${path}`;
  const img = image ?? `${SITE.url}${SITE.ogImage}`;
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: img, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [img],
      creator: SITE.twitter,
      site: SITE.twitter,
    },
  };
}

/** Full article metadata with SEO-field fallback chain + OG article tags. */
export function buildArticleMetadata(post: ArticleWithRelations, slug: string): Metadata {
  const seoTitle = post.seo_title || post.title;
  const seoDescription = post.seo_description || post.excerpt || SITE.description;
  const seoKeywords =
    post.seo_keywords || (post.tags?.length ? post.tags.join(", ") : post.section || "");
  const image = post.featured_image_url || `${SITE.url}${SITE.ogImage}`;
  const url = `${SITE.url}/blog/${slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords || undefined,
    metadataBase: new URL(SITE.url),
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    creator: post.author?.name ?? undefined,
    publisher: SITE.name,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: seoDescription,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.published_at ?? post.created_at ?? undefined,
      modifiedTime: post.updated_at ?? post.created_at ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      section: post.section ?? post.category?.name ?? undefined,
      tags: post.tags ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      creator: SITE.twitter,
      title: seoTitle,
      description: seoDescription,
      images: [image],
    },
  };
}

/** BlogPosting JSON-LD. */
export function blogPostingSchema(post: ArticleWithRelations, slug: string) {
  const url = `${SITE.url}/blog/${slug}`;
  const wordCount =
    post.body?.replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length || 0;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: post.featured_image_url || `${SITE.url}${SITE.ogImage}`,
    author: {
      "@type": "Person",
      name: post.author?.name || `${SITE.name} Team`,
      ...(post.author?.bio && { description: post.author.bio }),
      ...(post.author?.photo_url && { image: post.author.photo_url }),
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}${SITE.logo}` },
    },
    datePublished: post.published_at || post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.seo_keywords || post.tags?.join(", ") || undefined,
    articleSection: post.section || post.category?.name || undefined,
    wordCount,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
