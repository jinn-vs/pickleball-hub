import Link from "next/link";
import { getLatestArticles, getAllCategories, getSiteSettings } from "@/lib/supabase/queries";
import { SITE } from "@/site.config";
import PostCard from "@/components/content/PostCard";

export const revalidate = 3600;

const DEFAULT_HERO_TITLE = "Everything pickleball — news, drills & guides to grow your game.";
const DEFAULT_HERO_SUBTITLE = "Techniques, rules, tournaments and the latest from the courts.";

export default async function HomePage() {
  const [posts, categories, settings] = await Promise.all([
    getLatestArticles(9),
    getAllCategories(),
    getSiteSettings(),
  ]);
  const [hero, ...rest] = posts;

  // Hero image: admin-uploaded (Supabase) first, else the bundled /hero.jpg fallback.
  const heroImage = settings?.hero_image_url || SITE.heroImage;
  const heroTitle = settings?.hero_title || DEFAULT_HERO_TITLE;
  const heroSubtitle = settings?.hero_subtitle || DEFAULT_HERO_SUBTITLE;

  return (
    <main>
      {/* ───── Hero band — photo with green/navy overlay, green fallback ───── */}
      <section
        style={{
          backgroundColor: "var(--color-green-hero)",
          backgroundImage: `linear-gradient(115deg, rgba(40,167,69,0.80) 0%, rgba(20,26,40,0.72) 100%), url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-site py-16 md:py-24">
          <p
            style={{ fontFamily: "var(--font-display)" }}
            className="text-white/90 text-xs font-bold uppercase tracking-[0.2em] mb-3"
          >
            {SITE.name}
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-black leading-tight max-w-3xl">
            {heroTitle}
          </h1>
          <p className="text-white/90 text-lg mt-4 max-w-2xl">
            {heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/blog" className="btn" style={{ backgroundColor: "white", color: "var(--color-green-dark)" }}>
              Read the latest
            </Link>
            <Link href="/category" className="btn btn-outline" style={{ borderColor: "white", color: "white" }}>
              Browse topics
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Category chips ───── */}
      {categories.length > 0 && (
        <section className="border-b" style={{ borderColor: "#e9ecef" }}>
          <div className="container-site py-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                style={{ fontFamily: "var(--font-display)" }}
                className="rounded border px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy hover:bg-green hover:text-white hover:border-green transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ───── Latest posts ───── */}
      <section className="container-site py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-navy text-3xl font-black">Latest</h2>
          <Link href="/blog" className="text-sm font-bold text-green uppercase" style={{ fontFamily: "var(--font-display)" }}>
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div
            style={{ border: "1px dashed #ced4da", backgroundColor: "var(--color-light)" }}
            className="rounded p-12 text-center"
          >
            <p className="text-navy font-black text-lg">No articles yet</p>
            <p className="text-muted text-sm mt-2">
              Head to <span className="font-semibold">/admin/login</span>, add your first post, and it will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Featured first post wide */}
            {hero && (
              <div className="mb-8">
                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                  <PostCard post={hero} />
                  <div className="grid gap-4">
                    {rest.slice(0, 3).map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="flex gap-4 rounded bg-white p-3 hover:shadow-sm transition-shadow"
                        style={{ border: "1px solid #e9ecef" }}
                      >
                        <div className="flex-1">
                          <span className="text-[11px] font-bold uppercase text-green" style={{ fontFamily: "var(--font-display)" }}>
                            {p.section || p.category?.name || "News"}
                          </span>
                          <h3 className="text-navy font-black leading-snug clamp-2 mt-1">{p.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rest in a grid */}
            {rest.length > 3 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(3).map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
