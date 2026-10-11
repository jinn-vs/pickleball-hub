import Link from "next/link";
import { SITE, NAV_LINKS } from "@/site.config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ backgroundColor: "var(--color-navy)" }} className="mt-16 text-white">
      <div className="container-site py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <span className="text-xl font-black">{SITE.name}</span>
            <p style={{ color: "#aeb4c0" }} className="mt-3 text-sm leading-relaxed">
              {SITE.description}
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wide mb-3">Explore</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} style={{ color: "#aeb4c0" }} className="text-sm hover:text-green transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wide mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" style={{ color: "#aeb4c0" }} className="text-sm hover:text-green transition-colors">About</Link></li>
                <li><Link href="/contact" style={{ color: "#aeb4c0" }} className="text-sm hover:text-green transition-colors">Contact</Link></li>
                <li><Link href="/privacy-policy" style={{ color: "#aeb4c0" }} className="text-sm hover:text-green transition-colors">Privacy</Link></li>
                <li><Link href="/terms" style={{ color: "#aeb4c0" }} className="text-sm hover:text-green transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #2a3350" }} className="mt-8 pt-6 text-xs" >
          <span style={{ color: "#8891a5" }}>© {year} {SITE.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
