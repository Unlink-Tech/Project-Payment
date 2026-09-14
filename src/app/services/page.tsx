import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { ArrowLink } from "@/components/ui/Button";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "E-commerce platform consultancy, foreign company management, and e-commerce operations advisory that is independent and vendor-neutral.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Architect the platform. Streamline the payments. Hold the operations."
        lead="We partner with growth-focused businesses to ensure performance, compliance, and sustainable success across every market they trade in."
      >
        <Reveal delay={0.4} className="mt-[var(--spacing-10)]">
          <ul className="flex flex-wrap gap-[var(--spacing-5)]">
            {services.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="tag transition-colors duration-[var(--motion-fast)]
                             hover:border-line-strong hover:text-fg-strong"
                >
                  {s.index}. {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </PageHero>

      {/* ---------------- Service detail ----------------
          Artwork is shown outright here rather than behind a hover, since this
          is the page people arrive on to evaluate a specific practice. The
          column order alternates so the page does not read as one long column. */}
      {services.map((service, i) => {
        const flipped = i % 2 === 1;
        return (
          <section
            key={service.slug}
            id={service.slug}
            aria-labelledby={`${service.slug}-title`}
            className="section-y scroll-mt-24 border-t border-line"
          >
            <div className="container-site grid gap-[var(--spacing-10)] lg:grid-cols-[0.9fr_1.1fr]">
              {/* Poster */}
              <div className={flipped ? "lg:order-2" : ""}>
                <Reveal>
                  <div className="flex items-baseline gap-[var(--spacing-6)]">
                    <span className="text-[length:clamp(3rem,8vw,var(--text-3xl))] leading-none font-bold tracking-[-0.04em] text-accent">
                      {service.index}
                    </span>
                    {/* Trailing full stop reads wrong inside an uppercase pill. */}
                    <span className="tag">{service.short.replace(/\.$/, "")}</span>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 id={`${service.slug}-title`} className="t-h1 mt-[var(--spacing-6)]">
                    {service.title}
                  </h2>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="t-body mt-[var(--spacing-7)]">{service.summary}</p>
                </Reveal>

                {/* Always-visible artwork */}
                <Reveal delay={0.24}>
                  <figure className="service-figure group mt-[var(--spacing-9)]">
                    <img
                      src={service.art}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--motion-slow)]
                                 ease-[var(--ease-out-soft)] group-hover:scale-105"
                    />
                    <span aria-hidden className="service-figure__veil" />
                    <figcaption className="service-figure__caption">
                      <span aria-hidden className="text-accent">
                        ◆
                      </span>
                      {service.hoverLine}
                    </figcaption>
                  </figure>
                </Reveal>
              </div>

              {/* Capabilities + outcome */}
              <div className={`grid content-start gap-[var(--spacing-8)] ${flipped ? "lg:order-1" : ""}`}>
                <Reveal delay={0.12}>
                  <h3 className="t-eyebrow">What this covers</h3>
                </Reveal>

                <ul className="grid gap-[var(--spacing-1)]">
                  {service.capabilities.map((c, ci) => (
                    <li key={c}>
                      <Reveal delay={0.16 + ci * 0.05}>
                        <div
                          className="group flex items-start gap-[var(--spacing-6)] border-b border-line
                                     py-[var(--spacing-6)] transition-colors duration-[var(--motion-fast)]
                                     hover:border-brand-400"
                        >
                          <span
                            aria-hidden
                            className="mt-1 text-sm text-accent transition-transform
                                       duration-[var(--motion-fast)] group-hover:translate-x-1"
                          >
                            →
                          </span>
                          <span className="text-md text-fg">{c}</span>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ul>

                <Reveal delay={0.24}>
                  <Card tilt={false} className="bg-sunken">
                    <h3 className="t-eyebrow">The outcome</h3>
                    <p className="text-lg leading-[1.45] text-fg">{service.outcome}</p>
                  </Card>
                </Reveal>
              </div>
            </div>

            {i === services.length - 1 && (
              <div className="container-site mt-[var(--spacing-11)]">
                <Reveal>
                  <ArrowLink href="/contact">Discuss your engagement</ArrowLink>
                </Reveal>
              </div>
            )}
          </section>
        );
      })}

      {/* Same timeline component as the home page, relabelled for this context. */}
      <Process
        id="process-title"
        eyebrow="Engagement model"
        title="How an engagement actually runs"
        lead="Four movements, fixed sequence. You know at every point what is being produced, how long it takes, and who owns the next step."
      />

      <CTA
        title="Which practice fits your problem?"
        lead="Tell us where it hurts and we will tell you whether we are the right party to fix it."
      />
    </>
  );
}
