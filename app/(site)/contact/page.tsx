import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

// Change this to your real contact email.
const CONTACT_EMAIL = "meow@gmail.com";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: `Get in touch with the ${SITE.name} team, questions, feedback, story tips or partnership enquiries.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <div className="mb-4">
            <Breadcrumbs variant="light" items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
          </div>
          <h1 className="text-white text-4xl font-black">Contact Us</h1>
        </div>
      </section>

      <section className="container-site py-10 max-w-3xl">
        <div className="article-body">
          <p>
            We&apos;d love to hear from you. Whether it&apos;s a question, feedback, a correction, a story tip or a
            partnership enquiry, send us a message and we&apos;ll get back to you as soon as we can.
          </p>
          <h2>Email</h2>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold">{CONTACT_EMAIL}</a>
          </p>
          <h2>Write for us</h2>
          <p>
            Interested in contributing? Check out our <a href="/write-for-us">write for us</a> page for guidelines.
          </p>
        </div>
      </section>
    </main>
  );
}
