import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms and conditions for using ${SITE.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <div className="mb-4">
            <Breadcrumbs variant="light" items={[{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }]} />
          </div>
          <h1 className="text-white text-4xl font-black">Terms of Service</h1>
        </div>
      </section>

      <section className="container-site py-10 max-w-3xl">
        <div className="article-body">
          <p><em>Last updated: {new Date().getFullYear()}</em></p>
          <p>
            By accessing and using {SITE.name}, you agree to these Terms of Service. If you do not agree, please
            do not use the site.
          </p>
          <h2>Use of content</h2>
          <p>
            All content on this site is for informational purposes only. You may read and share links to our
            articles, but you may not copy, reproduce or republish our content without permission.
          </p>
          <h2>No professional advice</h2>
          <p>
            Our guides on technique, fitness and training are general information, not professional medical or
            coaching advice. Always play within your limits and consult a professional where appropriate.
          </p>
          <h2>External links & accuracy</h2>
          <p>
            We aim to keep information accurate and up to date but make no guarantees. We are not responsible for
            content on external websites we link to.
          </p>
          <h2>Changes</h2>
          <p>
            We may update these terms at any time. Continued use of the site means you accept the current terms.
          </p>
          <h2>Contact</h2>
          <p>Questions about these terms? <a href="/contact">Get in touch</a>.</p>
        </div>
      </section>
    </main>
  );
}
