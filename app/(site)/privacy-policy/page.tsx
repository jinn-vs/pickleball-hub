import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects your information.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <div className="mb-4">
            <Breadcrumbs variant="light" items={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]} />
          </div>
          <h1 className="text-white text-4xl font-black">Privacy Policy</h1>
        </div>
      </section>

      <section className="container-site py-10 max-w-3xl">
        <div className="article-body">
          <p><em>Last updated: {new Date().getFullYear()}</em></p>
          <p>
            This Privacy Policy explains how {SITE.name} (&quot;we&quot;, &quot;us&quot;) handles information
            when you visit our website. By using the site, you agree to the practices described here.
          </p>
          <h2>Information we collect</h2>
          <p>
            We may collect basic, non-identifying usage data (such as pages visited and general location) through
            standard analytics to understand how the site is used and improve it. If you contact us by email, we
            keep your message and email address only to respond.
          </p>
          <h2>Cookies & analytics</h2>
          <p>
            We may use cookies and third-party analytics tools to measure traffic and improve the experience. You
            can control cookies through your browser settings.
          </p>
          <h2>Third-party links</h2>
          <p>
            Our articles may link to external websites. We are not responsible for the privacy practices or content
            of those sites.
          </p>
          <h2>Your choices</h2>
          <p>
            You can disable cookies in your browser and opt out of analytics where available. For any privacy
            questions, please <a href="/contact">contact us</a>.
          </p>
          <h2>Changes to this policy</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page.</p>
        </div>
      </section>
    </main>
  );
}
