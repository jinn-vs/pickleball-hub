import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

const CONTACT_EMAIL = "meow@gmail.com";

export const metadata: Metadata = buildMetadata({
  title: "Write for Us",
  description: `Contribute a guest post to ${SITE.name}. Share your pickleball knowledge with a growing community of players.`,
  path: "/write-for-us",
});

export default function WriteForUsPage() {
  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <div className="mb-4">
            <Breadcrumbs variant="light" items={[{ name: "Home", path: "/" }, { name: "Write for us", path: "/write-for-us" }]} />
          </div>
          <h1 className="text-white text-4xl font-black">Write for Us</h1>
        </div>
      </section>

      <section className="container-site py-10 max-w-3xl">
        <div className="article-body">
          <p>
            Love pickleball and love writing? We welcome guest contributions from players, coaches and fans.
            Share your drills, tips, tournament reports or opinion pieces with the {SITE.name} community.
          </p>
          <h2>What we&apos;re looking for</h2>
          <ul>
            <li>Original, helpful content that hasn&apos;t been published elsewhere</li>
            <li>Clear, well-structured writing aimed at real players</li>
            <li>Topics like technique, drills, rules, gear, strategy, fitness and tournaments</li>
          </ul>
          <h2>How to pitch</h2>
          <p>
            Email us a short pitch (2–3 sentences) with your topic idea and a bit about yourself at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold">{CONTACT_EMAIL}</a>. If it&apos;s a
            fit, we&apos;ll reply with next steps.
          </p>
        </div>
      </section>
    </main>
  );
}
