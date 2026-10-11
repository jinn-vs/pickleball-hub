import Link from "next/link";
import Image from "next/image";
import type { ArticleWithRelations } from "@/lib/supabase/types";

/** Sportsblog-style post card: 16:9 image, category pill, heavy Lato title. */
export default function PostCard({ post }: { post: ArticleWithRelations }) {
  const label = post.section || post.category?.name;
  return (
    <article className="group overflow-hidden rounded bg-white" style={{ border: "1px solid #e9ecef" }}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative w-full" style={{ aspectRatio: "16 / 9", backgroundColor: "var(--color-light)" }}>
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-150 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-faint text-sm">No image</div>
          )}
          {label && (
            <span
              style={{ backgroundColor: "var(--color-green)", fontFamily: "var(--font-display)" }}
              className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
            >
              {label}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-navy text-lg font-black leading-snug clamp-2 group-hover:text-green transition-colors">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && <p className="mt-2 text-sm text-muted clamp-3">{post.excerpt}</p>}
        <div className="mt-3 flex items-center gap-2 text-xs text-faint">
          {post.author?.name && <span className="font-semibold text-ink">{post.author.name}</span>}
          {post.published_at && (
            <>
              <span>•</span>
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
