import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/supabase/queries";
import { buildArticleMetadata, blogPostingSchema, faqSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import ArticleBody from "@/components/content/ArticleBody";

export const revalidate = 3600;
export const dynamicParams = true; // new posts render on-demand instead of 404

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);
  if (!post) return { title: "Post Not Found", description: "This post does not exist." };
  return buildArticleMetadata(post, slug);
}

function readTime(body: string | null) {
  if (!body) return "1 min read";
  const words = body.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);
  if (!post) return notFound();

  const faqs = Array.isArray(post.faqs) ? (post.faqs as { question: string; answer: string }[]) : [];
  const fq = faqSchema(faqs);

  return (
    <main>
      <JsonLd data={blogPostingSchema(post, slug)} />
      {fq && <JsonLd data={fq} />}

      <article className="container-site py-10 max-w-3xl">
        <div className="mb-5">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "News", path: "/blog" },
              { name: post.title, path: `/blog/${slug}` },
            ]}
          />
        </div>

        {(post.section || post.category?.name) && (
          <span style={{ backgroundColor: "var(--color-green)", fontFamily: "var(--font-display)" }} className="inline-block text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded mb-4">
            {post.section || post.category?.name}
          </span>
        )}

        <h1 className="text-navy text-3xl md:text-4xl font-black leading-tight">{post.title}</h1>
        {post.excerpt && <p className="text-muted text-lg mt-3 leading-relaxed">{post.excerpt}</p>}

        <div className="flex items-center gap-3 mt-5 text-sm text-muted">
          {post.author?.photo_url && (
            <span className="relative w-9 h-9 rounded-full overflow-hidden">
              <Image src={post.author.photo_url} alt={post.author.name} fill className="object-cover" />
            </span>
          )}
          {post.author?.name && <span className="font-semibold text-ink">{post.author.name}</span>}
          {post.published_at && (
            <>
              <span>•</span>
              <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
            </>
          )}
          <span>•</span><span>{readTime(post.body)}</span>
        </div>

        {post.featured_image_url && (
          <div className="relative w-full h-80 rounded overflow-hidden my-8">
            <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {post.body && <ArticleBody html={post.body} />}

        {faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-navy text-2xl font-black mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} style={{ border: "1px solid #e9ecef", backgroundColor: "var(--color-light)" }} className="rounded p-4">
                  <p className="text-navy font-bold text-sm">{f.question}</p>
                  <p className="text-muted text-sm mt-1.5 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {post.author?.bio && (
          <div style={{ border: "1px solid #e9ecef", backgroundColor: "var(--color-light)" }} className="rounded-lg p-5 flex gap-4 mt-10">
            {post.author.photo_url && (
              <span className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image src={post.author.photo_url} alt={post.author.name} fill className="object-cover" />
              </span>
            )}
            <div>
              <p className="text-navy font-bold text-sm">{post.author.name}</p>
              <p className="text-muted text-xs mt-1 leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
