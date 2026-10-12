import Link from "next/link";
import { SITE } from "@/site.config";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Articles", href: "/admin/dashboard/articles" },
  { label: "Categories", href: "/admin/dashboard/categories" },
  { label: "Authors", href: "/admin/dashboard/authors" },
  { label: "Site Settings", href: "/admin/dashboard/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }} className="flex">
      <aside style={{ backgroundColor: "#111827", borderRight: "1px solid #1f2937", width: 240 }} className="flex flex-col flex-shrink-0">
        <div style={{ borderBottom: "1px solid #1f2937" }} className="px-6 py-5">
          <Link href="/admin/dashboard" className="text-white font-black text-lg">{SITE.name}</Link>
          <p style={{ color: "#6b7280" }} className="text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} style={{ color: "#9ca3af" }} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors">
              {i.label}
            </Link>
          ))}
        </nav>
        <div style={{ borderTop: "1px solid #1f2937" }} className="px-3 py-4 space-y-1">
          <Link href="/" target="_blank" style={{ color: "#6b7280" }} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors">View Site ↗</Link>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" style={{ color: "#6b7280" }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-red-400 transition-colors">Sign Out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
