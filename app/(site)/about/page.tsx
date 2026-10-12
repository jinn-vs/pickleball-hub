import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: `Learn about ${SITE.name} — our mission to bring you the best pickleball news, drills, rules and guides.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <div className="mb-4">
            <Breadcrumbs variant="light" items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
          </div>
          <h1 className="text-white text-4xl font-black">About {SITE.name}</h1>
        </div>
      </section>

      <section className="container-site py-10 max-w-3xl">
        <div className="article-body">
          <p>
            {SITE.name} is your home for everything pickleball — the fastest-growing sport in the world.
            We cover the latest news, practical drills, clear rules explainers, tournament coverage and
            beginner-to-advanced guides to help you grow your game.
          </p>
          <h2>What we do</h2>
          <p>
            Our goal is simple: make it easier to learn, improve and enjoy pickleball. Whether you just
            picked up a paddle or you&apos;re chasing your next tournament win, you&apos;ll find
            straightforward, well-researched content written for real players.
          </p>
          <h2>Why trust us</h2>
          <p>
            Every article is written and reviewed with care, kept up to date, and focused on being genuinely
            useful — not fluff. We&apos;re players too, and we write the kind of guides we wish we&apos;d had
            when we started.
          </p>
          <h2>Get in touch</h2>
          <p>
            Have a question, a story tip, or feedback? Head over to our{" "}
            <a href="/contact">contact page</a> — we&apos;d love to hear from you.
          </p>
        </div>
      </section>
    </main>
  );
}
