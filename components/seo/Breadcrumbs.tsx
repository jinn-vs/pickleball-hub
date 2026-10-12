import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export type Crumb = { name: string; path: string };

/**
 * Visible breadcrumb trail + BreadcrumbList JSON-LD (good for SEO — Google shows
 * the trail in search results). Use variant="light" on dark backgrounds.
 */
export default function Breadcrumbs({
  items,
  variant = "default",
}: {
  items: Crumb[];
  variant?: "default" | "light";
}) {
  const linkStyle = variant === "light" ? { color: "#aeb4c0" } : undefined;
  const currentStyle = variant === "light" ? { color: "#e2e6ee" } : undefined;
  const sepStyle = variant === "light" ? { color: "#5b647a" } : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <span key={it.path} className="flex items-center gap-2">
              {last ? (
                <span
                  className={`truncate max-w-[240px] ${variant === "default" ? "text-ink" : ""}`}
                  style={currentStyle}
                >
                  {it.name}
                </span>
              ) : (
                <Link
                  href={it.path}
                  className={`transition-colors hover:text-green ${variant === "default" ? "text-muted" : ""}`}
                  style={linkStyle}
                >
                  {it.name}
                </Link>
              )}
              {!last && (
                <span className={variant === "default" ? "text-faint" : ""} style={sepStyle}>
                  /
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
