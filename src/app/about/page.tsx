import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { SectionHead } from "@/components/sections/SectionHead";
import { CTA } from "@/components/sections/CTA";
import { Values } from "@/components/sections/Values";
import { Mission } from "@/components/sections/Mission";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { contact, stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Project Payment is an independent payments and e-commerce advisory firm, founded in 2021, with entities in Singapore and Hong Kong.",
};

/** Local time offsets, so the office list tells you when someone is actually awake. */
const OFFICE_META: Record<string, { offset: string; role: string }> = {
  Singapore: { offset: "UTC+8", role: "Head office" },
  "Hong Kong": { offset: "UTC+8", role: "Registered entity" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="We turn complexity into decisions you can defend."
        lead="We partner with organisations to navigate the complexity of digital commerce through strategic technology and payment infrastructure."
      />

      {/* ---------------- Philosophy ---------------- */}
      <section className="section-y border-t border-line" aria-labelledby="position-title">
        <div className="container-site grid gap-[var(--spacing-11)] lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHead
            id="position-title"
            eyebrow="Our philosophy"
            title="Clarity drives growth"
            lead="Technology, operations, and payments are not three problems. Aligning them into a single coherent strategy is what separates a business that scales from one that merely grows."
          />

          <div className="grid gap-[var(--spacing-8)]">
            <Reveal delay={0.12}>
              <Card tilt={false} className="bg-sunken">
                <p className="t-eyebrow">Established 2021</p>
                <p className="text-lg leading-[1.5] text-fg">
                  Project Payment Pte. Ltd. exists to support digital businesses in building
                  resilient and operationally sound commerce ecosystems.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="t-body">
                We do not stop at advice. We act as a strategic partner, enabling businesses to make
                commercially sound decisions that support lasting sustainability and competitive
                positioning, and we stay through the part where those decisions get executed.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section
        className="relative isolate overflow-hidden border-y border-line bg-sunken"
        aria-label="Firm at a glance"
      >
        <div aria-hidden className="aurora pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-site grid grid-cols-2 gap-[var(--spacing-8)] py-[var(--spacing-12)] lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="grid gap-[var(--spacing-2)]">
                <span className="text-[length:clamp(2rem,5vw,var(--text-3xl))] leading-none font-bold tracking-[-0.03em] text-fg-strong tabular-nums">
                  <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                </span>
                <span className="text-sm text-fg-muted">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Same dial as the home page — the four domains are the substance of the
          mission statement, and About is where people come to read it. */}
      <Mission eyebrow="Mission" id="mission-title" />

      {/* ---------------- Values ---------------- */}
      <Values />

      {/* ---------------- Presence ---------------- */}
      <section className="section-y border-t border-line" aria-labelledby="presence-title">
        <div className="container-site">
          <SectionHead
            id="presence-title"
            eyebrow="Where we operate"
            title="Registered where our clients trade"
            lead="Two registered entities in Asia, covering the trading day across the region."
          />

          <ul className="grid gap-[var(--spacing-8)] md:grid-cols-2">
            {contact.offices.map((office, i) => {
              const meta = OFFICE_META[office.region];
              return (
                <li key={office.entity}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <Card className="justify-between">
                      <div className="flex items-center justify-between gap-[var(--spacing-5)]">
                        <span className="t-eyebrow">{office.region}</span>
                        <span className="tag">{meta?.offset}</span>
                      </div>

                      <div>
                        <h3 className="t-h3 text-fg-strong">{office.entity}</h3>
                        <p className="mt-[var(--spacing-2)] text-sm text-accent">{meta?.role}</p>
                      </div>

                      <address className="t-body mt-auto border-t border-line pt-[var(--spacing-6)] text-sm not-italic">
                        {office.address}
                      </address>
                    </Card>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CTA
        title="Partner with us"
        lead="If you are weighing a platform decision, a new market, or a payments problem that has outgrown its owner, we should talk."
      />
    </>
  );
}
