import Link from "next/link";

import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { SectionHead } from "@/components/sections/SectionHead";
import { CTA } from "@/components/sections/CTA";
import { WhyUs } from "@/components/sections/WhyUs";
import { Mission } from "@/components/sections/Mission";
import { Process } from "@/components/sections/Process";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { Figure } from "@/components/ui/Figure";
import { faqs, services } from "@/lib/site";

/**
 * Home page.
 *
 * Imagery carries the narrative: each practice is a wide row with a large
 * image on alternating sides.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee
        items={[
          "Platform architecture",
          "Payment optimisation",
          "Cross-border expansion",
          "Risk mitigation",
          "Operational advisory",
          "Vendor neutrality",
        ]}
      />

      {/* ---------------- Services as editorial rows ---------------- */}
      <section className="section-y" aria-labelledby="services-title">
        <div className="container-site">
          <SectionHead
            id="services-title"
            eyebrow="What we do"
            title="Three practices, one operating view"
            lead="We partner with growth-focused businesses to architect scalable platforms, streamline payment flows, and strengthen the operational frameworks underneath them."
          />
        </div>

        <div className="container-site grid gap-[var(--spacing-12)]">
          {services.map((service, i) => (
            <article
              key={service.slug}
              id={service.slug}
              className="grid items-center gap-[var(--spacing-10)] lg:grid-cols-2"
            >
              {/* Odd rows put the image on the right. The order sits on the
                  Reveal wrapper, since that is the actual grid child. */}
              <Reveal delay={0.05} className={i % 2 === 1 ? "lg:order-2" : ""}>
                <Figure
                  src={service.art}
                  alt={`Placeholder image for ${service.title}`}
                  ratio="4/3"
                />
              </Reveal>

              <Reveal delay={0.12}>
                <p className="t-eyebrow">{service.index}</p>
                <h3 className="t-h2 mt-[var(--spacing-5)]">{service.title}</h3>
                <p className="t-body mt-[var(--spacing-6)]">{service.summary}</p>
                <ul className="mt-[var(--spacing-8)] grid gap-[var(--spacing-3)]">
                  {service.capabilities.map((c) => (
                    <li key={c} className="flex gap-[var(--spacing-5)] text-sm text-fg-muted">
                      <span aria-hidden className="text-accent">
                        &middot;
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services#${service.slug}`}
                  className="mt-[var(--spacing-8)] inline-flex items-center gap-[var(--spacing-3)]
                             text-fg-strong underline underline-offset-4 hover:text-accent"
                >
                  See the detail <span aria-hidden>→</span>
                </Link>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <Process />

      {/* A portrait image gives the argument section a human anchor. */}
      <section className="section-y border-t border-line" aria-label="In practice">
        <div className="container-site grid items-center gap-[var(--spacing-11)] lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Figure
              src="/placeholders/portrait-1.webp"
              alt="How we work"
              ratio="3/4"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-eyebrow">How we work</p>
            <h2 className="t-h1 mt-[var(--spacing-5)]">
              The people doing the work are the people you meet
            </h2>
            <p className="t-body mt-[var(--spacing-7)]">
              No hand-off to a delivery team you have never spoken to. The advisor who maps your
              platform is the one who sits in the vendor negotiation and reviews the integration.
            </p>
          </Reveal>
        </div>
      </section>

      <WhyUs />

      <Mission />

      {/* ---------------- FAQ ---------------- */}
      <section className="section-y border-t border-line" aria-labelledby="faq-title">
        <div className="container-site grid gap-[var(--spacing-10)] lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead id="faq-title" eyebrow="Questions" title="Before you get in touch" />
            <Reveal delay={0.2}>
              <p className="t-body text-sm">
                Something not covered here?{" "}
                <Link
                  href="/contact"
                  className="text-fg-strong underline underline-offset-4 hover:text-accent"
                >
                  Ask us directly
                </Link>
                .
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}
