import Link from "next/link";
import Image from "next/image";
import { SITE, NAV_LINKS } from "@/site.config";

/**
 * Sportsblog-style top bar: white surface, navy wordmark, green accent nav,
 * Work Sans nav labels. Simple + fast; CSS-only mobile handling for now.
 * logoUrl (admin-uploaded, optional) replaces the text wordmark when set.
 */
export default function Header({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <header
      style={{ borderBottom: "1px solid #e9ecef" }}
      className="sticky top-0 z-50 bg-white"
    >
      <div className="container-site flex items-center justify-between h-16">
        {/* Logo / wordmark */}
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <span className="relative block h-9 w-40">
              <Image src={logoUrl} alt={SITE.name} fill className="object-contain object-left" priority />
            </span>
          ) : (
            <>
              <span
                style={{ backgroundColor: "var(--color-green)" }}
                className="inline-flex h-8 w-8 items-center justify-center rounded text-white font-black"
              >
                P
              </span>
              <span className="text-navy text-xl font-black tracking-tight">{SITE.name}</span>
            </>
          )}
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontFamily: "var(--font-display)" }}
              className="px-4 py-2 text-[13px] font-bold uppercase tracking-wide text-navy hover:text-green transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/write-for-us" className="btn btn-primary ml-2">
            Write for us
          </Link>
        </nav>

        {/* Mobile: link to the menu-less nav for now */}
        <Link
          href="/blog"
          style={{ fontFamily: "var(--font-display)" }}
          className="md:hidden text-[13px] font-bold uppercase text-green"
        >
          News
        </Link>
      </div>
    </header>
  );
}
